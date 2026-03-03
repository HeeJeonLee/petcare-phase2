// src/components/ChatBot.jsx
// Claude API 기반 24시간 AI 챗봇
// 펫보험 상담, 건강 조언, 청구 가이드

import React, { useState, useRef, useEffect } from 'react';
import Anthropic from '@anthropic-ai/sdk';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: '안녕하세요! 🐾 PetCare+ AI입니다. 펫보험, 반려동물 건강, 청구 절차 등 무엇을 도와드릴까요?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const client = new Anthropic({
    apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY
  });

  const systemPrompt = `당신은 PetCare+ AI 챗봇입니다. 펫보험 전문가이자 반려동물 건강 상담원입니다.

역할:
1. 펫보험 관련 상담 (상품 비교, 가입 방법, 보장 내용)
2. 반려동물 건강 정보 (일반적 질병, 예방, 응급상황)
3. 보험금 청구 안내 (절차, 필요 서류)
4. 주변 동물병원 검색 유도

행동 지침:
✅ 친근하고 전문적인 톤
✅ 반려동물 종류 확인 후 맞춤 조언
✅ 정확한 정보만 제공
✅ "상담 신청" 링크 제공
❌ "무조건", "최고" 같은 절대적 표현 금지
❌ 의학적 진단 금지 (수의사 방문 권유)
❌ 특정 보험사 강제 권장 금지

응답 형식:
- 명확한 구조 (제목, 본문, 중요 정보)
- 이모지 활용 (감정 표현)
- 최대 3개 문단
- 필요시 추가 질문

특수 명령어:
- "/병원찾기" → Google Maps 병원 검색 유도
- "/청구가이드" → 보험금 청구 절차 안내
- "/상담신청" → 상담 폼 제공
- "/보험비교" → 8개 보험사 비교표 표시`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;

    // 사용자 메시지 추가
    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Claude API 호출
      const response = await client.messages.create({
        model: 'claude-opus-4-1-20250805',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          ...messages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
          })),
          { role: 'user', content: input }
        ]
      });

      const botMessage = {
        id: messages.length + 2,
        text: response.content[0].type === 'text' ? response.content[0].text : '답변을 생성할 수 없습니다.',
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Claude API 오류:', error);
      
      const errorMessage = {
        id: messages.length + 2,
        text: '죄송합니다. 일시적 오류가 발생했습니다. 다시 시도해주세요.',
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* 챗봇 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-2xl hover:shadow-3xl transform transition-all duration-300 ${
          isOpen ? 'scale-0' : 'scale-100'
        }`}
      >
        <span className="text-2xl">💬</span>
      </button>

      {/* 챗 윈도우 */}
      {isOpen && (
        <div className="absolute bottom-0 right-0 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col animate-slideUp">
          {/* 헤더 */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">🐾 PetCare+ AI</h3>
              <p className="text-sm opacity-90">24시간 무료 상담</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition"
            >
              ✕
            </button>
          </div>

          {/* 메시지 영역 */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg rounded-bl-none">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 입력 영역 */}
          <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4 bg-white rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="메시지 입력..."
                disabled={loading}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? '...' : '전송'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
