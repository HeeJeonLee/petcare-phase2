// src/main.js
require('dotenv').config();

const generateContent = require('./content-generator');
const generateImage = require('./image-generator');
const postInstagram = require('./instagram');
const path = require('path');

async function main() {
  try {
    // 1. AI로 인스타그램용 문구 생성
    const prompt = '오늘의 펫보험 비교 꿀팁을 100자 이내로, 정보 제공 목적의 친근한 문장으로 만들어줘. 해시태그 2~3개 포함.';
    const caption = await generateContent(prompt);
    console.log('생성된 캡션:', caption);

    // 2. AI로 이미지 자동 생성 (output.png)
    await generateImage('귀여운 강아지와 고양이 일러스트, 밝고 따뜻한 색감');

    // 3. 업로드할 이미지 경로 지정
    const imagePath = path.resolve(__dirname, '../output.png');

    // 4. 인스타그램 자동 포스팅
    await postInstagram({ imagePath, caption });
    console.log('인스타그램 자동 포스팅 완료!');
  } catch (err) {
    console.error('오류 발생:', err);
  }
}

main();
