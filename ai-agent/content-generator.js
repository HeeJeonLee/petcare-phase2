/**
 * 새론금융대부중개 — AI 콘텐츠 생성기
 * =====================================================
 * Claude AI를 사용해 SNS 게시물을 자동으로 생성합니다.
 * 대부업법을 완벽 준수하는 콘텐츠만 생성됩니다.
 */

const Anthropic = require('@anthropic-ai/sdk');
const config = require('./config');
const LegalChecker = require('./legal-checker');

class ContentGenerator {
  constructor() {
    this.client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    this.checker = new LegalChecker();
  }

  /**
   * 오늘의 주제 자동 선택
   * 요일별, 카테고리 순환으로 선택
   */
  selectTodayTopic(dayOfWeek) {
    const topics = config.contentTopics;
    const dayIndex = dayOfWeek || new Date().getDay();
    // 요일 기반 순환 선택 (주제 풀을 골고루 사용)
    const topicIndex = (dayIndex + Math.floor(Date.now() / 86400000)) % topics.length;
    return topics[topicIndex];
  }

  /**
   * 네이버 블로그 포스트 생성
   */
  async generateNaverBlog(topic) {
    const prompt = `당신은 새론금융대부중개의 공식 블로그 작성 AI입니다.
    
아래 조건을 반드시 지켜서 블로그 포스트를 작성하세요:

주제: ${topic.topic}
카테고리: ${topic.category}
해시태그: ${topic.tags.map(t => '#' + t).join(' ')}

필수 조건:
1. 500~800자 분량 (블로그 최적 길이)
2. 한국어로 쉽게 이해되도록 작성
3. 대부업법 상 금지 표현 절대 사용 금지:
   - "보장", "100% 승인", "무조건" 같은 단어 사용 금지
   - 대출 승인을 확정하는 표현 금지
4. 정보 제공 목적으로 작성 (직접 대출 권유 금지)
5. 상담 문의는 "1555-2137" 안내
6. SEO를 위해 주제 관련 키워드를 자연스럽게 포함
7. 제목: 검색에 잘 걸리도록 구체적으로

블로그 포스트 형식:
[제목]
(블로그 제목)

[본문]
(본문 내용)

[마무리]
(상담 안내 문구)

주의: 글 말미에 법정 고지 문구는 시스템이 자동 추가하므로 직접 작성하지 마세요.`;

    try {
      const response = await this.client.messages.create({
        model: config.ai.model,
        max_tokens: config.ai.maxTokens,
        messages: [{ role: 'user', content: prompt }],
      });

      const content = response.content[0].text;
      // 법정 문구 자동 추가
      const finalContent = this.checker.addLegalDisclosure(content);
      
      return {
        platform: 'naver_blog',
        title: this._extractTitle(content),
        content: finalContent,
        tags: topic.tags,
        legalCheck: this.checker.check(finalContent),
        generatedAt: new Date().toISOString(),
      };
    } catch (err) {
      console.error('네이버 블로그 생성 오류:', err.message);
      throw err;
    }
  }

  /**
   * 인스타그램/페이스북 캡션 생성
   */
  async generateSocialPost(topic, platform = 'instagram') {
    const maxLen = platform === 'instagram' ? 300 : 400;
    
    const prompt = `당신은 새론금융대부중개의 ${platform === 'instagram' ? '인스타그램' : '페이스북'} 담당 AI입니다.

아래 주제로 SNS 게시물 캡션을 작성하세요.

주제: ${topic.topic}
해시태그: ${topic.tags.map(t => '#' + t).join(' ')} #새론금융 #수원대출 #대부중개

필수 조건:
1. ${maxLen}자 이내 (짧고 임팩트 있게)
2. 이모지 적절히 사용 (읽기 쉽게)
3. 금지 표현 절대 사용 금지 (보장, 100%승인, 무조건 등)
4. 상담 전화: 1555-2137
5. 카카오 채널: 새론금융 (채널 개설 후 링크 추가 예정)
6. 정보 제공 + 상담 유도 목적

형식:
첫 줄: 강력한 후킹 문구 (읽고 싶게 만드는)
본문: 핵심 정보
마지막: 상담 안내

주의: 법정 고지 문구는 시스템이 자동 추가합니다.`;

    try {
      const response = await this.client.messages.create({
        model: config.ai.model,
        max_tokens: 500,
        messages: [{ role: 'user', content: prompt }],
      });

      const content = response.content[0].text;
      const finalContent = this.checker.addLegalDisclosure(content);
      
      return {
        platform,
        content: finalContent,
        hashtags: [...topic.tags, '새론금융', '수원대출', '대부중개', '합법대출'],
        legalCheck: this.checker.check(finalContent),
        generatedAt: new Date().toISOString(),
      };
    } catch (err) {
      console.error(`${platform} 포스트 생성 오류:`, err.message);
      throw err;
    }
  }

