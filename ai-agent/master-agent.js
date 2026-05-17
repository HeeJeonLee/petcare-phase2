/**
 * 새론금융대부중개 — 메인 AI 에이전트
 * =====================================================
 * 이 파일 하나를 실행하면 모든 것이 자동으로 됩니다.
 * 
 * 실행 방법: node master-agent.js
 * 자동 실행: GitHub Actions (매일 오전 9시 자동 실행)
 */

require('dotenv').config();

const config = require('./config');
const ContentGenerator = require('./content-generator');
const LegalChecker = require('./legal-checker');
const SNSPublisher = require('./sns-publisher');

class MasterAgent {
  constructor() {
    this.generator = new ContentGenerator();
    this.checker = new LegalChecker();
    this.publisher = new SNSPublisher();
    this.results = [];
    this.errors = [];
  }

  /**
   * 메인 실행 함수 — 매일 오전 9시 자동 호출
   */
  async run() {
    const startTime = Date.now();
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=일, 1=월, 2=화, ...
    
    console.log(`\n${'='.repeat(50)}`);
    console.log(`🤖 새론금융 AI 에이전트 시작`);
    console.log(`📅 ${today.toLocaleString('ko-KR')}`);
    console.log(`${'='.repeat(50)}\n`);

    // 시작 알림 (텔레그램)
    await this.publisher.sendTelegram(
      `🤖 <b>새론금융 AI 에이전트 시작</b>\n📅 ${today.toLocaleDateString('ko-KR')}\n잠시 후 오늘의 SNS 게시가 완료됩니다.`
    );

    // 오늘의 주제 선택
    const topic = this.generator.selectTodayTopic(dayOfWeek);
    console.log(`📌 오늘의 주제: ${topic.topic} (${topic.category})`);

    // 요일별 SNS 게시
    const tasks = [];

    // 네이버 블로그 (월, 금)
    if (config.schedule.naverBlogDays.includes(dayOfWeek)) {
      tasks.push(this._runTask('네이버 블로그', () => this._postNaver(topic)));
    }

    // 인스타그램 + 페이스북 (화, 토)
    if (config.schedule.instagramDays.includes(dayOfWeek)) {
      tasks.push(this._runTask('인스타그램', () => this._postInstagram(topic)));
      tasks.push(this._runTask('페이스북', () => this._postFacebook(topic)));
    }

    // 카카오 채널 (수, 일)
    if (config.schedule.kakaoDays.includes(dayOfWeek)) {
      tasks.push(this._runTask('카카오 채널', () => this._postKakao(topic)));
    }

    // 유튜브 쇼츠 스크립트 (목)
    if (config.schedule.youtubeDays.includes(dayOfWeek)) {
      tasks.push(this._runTask('유튜브 스크립트', () => this._generateYoutube(topic)));
    }

    // 모든 작업 순차 실행
    for (const task of tasks) {
      await task();
    }

    // 결과 저장
    const logFile = this.publisher.saveToLog(this.results);
    
    // 완료 보고서 텔레그램 발송
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    await this._sendCompletionReport(elapsed, logFile);

    console.log(`\n✅ 오늘 작업 완료! (${elapsed}초 소요)`);
    return { success: this.errors.length === 0, results: this.results, errors: this.errors };
  }

  // ─── 개별 작업 실행 래퍼 ─────────────────────────
  _runTask(name, fn) {
    return async () => {
      console.log(`\n📝 ${name} 작업 시작...`);
      try {
        const result = await fn();
        if (result) {
          this.results.push({ name, ...result });
          console.log(`✅ ${name} 완료`);
        }
      } catch (err) {
        const errInfo = { name, error: err.message };
        this.errors.push(errInfo);
        console.error(`❌ ${name} 실패: ${err.message}`);
        await this.publisher.sendTelegram(
          `🚨 <b>${name} 오류 발생</b>\n오류: ${err.message}`
        );
      }
    };
  }

  // ─── 네이버 블로그 ────────────────────────────────
  async _postNaver(topic) {
    const post = await this.generator.generateNaverBlog(topic);
    
    if (!post.legalCheck.pass) {
      throw new Error(`법규 검사 실패: ${post.legalCheck.missing.join(', ')}`);
    }
    
    const result = await this.publisher.postToNaverBlog(post);
    return { platform: 'naver', title: post.title, legal: post.legalCheck.pass, ...result };
  }

