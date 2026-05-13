// src/content-generator.js
require('dotenv').config();
const { Anthropic } = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function generateContent(prompt) {
  const completion = await anthropic.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 256,
    messages: [
      { role: 'user', content: prompt }
    ]
  });
  return completion.content[0].text.trim();
}

// 사용 예시 (main.js 등에서 호출)
// generateContent('오늘의 펫보험 비교 꿀팁을 알려줘').then(console.log);

module.exports = generateContent;
