require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const prompt = "안녕하세요! 오늘의 금융 뉴스 요약을 알려주세요.";

  const result = await model.generateContent(prompt);
  const response = await result.response;
  console.log(response.text());
}

run();
