// auto-session-recover.js
// Copilot/운영자용: 세션/컨텍스트 자동 복구 스크립트 (PC 변경/새 대화 시 자동 실행)

const { loadAllFiles, saveSessionLog } = require('./session-context-loader');

function autoRecoverSession() {
  const context = loadAllFiles();
  saveSessionLog(context);
  // 추가: Copilot/운영자 메모리로 context 객체 전달(확장/에이전트 연동 시)
  return context;
}

// 실행 예시
if (require.main === module) {
  const context = autoRecoverSession();
  console.log('세션/컨텍스트 자동 복구 완료. Copilot이 완전한 기억으로 시작합니다.');
}

module.exports = { autoRecoverSession };
