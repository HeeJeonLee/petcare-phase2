// session-context-loader.js
// Copilot/운영자용: 핵심 파일 자동 로드 및 메모리 복구 스크립트

const fs = require('fs');
const path = require('path');

const FILES_TO_LOAD = [
  '.github/copilot-instructions.md',
  'PROJECT_CONTEXT_SOURCE.md',
  'SNS_MASTER_STRATEGY.md',
  'ai-agent/master-agent.js',
  'ai-agent/content-generator.js',
  'ai-agent/sns-publisher.js',
  'ai-agent/goal-tracker.js',
  'ai-agent/legal-checker.js',
  'ai-agent/find-korean-voice.js',
  'ai-agent/get-youtube-token.js',
  'ai-agent/setup-wizard.js',
  'ai-agent/set-secrets.js',
  'src/App.jsx',
  'src/constants/company.js',
  'src/utils/telegram.js',
];

function loadAllFiles(baseDir = '.') {
  const context = {};
  for (const relPath of FILES_TO_LOAD) {
    const absPath = path.resolve(baseDir, relPath);
    try {
      context[relPath] = fs.readFileSync(absPath, 'utf-8');
    } catch (e) {
      context[relPath] = null;
    }
  }
  return context;
}

function saveSessionLog(context, logPath = '.copilot-session.md') {
  const log = [
    '# Copilot Session/Context Log',
    '## 자동 로드 파일 요약',
    ...Object.entries(context).map(([file, content]) => `### ${file}\n\n${content ? content.slice(0, 1000) + (content.length > 1000 ? '\n... (생략)' : '') : '파일 없음'}`),
    '---',
    `업데이트: ${new Date().toISOString()}`,
  ].join('\n\n');
  fs.writeFileSync(logPath, log, 'utf-8');
}

// 실행 예시
if (require.main === module) {
  const context = loadAllFiles();
  saveSessionLog(context);
  console.log('모든 핵심 파일을 읽고 세션 로그를 갱신했습니다.');
}

module.exports = { loadAllFiles, saveSessionLog };
