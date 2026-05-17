/**
 * 새론금융대부중개 — 콘텐츠 파일 저장기
 * =====================================================
 * 원칙:
 *   - SNS 계정 연동 없음. 명의: 김덕진.
 *   - 생성된 콘텐츠를 ./generated/ 폴더에 파일로만 저장합니다.
 *   - 저장된 파일을 복사해서 SNS에 수동 게시하세요.
 */

const fs   = require('fs');
const path = require('path');

class FileWriter {

  // 콘텐츠를 파일로 저장
  saveToFile(type, dateStr, content) {
    const dir = path.join('./generated', type);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const filename = path.join(dir, `${type}_${dateStr}_${Date.now()}.txt`);
    const header = [
      '══════════════════════════════════════',
      '새론금융대부중개 · 대표: 김덕진',
      '📞 1555-2137 · 010-5927-9205',
      '등록번호: 2026-수원-2324',
      `생성일시: ${new Date().toLocaleString('ko-KR')}`,
      `유형: ${type}`,
      '══════════════════════════════════════',
      '',
    ].join('\n');

    fs.writeFileSync(filename, header + content, 'utf8');
    return filename;
  }

  // 작업 로그 저장
  saveToLog(results) {
    const logDir = './logs';
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

    const today = new Date().toISOString().split('T')[0];
    const logFile = path.join(logDir, `log_${today}.json`);

    let logs = [];
    if (fs.existsSync(logFile)) {
      try { logs = JSON.parse(fs.readFileSync(logFile, 'utf8')); } catch (_) {}
    }
    logs.push({ timestamp: new Date().toISOString(), results });
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2), 'utf8');

    return logFile;
  }
}

module.exports = FileWriter;
