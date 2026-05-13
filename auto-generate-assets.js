// auto-generate-assets.js
// 홈페이지, 전단지, 명함 파일 자동 생성 스크립트
const fs = require('fs');
const path = require('path');

const homepageHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Saeloan Financial | 새론금융중개업</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>
    <h1>새론금융중개업</h1>
    <h2>Saeloan Financial</h2>
    <p class="slogan">합법 · 신뢰 · 맞춤 금융중개</p>
  </header>
  <main>
    <section>
      <h3>회사소개</h3>
      <p>대표: 김덕진 | 사업자등록번호: 653-90-02268<br>주소: 경기도 수원시 팔달구 권광로 159, 1동 5층 502호(인계동, 수원프라자)</p>
    </section>
    <section>
      <h3>주요 서비스</h3>
      <ul>
        <li>합법적 대부중개 및 맞춤 금융상담</li>
        <li>고객 신용·상황에 맞는 최적 대출상품 안내</li>
        <li>개인정보 보호 및 법규 준수</li>
      </ul>
    </section>
    <section>
      <h3>상담신청</h3>
      <form>
        <input type="text" placeholder="이름" required>
        <input type="tel" placeholder="연락처" required>
        <input type="text" placeholder="문의내용" required>
        <button type="submit">상담신청</button>
      </form>
    </section>
  </main>
</body>
</html>`;

const flyerMd = `# 새론금융중개업 전단지

**합법 · 신뢰 · 맞춤 금융중개**

- 대표: 김덕진
- 사업자등록번호: 653-90-02268
- 주소: 경기도 수원시 팔달구 권광로 159, 1동 5층 502호(인계동, 수원프라자)
- 대표전화: 1555-2173 / 010-5927-9205

## 주요 서비스
- 합법적 대부중개 및 맞춤 금융상담
- 고객 신용·상황에 맞는 최적 대출상품 안내
- 개인정보 보호 및 법규 준수
`;

const cardMd = `# 새론금융중개업 명함

**Saeloan Financial**
- 대표: 김덕진
- 대표전화: 1555-2173
- 휴대폰: 010-5927-9205
- 주소: 경기도 수원시 팔달구 권광로 159, 1동 5층 502호(인계동, 수원프라자)
- 사업자등록번호: 653-90-02268
`;

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// 홈페이지
ensureDir(path.join(__dirname, 'saeron-finance/homepage'));
fs.writeFileSync(path.join(__dirname, 'saeron-finance/homepage/index.html'), homepageHtml);

// 전단지
ensureDir(path.join(__dirname, 'saeron-finance/flyer'));
fs.writeFileSync(path.join(__dirname, 'saeron-finance/flyer/saeron-flyer-auto.md'), flyerMd);

// 명함
ensureDir(path.join(__dirname, 'saeron-finance/card'));
fs.writeFileSync(path.join(__dirname, 'saeron-finance/card/saeron-card-auto.md'), cardMd);

console.log('홈페이지, 전단지, 명함 자동 생성 완료!');