  /**
   * 카카오채널 메시지 생성
   */
  async generateKakaoMessage(topic) {
    const prompt = `당신은 새론금융대부중개의 카카오채널 메시지 작성 AI입니다.

아래 주제로 카카오채널 메시지를 작성하세요.
주제: ${topic.topic}

필수 조건:
1. 200자 이내 (카카오 메시지 최적 길이)
2. 친근하고 따뜻한 톤
3. 금지 표현 사용 금지
4. 상담 유도 (전화: 1555-2137)
5. 개인화된 느낌 (고객에게 직접 말하는 듯)
6. 이모지 2~3개 사용

주의: 법정 고지 문구는 시스템이 자동 추가합니다.`;

    try {
      const response = await this.client.messages.create({
        model: config.ai.model,
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }],
      });

      const content = response.content[0].text;
      const finalContent = this.checker.addLegalDisclosure(content);
      
      return {
        platform: 'kakao',
        content: finalContent,
        legalCheck: this.checker.check(finalContent),
        generatedAt: new Date().toISOString(),
      };
    } catch (err) {
      console.error('카카오 메시지 생성 오류:', err.message);
      throw err;
    }
  }

  /**
   * 유튜브 쇼츠 스크립트 생성
   */
  async generateYoutubeScript(topic) {
    const prompt = `당신은 새론금융대부중개의 유튜브 쇼츠 스크립트 작성 AI입니다.

아래 주제로 60초 이내 쇼츠 스크립트를 작성하세요.
주제: ${topic.topic}

필수 조건:
1. 60초 이내 (약 150~180자 읽기 기준)
2. 3단계 구성: 후킹(5초) → 핵심정보(45초) → 콜투액션(10초)
3. 자연스러운 구어체 (TTS 음성 최적화)
4. 금지 표현 절대 사용 금지
5. 마지막: "상담은 1555-2137로 문의하세요"
6. 영상 설명에 들어갈 해시태그 5개

형식:
[스크립트]
(나레이션 텍스트)

[영상 설명]
(유튜브 설명란 내용)

주의: 법정 고지 문구는 영상 설명에 시스템이 자동 추가합니다.`;

    try {
      const response = await this.client.messages.create({
        model: config.ai.model,
        max_tokens: 800,
        messages: [{ role: 'user', content: prompt }],
      });

      const content = response.content[0].text;
      const description = this._extractDescription(content);
      const finalDescription = this.checker.addLegalDisclosure(description);
      
      return {
        platform: 'youtube',
        script: content,
        description: finalDescription,
        tags: topic.tags,
        legalCheck: this.checker.check(finalDescription),
        generatedAt: new Date().toISOString(),
      };
    } catch (err) {
      console.error('유튜브 스크립트 생성 오류:', err.message);
      throw err;
    }
  }

  /**
   * 월간 성과 보고서 생성
   */
  async generateMonthlyReport(stats) {
    const prompt = `당신은 새론금융대부중개의 SNS 마케팅 분석 AI입니다.

아래 통계를 분석하여 월간 보고서를 작성해주세요:
${JSON.stringify(stats, null, 2)}

보고서 내용:
1. 이번 달 전체 성과 요약
2. 채널별 성과 (좋은 것, 아쉬운 것)
3. 가장 효과적이었던 콘텐츠 유형
4. 다음 달 전략 제안
5. AI 도구 업데이트 필요 여부

형식: 대표님이 5분 안에 읽을 수 있도록 간결하게
언어: 한국어, 쉬운 용어 사용 (전문 용어 최소화)`;

    const response = await this.client.messages.create({
      model: config.ai.model,
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    });

    return response.content[0].text;
  }

  // ── 유틸리티 ─────────────────────────────────────
  _extractTitle(content) {
    const match = content.match(/\[제목\]\s*\n(.+)/);
    return match ? match[1].trim() : '새론금융대부중개 금융 정보';
  }

  _extractDescription(content) {
    const match = content.match(/\[영상 설명\]\s*\n([\s\S]+)$/);
    return match ? match[1].trim() : content;
  }
}

// ── 단독 실행 시 테스트 ──────────────────────────────
if (require.main === module) {
  (async () => {
    console.log('=== AI 콘텐츠 생성기 테스트 ===\n');
    
    if (!process.env.ANTHROPIC_API_KEY) {
      console.log('⚠️  ANTHROPIC_API_KEY가 설정되지 않았습니다.');
      console.log('    .env 파일에 ANTHROPIC_API_KEY=your_key 를 추가하세요.');
      return;
    }
    
    const generator = new ContentGenerator();
    const topic = generator.selectTodayTopic(new Date().getDay());
    
    console.log('오늘의 주제:', topic.topic);
    console.log('카테고리:', topic.category);
    
    console.log('\n인스타그램 게시물 생성 중...');
    try {
      const insta = await generator.generateSocialPost(topic, 'instagram');
      console.log('생성 완료!');
      console.log('법규 검사:', insta.legalCheck.pass ? '✅ 통과' : '❌ 실패');
      console.log('내용 미리보기:\n', insta.content.substring(0, 200) + '...');
    } catch (e) {
      console.error('오류:', e.message);
    }
  })();
}

module.exports = ContentGenerator;
