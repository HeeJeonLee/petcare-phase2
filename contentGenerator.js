// src/utils/contentGenerator.js
// Claude API를 활용한 자동 콘텐츠 생성 (블로그, SNS)
// Phase 2: 자율진화형 플랫폼 핵심 모듈

import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY
});

export const ContentGenerator = {
  
  // 1️⃣ 일일 블로그 포스트 자동 생성 (1500-2000자)
  async generateBlogPost(topic = 'random') {
    const topics = [
      '강아지 보험 vs 고양이 보험 선택법',
      '2026년 최신 펫보험 트렌드',
      '반려동물 건강검진 언제 받아야 할까?',
      '슬개골 탈구 수술 비용과 보험 보상',
      '고령견 보험 가입 가능할까?',
      '펫보험 청구 절차 완벽 가이드',
      '아토피 있는 반려동물 보험 추천',
      '동물병원 선택 팁: 신뢰할 수 있는 병원 찾기'
    ];
    
    const selectedTopic = topic === 'random' 
      ? topics[Math.floor(Math.random() * topics.length)]
      : topic;

    const prompt = `
    당신은 펫보험 전문가 블로거입니다. 다음 주제에 대해 고품질의 블로그 포스트를 작성하세요.

    📝 주제: ${selectedTopic}
    📏 글자수: 1500-2000자
    🎯 목표 독자: 반려동물 주인 (초보~중급)
    💡 톤: 친근하고 정보가 풍부하며 신뢰할 수 있음

    구조:
    1. 매력적인 제목 (30자 이하)
    2. 서론 (3-4문장)
    3. 본론 (핵심 내용 4-5개 항목)
    4. 결론 (2-3문장)
    5. CTA (Call-To-Action): "AI 챗봇에서 무료 상담받기"

    주의사항:
    ✅ 정확한 정보만 제공
    ❌ "무조건", "최고" 같은 확정적 표현 제거
    ❌ 보험 권유 금지 (정보 제공만)
    ✅ "~할 수 있습니다" 같은 중립적 표현 사용
    `;

    try {
      const message = await client.messages.create({
        model: 'claude-opus-4-1-20250805',
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }]
      });

      const content = message.content[0].type === 'text' ? message.content[0].text : '';

      return {
        type: 'blog',
        title: selectedTopic,
        content: content,
        wordCount: content.replace(/\s/g, '').length,
        status: 'draft',
        createdAt: new Date().toISOString(),
        seoTags: ['펫보험', '반려동물', '보험비교', selectedTopic.split(' ')[0]]
      };
    } catch (error) {
      console.error('블로그 생성 실패:', error);
      throw error;
    }
  },

  // 2️⃣ Instagram 콘텐츠 자동 생성
  async generateInstagramContent(topic = 'tip') {
    const prompts = {
      tip: '반려동물 건강 또는 펫보험 관련 꿀팁',
      news: '최신 펫보험 뉴스 또는 트렌드',
      story: '감동적인 펫 보험 성공 사례',
      educational: '펫보험 이해하기'
    };

    const selectedPrompt = prompts[topic] || prompts.tip;

    const prompt = `
    Instagram 콘텐츠를 만드세요. 다음 형식을 정확히 따르세요:

    📸 주제: ${selectedPrompt}
    👥 플랫폼: Instagram (한국)
    ⏱️ 형식: 캡션 + 이모지 + 해시태그

    구조:
    1. 훅 문장 (첫 2줄 - 주목 받기)
    2. 본문 (3-5줄)
    3. CTA (행동 유도)
    4. 해시태그 (15-30개)

    요구사항:
    ✅ 이모지 풍부하게 (감정 표현)
    ✅ 캡션 280자 이하
    ✅ 해시태그는 "#"로 시작
    ✅ 줄바꿈 활용으로 가독성 높이기
    ❌ 브랜드명 노출 금지 (정보만)
    `;

    try {
      const message = await client.messages.create({
        model: 'claude-opus-4-1-20250805',
        max_tokens: 800,
        messages: [{ role: 'user', content: prompt }]
      });

      const content = message.content[0].type === 'text' ? message.content[0].text : '';

      return {
        type: 'instagram',
        topic: topic,
        caption: content,
        charCount: content.length,
        status: 'draft',
        createdAt: new Date().toISOString(),
        suggestedImagePrompt: `A cute pet (dog or cat) with warm lighting, soft colors, professional photography style, suitable for Instagram post about pet insurance or pet health`
      };
    } catch (error) {
      console.error('Instagram 콘텐츠 생성 실패:', error);
      throw error;
    }
  },

  // 3️⃣ Twitter/X 콘텐츠 자동 생성
  async generateTwitterContent(topic = 'awareness') {
    const prompts = {
      awareness: '펫보험의 중요성에 대한 인식 제고',
      statistic: '흥미로운 펫 관련 통계',
      question: '펫 주인들이 자주 하는 질문',
      announcement: '새로운 서비스 또는 업데이트 공지'
    };

    const selectedPrompt = prompts[topic] || prompts.awareness;

    const prompt = `
    Twitter/X 트윗을 만드세요:

    📱 주제: ${selectedPrompt}
    📏 제한: 280자 이내
    🎯 톤: 톤톤하고 웃기는(witty) 또는 진지한(심각) - 주제에 맞게

    요구사항:
    ✅ 이모지 2-3개 활용
    ✅ 바이럴 가능성 고려 (리트윗/좋아요 유도)
    ✅ "너도 경험해봤어?" 식 질문형도 좋음
    ✅ URL 없음 (단순 텍스트)
    ❌ 스팸 같