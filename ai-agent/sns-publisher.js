/**
 * 새론금융대부중개 — SNS 자동 게시 관리자
 * =====================================================
 * 생성된 콘텐츠를 각 SNS 플랫폼에 자동으로 게시합니다.
 */

const https = require('https');
const config = require('./config');

class SNSPublisher {
  
  // ─── 텔레그램 알림 ────────────────────────────────
  async sendTelegram(message) {
    const token = config.telegram.botToken;
    const chatId = config.telegram.chatId;
    
    if (!token || !chatId) {
      console.warn('⚠️  텔레그램 설정 없음. .env에 TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID 추가 필요');
      return false;
    }

    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const body = JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' });

    return new Promise((resolve) => {
      const req = https.request(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          const parsed = JSON.parse(data);
          resolve(parsed.ok);
        });
      });
      req.on('error', () => resolve(false));
      req.write(body);
      req.end();
    });
  }

  // ─── 인스타그램 게시 ──────────────────────────────
  async postToInstagram(content, imageUrl = null) {
    const { accessToken, userId } = config.sns.instagram;
    
    if (!accessToken || !userId) {
      console.warn('⚠️  인스타그램 API 키 미설정');
      return { success: false, reason: 'API 키 미설정' };
    }

    try {
      // Step 1: 미디어 컨테이너 생성
      const mediaBody = JSON.stringify({
        caption: content.content,
        access_token: accessToken,
        ...(imageUrl ? { image_url: imageUrl } : { media_type: 'REELS' }),
      });

      const mediaResult = await this._graphApiPost(
        `/${userId}/media`, mediaBody, accessToken
      );

      if (!mediaResult.id) throw new Error('미디어 컨테이너 생성 실패');

      // Step 2: 게시 (30초 대기 후)
      await new Promise(r => setTimeout(r, 30000));
      const publishResult = await this._graphApiPost(
        `/${userId}/media_publish`,
        JSON.stringify({ creation_id: mediaResult.id, access_token: accessToken }),
        accessToken
      );

      return { success: true, postId: publishResult.id, platform: 'instagram' };
    } catch (err) {
      return { success: false, reason: err.message, platform: 'instagram' };
    }
  }

  // ─── 페이스북 페이지 게시 ──────────────────────────
  async postToFacebook(content) {
    const { accessToken, pageId } = config.sns.facebook;
    
    if (!accessToken || !pageId) {
      console.warn('⚠️  페이스북 API 키 미설정');
      return { success: false, reason: 'API 키 미설정' };
    }

    try {
      const body = JSON.stringify({
        message: content.content,
        access_token: accessToken,
      });

      const result = await this._graphApiPost(`/${pageId}/feed`, body, accessToken);
      return { success: true, postId: result.id, platform: 'facebook' };
    } catch (err) {
      return { success: false, reason: err.message, platform: 'facebook' };
    }
  }

  // ─── 네이버 블로그 게시 ────────────────────────────
  async postToNaverBlog(blogPost) {
    // 네이버 블로그 API는 OAuth 인증 필요
    // 현재 단계: 파일로 저장 후 수동 업로드 또는 네이버 블로그 Open API 활용
    const { clientId, blogId } = config.sns.naver;

    if (!clientId) {
      // API 없을 때는 파일로 저장
      const fs = require('fs');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
      const filename = `./generated/naver_${timestamp}.txt`;
      
      const dir = require('path').dirname(filename);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      
      fs.writeFileSync(filename, `제목: ${blogPost.title}\n\n${blogPost.content}`, 'utf8');
      
      return {
        success: true,
        platform: 'naver_blog',
        note: `API 미설정 → 파일 저장: ${filename}`,
        manual: true,
      };
    }

    // 네이버 블로그 Open API 사용 (cafearticle.json)
    try {
      const body = JSON.stringify({
        clubid: blogId,
        subject: blogPost.title,
        content: blogPost.content,
      });

      // 네이버 Open API 호출
      const result = await this._naverApiPost('/cafearticle.json', body);
      return { success: true, platform: 'naver_blog', postId: result.message?.result?.articleid };
    } catch (err) {
      return { success: false, reason: err.message, platform: 'naver_blog' };
    }
  }

  // ─── 카카오 채널 메시지 ────────────────────────────
  async sendKakaoMessage(message) {
    const { accessToken } = config.sns.kakao;
    
    if (!accessToken) {
      console.warn('⚠️  카카오 API 키 미설정');
      return { success: false, reason: 'API 키 미설정' };
    }

    try {
      const body = JSON.stringify({
        template_object: {
          object_type: 'text',
          text: message.content.substring(0, 200),  // 카카오 200자 제한
          link: { web_url: config.company.website },
        },
      });

      const result = await this._kakaoApiPost('/v2/api/talk/memo/default/send', body, accessToken);
      return { success: true, platform: 'kakao', result };
    } catch (err) {
      return { success: false, reason: err.message, platform: 'kakao' };
    }
  }

  // ─── 결과 저장 (로컬 로그) ────────────────────────
  saveToLog(results) {
    const fs = require('fs');
    const logDir = './logs';
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

    const today = new Date().toISOString().split('T')[0];
    const logFile = `${logDir}/post_log_${today}.json`;

    let logs = [];
    if (fs.existsSync(logFile)) {
      try { logs = JSON.parse(fs.readFileSync(logFile, 'utf8')); } catch(e) {}
    }
    
    logs.push({ timestamp: new Date().toISOString(), results });
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2), 'utf8');
    
    return logFile;
  }

  // ─── HTTP 유틸리티 ────────────────────────────────
  _graphApiPost(path, body, token) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'graph.facebook.com',
        path: `/v18.0${path}?access_token=${token}`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      };
      const req = https.request(options, res => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => {
          const parsed = JSON.parse(data);
          if (parsed.error) reject(new Error(parsed.error.message));
          else resolve(parsed);
        });
      });
      req.on('error', reject);
      req.write(body);
      req.end();
    });
  }

  _naverApiPost(path, body) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'openapi.naver.com',
        path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Naver-Client-Id': config.sns.naver.clientId,
          'X-Naver-Client-Secret': config.sns.naver.clientSecret,
        },
      };
      const req = https.request(options, res => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => resolve(JSON.parse(data)));
      });
      req.on('error', reject);
      req.write(body);
      req.end();
    });
  }

  _kakaoApiPost(path, body, token) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'kapi.kakao.com',
        path,
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      };
      const req = https.request(options, res => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => resolve(JSON.parse(data)));
      });
      req.on('error', reject);
      req.write(body);
      req.end();
    });
  }
}

module.exports = SNSPublisher;
