// Vercel Serverless Function - AI Recommendation
// 펫보험 맞춤 추천 API

export default async function handler(req, res) {
  // CORS 헤더
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY is not set');
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 2000,
        system: `당신은 PetCare+ 펫보험 전문 AI 상담사입니다.
한국의 8개 주요 펫보험사(메리츠화재, 삼성화재, DB손해보험, 현대해상, KB손해보험, 한화손해보험, 농협손해보험, 롯데손해보험)에 대한 전문 지식을 갖고 있습니다.

역할:
- 고객의 반려동물 정보와 니즈에 맞는 최적의 펫보험 추천
- 객관적이고 균형 잡힌 비교 분석 제공
- 가입 시 주의사항 안내

주의사항:
- 특정 보험사에 대한 과도한 찬양이나 비난 금지
- "최고", "최상" 같은 절대적 표현 대신 "추천", "적합" 사용
- 정보 제공 목적임을 명시 (보험 권유 아님)
- 최종 결정은 고객과 보험사 상담 통해 하도록 안내

응답 형식:
- 마크다운 사용
- 구조화된 형식으로 가독성 높게
- 친근하면서도 전문적인 톤`,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Anthropic API error:', errorData);
      return res.status(response.status).json({ 
        error: 'AI 서비스 오류',
        details: errorData 
      });
    }

    const data = await response.json();
    
    return res.status(200).json({
      content: data.content[0].text,
      usage: data.usage
    });

  } catch (error) {
    console.error('Recommend API error:', error);
    return res.status(500).json({ 
      error: '서버 오류가 발생했습니다.',
      details: error.message 
    });
  }
}
