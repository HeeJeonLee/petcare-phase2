// 자동 백업 스크립트: 주요 파일 변경 시 백업본 생성
const fs = require('fs');
const path = require('path');

const filesToBackup = [
  'config.js',
  '.env',
  'content-generator.js',
  'legal-checker.js',
  'sns-publisher.js',
  'master-agent.js',
];

const backupDir = path.join(__dirname, 'backups');
const now = new Date();
const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);

filesToBackup.forEach(file => {
  const src = path.join(__dirname, file);
  if (fs.existsSync(src)) {
    const dest = path.join(backupDir, `${timestamp}_${file}.bak`);
    fs.copyFileSync(src, dest);
    console.log(`백업 완료: ${file} → ${dest}`);
  }
});