  // ─── 인스타그램 ───────────────────────────────────
  async _postInstagram(topic) {
    const post = await this.generator.generateSocialPost(topic, 'instagram');
    
    if (!post.legalCheck.pass) {
      throw new Error(`법규 검사 실패: ${post.legalCheck.forbidden.join(', ')}`);
    }
    
    const result = await this.publisher.postToInstagram(post);
    return { platform: 'instagram', legal: post.legalCheck.pass, ...result };
  }

  // ─── 페이스북 ─────────────────────────────────────
  async _postFacebook(topic) {
    const post = await this.generator.generateSocialPost(topic, 'facebook');
    
    if (!post.legalCheck.pass) {
      throw new Error(`법규 검사 실패: ${post.legalCheck.forbidden.join(', ')}`);
    }
    
    const result = await this.publisher.postToFacebook(post);
    return { platform: 'facebook', legal: post.legalCheck.pass, ...result };
  }

  // ─── 카카오 채널 ──────────────────────────────────
  async _postKakao(topic) {
    const message = await this.generator.generateKakaoMessage(topic);
    
    if (!message.legalCheck.pass) {
      throw new Error(`법규 검사 실패`);
    }
    
    const result = await this.publisher.sendKakaoMessage(message);
    return { platform: 'kakao', legal: message.legalCheck.pass, ...result };
  }

  // ─── 유튜브 스크립트 ──────────────────────────────
  async _generateYoutube(topic) {
    const script = await this.generator.generateYoutubeScript(topic);
    
    // 스크립트를 파일로 저장 (영상 제작 참고용)
    const fs = require('fs');
    const dir = './generated/youtube';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    const filename = `${dir}/script_${Date.now()}.txt`;
    fs.writeFileSync(filename, `주제: ${topic.topic}\n\n${script.script}\n\n---설명---\n${script.description}`, 'utf8');
    
    return { platform: 'youtube', scriptFile: filename, legal: script.legalCheck.pass };
  }

  // ─── 완료 보고서 ──────────────────────────────────
  async _sendCompletionReport(elapsed, logFile) {
    const successCount = this.results.filter(r => r.success !== false).length;
    const failCount = this.errors.length;
    const today = new Date().toLocaleDateString('ko-KR');

    let msg = `✅ <b>새론금융 AI 에이전트 완료</b>\n`;
    msg += `📅 ${today}\n`;
    msg += `⏱️ 소요시간: ${elapsed}초\n\n`;
    msg += `📊 <b>오늘 결과:</b>\n`;
    msg += `✅ 성공: ${successCount}건\n`;
    
    this.results.forEach(r => {
      const icon = r.success === false ? '❌' : '✅';
      msg += `  ${icon} ${r.name}`;
      if (r.manual) msg += ' (파일저장)';
      if (r.postId) msg += ` (ID: ${r.postId})`;
      msg += '\n';
    });

    if (failCount > 0) {
      msg += `\n❌ 실패: ${failCount}건\n`;
      this.errors.forEach(e => {
        msg += `  🚫 ${e.name}: ${e.error}\n`;
      });
    }

    msg += `\n📁 로그: ${logFile}`;
    msg += `\n\n💡 문의 전화 상담만 직접 해주시면 됩니다!`;
    msg += `\n📞 1555-2137`;

    await this.publisher.sendTelegram(msg);
  }

  /**
   * 비상 중단 — 텔레그램에서 "중단" 메시지 받으면 실행
   */
  async emergencyStop() {
    console.log('🛑 비상 중단 실행!');
    await this.publisher.sendTelegram('🛑 AI 에이전트 긴급 중단됨');
    process.exit(0);
  }
}

// ── 직접 실행 ───────────────────────────────────────
if (require.main === module) {
  const agent = new MasterAgent();
  
  // 실행 모드 확인
  const args = process.argv.slice(2);
  
  if (args.includes('--test')) {
    // 테스트 모드: SNS 게시 없이 콘텐츠만 생성
    console.log('🧪 테스트 모드 (실제 게시 없음)');
    const topic = agent.generator.selectTodayTopic(new Date().getDay());
    console.log('오늘의 주제:', topic.topic);
    console.log('법규 검사기 상태:', agent.checker.selfTest() ? '정상' : '오류');
    console.log('\n✅ 테스트 완료 — 실제 실행: node master-agent.js');
  } else if (args.includes('--stop')) {
    agent.emergencyStop();
  } else {
    // 정상 실행
    agent.run()
      .then(result => {
        if (result.success) {
          console.log('\n🎉 모든 작업 성공!');
        } else {
          console.log(`\n⚠️ ${result.errors.length}건 실패`);
        }
        process.exit(0);
      })
      .catch(err => {
        console.error('\n💥 치명적 오류:', err);
        process.exit(1);
      });
  }
}

module.exports = MasterAgent;
