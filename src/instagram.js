// src/instagram.js
require('dotenv').config();
const { chromium } = require('playwright');

async function postInstagram({ imagePath, caption }) {
  const browser = await chromium.launch({ headless: process.env.HEADLESS !== 'false' });
  const context = await browser.newContext();
  const page = await context.newPage();

  // 1. 인스타그램 로그인
  await page.goto('https://www.instagram.com/accounts/login/');
  await page.fill('input[name="username"]', process.env.INSTAGRAM_USERNAME);
  await page.fill('input[name="password"]', process.env.INSTAGRAM_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle' });

  // 2. 새 게시물 업로드 (PC 웹에서 지원)
  await page.waitForSelector('svg[aria-label="새 게시물 만들기"]', { timeout: 15000 });
  await page.click('svg[aria-label="새 게시물 만들기"]');
  await page.setInputFiles('input[type="file"]', imagePath);
  await page.waitForTimeout(2000);
  await page.click('text=다음');
  await page.waitForTimeout(1000);
  await page.click('text=다음');
  await page.waitForTimeout(1000);
  await page.fill('textarea[aria-label="문구 입력..."]', caption);
  await page.click('text=공유');
  await page.waitForTimeout(5000);

  await browser.close();
}

// 사용 예시 (main.js 등에서 호출)
// postInstagram({ imagePath: './output.png', caption: 'AI가 만든 펫보험 꿀팁! #펫보험 #AI' });

module.exports = postInstagram;
