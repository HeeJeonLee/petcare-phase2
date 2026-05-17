/**
 * 새론금융대부중개 — 마스터 AI 에이전트 (완전 자동화)
 * =====================================================
 * 실행 방법: node master-agent.js
 *
 * 자동 실행 흐름:
 *   1. 오늘의 주제 자동 선택 (요일별 카테고리 순환)
 *   2. Claude AI (최신 모델)로 콘텐츠 생성
 *   3. 대부업법 자동 검증 (금지어, 필수고지문 확인)
 *   4. Instagram 자동 게시 (토큰 설정 시)
 *   5. Telegram 완료 알림 (토큰 설정 시)
 *   6. 로컬 파일 백업 (항상)
 *
 * 원칙:
 *   - 홈페이지 ≠ SNS (완전 분리, 절대 불변)
 *   - 대표: 김덕진 · 1555-2137 · 010-5927-9205
 *   - 계정 운영: 이희전 (고객 노출 명의: 김덕진)
 */

'use strict';
require('dotenv').config();

const config           = require('./config');
const ContentGenerator = require('./content-generator');
const LegalChecker     = require('./legal-checker');
const SNSPublisher     = require('./sns-publisher');

class MasterAgent {
  constructor() {
    this.generator = new ContentGenerator();
    this.checker   = new LegalChecker();
    this.publisher = new SNSPublisher();
    this.results   = [];
    this.errors    = [];
  }

  async run() {
    const start   = Date.now();
    const now     = new Date();
    const dateStr = now.toISOString().slice(0, 10);

    this._banner(now);

    // 오늘의 주제 선택
    const topic = this.generator.selectTodayTopic(now.getDay());
    console.log(`\n📌 오늘의 주제: [${topic.category}] ${topic.topic}`);
    console.log(`🏷️  해시태그: ${topic.tags.map(t => '#' + t).join(' ')}\n`);

    // Instagram 콘텐츠 생성 & 게시
    await this._runStep('📸 Instagram 캡션 생성', async () => {
      const data = await this.generator.generateSocialPost(topic, 'instagram');

      // 법규 검증
      const check = this.checker.check(data.content);
      if (!check.pass) {
        throw new Error(`법규 검증 실패: ${check.forbidden.join(', ') || check.missing.join(', ')}`);
      }
      console.log('  ✅ 법규 검증 통과');

      // 파일 백업 (항상)
      const file = this.publisher.saveToFile('instagram', dateStr, data.content);

      // Instagram 게시 (토큰 있을 때만)
      const igResult = await this.publisher.postInstagram(data.content, topic.category);

      return { platform: 'instagram', topic: topic.topic, file, igResult };
    });

    // 완료 Telegram 알림
    const elapsed  = ((Date.now() - start) / 1000).toFixed(1);
    const igPosted = this.results.some(r => r.igResult ; r.igResult.success);

    await this.publisher.notifyTelegram(
      `<b>✅ 새론금융 AI 에이전트 완료</b>\n` +
      `📅 ${now.toLocaleDateString('ko-KR')}\n` +
      `📌 주제: ${topic.topic}\n` +
      `📸 Instagram: ${igPosted ? '게시 완료 ✅' : '파일 저장 (토큰 미설정)'}\n` +
      `⏱️ 소요: ${elapsed}초`
    );

    // 로그 저장
    this.publisher.saveToLog(this.results);

    // 최종 보고
    console.log('\n' + '═'.repeat(54));
    console.log(`✅ 완료! (${elapsed}초 소요)`);
    console.log(`📁 백업: ./generated/instagram/`);
    if (!igPosted) {
      console.log('\n💡 Instagram 자동게시 활성화 방법:');
      console.log('   .env 파일에 다음 3가지를 설정하세요:');
      console.log('   INSTAGRAM_USER_ID, INSTAGRAM_ACCESS_TOKEN, OG_IMAGE_BASE_URL');
    }
    console.log('═'.repeat(54) + '\n');

    return { success: this.errors.length === 0, results: this.results, errors: this.errors };
  }

  async _runStep(name, fn) {
    console.log(`\n${name}...`);
    try {
      const result = await fn();
      this.results.push({ name, ...result });
    } catch (err) {
      console.error(`  ❌ 실패: ${err.message}`);
      this.errors.push({ name, error: err.message });
      this.results.push({ name, error: err.message });
    }
  }

  _banner(now) {
    console.log('\n' + '═'.repeat(54));
    console.log('🤖 새론금융대부중개 AI 자동화 에이전트');
    console.log(`📅 ${now.toLocaleString('ko-KR')}`);
    console.log(`🧠 AI 모델: ${config.ai.model}`);
    console.log(`📌 대표: 김덕진 · 1555-2137 · 010-5927-9205`);
    console.log(`🔒 홈페이지 ≠ SNS (완전 분리, 절대 불변)`);
    console.log('═'.repeat(54));
  }
}

// 직접 실행
if (require.main === module) {
  new MasterAgent()
    .run()
    .then(r => process.exit(r.success ? 0 : 1))
    .catch(err => { console.error(err); process.exit(1); });
}

module.exports = MasterAgent;
