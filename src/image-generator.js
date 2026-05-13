// src/image-generator.js
const fs = require('fs');
const fetch = require('node-fetch');
require('dotenv').config();

/**
 * HuggingFace Stable Diffusion API를 사용해 이미지를 생성하고 output.png로 저장합니다.
 * @param {string} prompt - 생성할 이미지 설명
 * @param {string} outPath - 저장할 파일 경로
 */
async function generateImage(prompt, outPath = '../output.png') {
  const HF_TOKEN = process.env.HUGGINGFACE_API_KEY;
  // 최신 공개 Stable Diffusion 모델명(2026년 기준, 필요시 huggingface.co/models에서 확인)
  const url = 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${HF_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ inputs: prompt })
  });
  if (!response.ok) throw new Error('이미지 생성 실패: ' + response.statusText);
  const buffer = await response.buffer();
  fs.writeFileSync(outPath, buffer);
  console.log('output.png 이미지 생성 완료!');
}

// 사용 예시 (main.js 등에서 호출)
// generateImage('귀여운 강아지와 고양이 일러스트, 밝고 따뜻한 색감').then(() => console.log('완료'));

module.exports = generateImage;
