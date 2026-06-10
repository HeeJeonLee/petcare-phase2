import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

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

function loadAllFiles(baseDir: string): Record<string, string|null> {
  const context: Record<string, string|null> = {};
  for (const relPath of FILES_TO_LOAD) {
    const absPath = path.join(baseDir, relPath);
    try {
      context[relPath] = fs.readFileSync(absPath, 'utf-8');
    } catch (e) {
      context[relPath] = null;
    }
  }
  return context;
}

function saveSessionLog(context: Record<string, string|null>, logPath: string) {
  const log = [
    '# Copilot Session/Context Log',
    '## 자동 로드 파일 요약',
    ...Object.entries(context).map(([file, content]) => `### ${file}\n\n${content ? content.slice(0, 1000) + (content.length > 1000 ? '\n... (생략)' : '') : '파일 없음'}`),
    '---',
    `업데이트: ${new Date().toISOString()}`,
  ].join('\n\n');
  fs.writeFileSync(logPath, log, 'utf-8');
}

export function activate(context: vscode.ExtensionContext) {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    vscode.window.showWarningMessage('Copilot Memory Loader: 워크스페이스가 없습니다.');
    return;
  }
  const root = workspaceFolders[0].uri.fsPath;
  const sessionLogPath = path.join(root, '.copilot-session.md');

  // 자동 복구 실행
  const fileContext = loadAllFiles(root);
  saveSessionLog(fileContext, sessionLogPath);
  vscode.window.showInformationMessage('Copilot: 세션/컨텍스트 자동 복구 완료!');

  // 명령 등록
  const disposable = vscode.commands.registerCommand('copilot-memory-loader.recoverSession', () => {
    const fileContext = loadAllFiles(root);
    saveSessionLog(fileContext, sessionLogPath);
    vscode.window.showInformationMessage('Copilot: 세션/컨텍스트 수동 복구 완료!');
  });
  context.subscriptions.push(disposable);
}

export function deactivate() {}
