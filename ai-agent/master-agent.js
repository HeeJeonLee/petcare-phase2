/**
 * 새론금융대부중개 — AI 콘텐츠 생성기
 * =====================================================
 * 원칙:
 *   - 홈페이지: 전화/문자 전용. SNS 연결 절대 없음.
 *   - SNS 계정: 모두 제거됨. 명의는 김덕진.
 *   - 이 에이전트는 콘텐츠를 파일로만 저장합니다.
 *     자동 게시 없음. 수동으로 복사해서 사용하세요.
 *
 * 실행 방법: node master-agent.js
 * 생성 결과: ./generated/ 폴더에 저장
 */

require('dotenv').config();

const config = require('./config');
const ContentGenerator = require('./content-generator');
const LegalChecker = require('./legal-checker');
const FileWriter = require('./sns-publisher');  // 파일 저장 전용

class MasterAgent {
  constructor() {
    this.generator = new ContentGenerator();
    this.checker = new LegalChecker();
    this.writer = new FileWriter();  // 파일 저장 전용 (SNS 게시 없음)
    this.results = [];
    this.errors = [];
  }

  /**
   * 메인 실행 함수 — 콘텐츠 생성 후 파일 저장
   * SNS 자동 게시 없음. 명의: 김덕진 · 1555-2137
   */
  async run() {
    const startTime = Date.now();
    const today = new Date();
    const dayOfWeek = today.getDay();
    const dateStr = today.toISOString().substring(0, 10);
    
    console.log(`\n${'='.repeat(50)}`);
    console.log(`📝 새론금융 콘텐츠 생성 시작 (대표: 김덕진)`);
    console.log(`📅 ${today.toLocaleString('ko-KR')}`);
    console.log(`⚠️  SNS 자동 게시 없음 — 파일 저장 후 수동 사용`);
    console.log(`${'='.repeat(50)}\n`);

    // 오늘의 주제 선택
    const topic = this.generator.selectTodayTopic(dayOfWeek);
    console.log(`📌 오늘의 주제: ${topic.topic} (${topic.category})`);

    // 모든 포맷 콘텐츠 생성 후 파일 저장
    const tasks = [
      this._runTask('블로그 포스트', () => this._saveNaverContent(topic, dateStr)),
      this._runTask('소셜 카드뉴스', () => this._saveSocialContent(topic, dateStr)),
      this._runTask('카카오 메시지', () => this._saveKakaoContent(topic, dateStr)),
      this._runTask('유튜브 스크립트', () => this._saveYoutubeContent(topic, dateStr)),
    ];

    for (const task of tasks) {
      await task();
    }

    // 결과 저장
    const logFile = this.writer.saveToLog(this.results);
    
    // 완료 보고서 출력
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    this._printReport(elapsed, logFile);

    console.log(`\n✅ 콘텐츠 생성 완료! (${elapsed}초 소요)`);
    console.log(`📁 생성 파일: ${config.outputDir || './generated'}/`);
    console.log(`\n👉 위 폴더에서 내용 복사 → SNS에 수동 게시하세요`);
    return { success: this.errors.length === 0, results: this.results, errors: this.errors };
  }

  // ─── 개별 작업 실행 래퍼 ─────────────────────────
  _runTask(name, fn) {
    return async () => {
      console.log(`\n📝 ${name} 생성 중...`);
      try {
        const result = await fn();
        if (result) {
          this.results.push({ name, ...result });
          console.log(`✅ ${name} 저장 완료: ${result.file || ''}`);
        }
      } catch (err) {
        this.errors.push({ name, error: err.message });
        console.error(`❌ ${name} 실패: ${err.message}`);
      }
    };
  }

  // ─── 네이버 블로그 콘텐츠 저장 ──────────────────────
  async _saveNaverContent(topic, dateStr) {
    const post = await this.generator.generateNaverBlog(topic);
    const file = this.writer.saveToFile('naver', dateStr, `제목: ${post.title}\n\n${post.content}`);
    return { type: 'naver', file, legal: post.legalCheck.pass };
  }

  // ─── 소셜(인스타/페이스북) 콘텐츠 저장 ──────────────
  async _saveSocialContent(topic, dateStr) {
    const post = await this.generator.generateSocialPost(topic, 'instagram');
    const file = this.writer.saveToFile('social', dateStr, post.content);
    return { type: 'social', file, legal: post.legalCheck.pass };
  }

  // ─── 카카오 메시지 저장 ───────────────────────────────
  async _saveKakaoContent(topic, dateStr) {
    const msg = await this.generator.generateKakaoMessage(topic);
    const file = this.writer.saveToFile('kakao', dateStr, msg.content);
    return { type: 'kakao', file, legal: msg.legalCheck.pass };
  }

  // ─── 유튜브 스크립트 저장 ─────────────────────────────
  async _saveYoutubeContent(topic, dateStr) {
    const script = await this.generator.generateYoutubeScript(topic);
    const file = this.writer.saveToFile('youtube', dateStr,
      `주제: ${topic.topic}\n\n${script.script}\n\n---설명---\n${script.description}`);
    return { type: 'youtube', file, legal: script.legalCheck.pass };
  }

  // ─── 완료 보고서 출력 ─────────────────────────────────
  _printReport(elapsed, logFile) {
    const ok = this.results.filter(r => r.success !== false).length;
    const fail = this.errors.length;
    console.log(`\n${'─'.repeat(50)}`);
    console.log(`📊 완료 보고 (${elapsed}초)  성공 ${ok}건 / 실패 ${fail}건`);
    this.results.forEach(r => console.log(`  ✅ ${r.name}: ${r.file || '저장'}`))
    this.errors.forEach(e  => console.log(`  ❌ ${e.name}: ${e.error}`));
    console.log(`📁 로그: ${logFile}`);
    console.log(`─`.repeat(50));
    console.log(`\n대표: 김덕진 · 1555-2137 · 010-5927-9205`);
    console.log(`(홈페이지 연결 없음 · SNS 자동 게시 없음)`);
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

// ── 직접 실행 ───────────────────────────────────────
if (require.main === module) {
  const agent = new MasterAgent();
  agent.run()
    .then(result => {
      process.exit(result.success ? 0 : 1);
    })
    .catch(err => {
      console.error('\n💥 오류:', err.message);
      process.exit(1);
    });
}

module.exports = MasterAgent;
