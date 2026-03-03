// src/components/ChatBot.jsx
// Claude API 기반 24시간 AI 챗봇 - 일상대화 모드
// 펫보험 상담, 건강 조언, 청구 가이드 (스트리밍 응답 지원)

import React, { useState, useRef, useEffect } from 'react';
import Anthropic from '@anthropic-ai/sdk';

const ChatBot = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: '안녕하세요! 🐾 PetCare+ AI입니다. 펫보험, 반려동물 건강, 청구 절차 등 무엇이든 물어봐 주세요. 편하게 대화하듯 얘기해 주면 됩니다 😊',
      sender: 'bot',
      timestamp: new Date(),
      isStreaming: false
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationContext, setConversationContext] = useState('');
  const messagesEndRef = useRef(null);

  const client = new Anthropic({
    apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY
  });

  const systemPrompt = `당신은 PetCare+ AI 챗봇입니다. 친절하고 자연스러운 펫보험 전문가입니다.

💡 대화 스타일:
• 친구와 카톡하듯 자연스럽고 편한 톤
• "~요", "~네요", "~군요" 같은 일상적 표현 사용
• 반려동물 주인의 걱정과 상황 이해/공감
• 필요시 이모지로 따뜻한 감정 표현 (😊, 🐾, ❤️ 등)
• 한 번에 1-2개 문단 정도로 간결하게 답변

🎯 전문 분야:
1. 펫보험 상담 (상품 비교, 가입 방법, 보장 내용)
2. 반려동물 건강 정보 (일반 질병, 예방법, 응급상황)
3. 보험금 청구 안내 (절차, 필요 서류)
4. 동물병원 검색 유도

⚠️ 반드시 지켜야 할 규칙:
✅ "~인 것 같아요", "도움이 될 것 같은데요" 같은 자연스러운 표현
✅ 반려동물 종류 물어보고 맞춤 조언 제공
✅ 의학적 진단은 "수의사 선생님께 꼭 확인받으세요" 권유
✅ 상담 신청 시 "상담 폼으로 연락드릴까요?" 제안
❌ "무조건", "최고", "무료보장" 같은 과장 표현 금지
❌ 의학적 진단 대신 병원 방문 권유
❌ 특정 보험사만 강권하기 금지
❌ "따라하세요" 같은 명령조 대신 제안조로

💬 특수 요청 처리:
- 병원 검색 요청: 위치 기반 직근처 병원 검색 안내
- 청구 절차: 단계별로 쉽게 설명
- 보험료 비교: "가입 폼이 있으니 신청해 보세요" 권유
- 급할 때: "응급상황이면 24시간 동물병원을 찾아보세요" 안내

🎭 대화 예시:
❌ "무엇을 도와드릴까요?"
✅ "반려동물을 키우고 계신가요? 뭐해요?"

❌ "이 보험상품이 최고입니다."
✅ "이 상품이 반려동물 보험치료를 잘 커버하는 것 같은데요. 가입 정보 궁금하세요?"

❌ "보험금 청구는 다음 절차를 따르세요."
✅ "청구가 처음이신가요? 차근차근 안내해 드릴게요 😊"`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;

    // 🎯 사용자 메시지 추가
    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date(),
      isStreaming: false
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // 🤖 Claude API 호출 (스트리밍 응답)
      const response = await client.messages.create({
        model: 'claude-opus-4-1-20250805',
        max_tokens: 500,
        system: systemPrompt,
        messages: [
          ...messages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
          })),
          { role: 'user', content: input }
        ]
      });

      const botResponseText = response.content[0].type === 'text' ? response.content[0].text : '죄송해요. 잠시 다시 시도해 줄래요?';
      
      // 📝 스트리밍 효과: 자연스러운 응답 시뮬레이션
      const botMessage = {
        id: messages.length + 2,
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date(),
        isStreaming: true
      };

      // 메시지 추가 후 스트리밍 효과
      setMessages(prev => [...prev, botMessage]);

      // 스트리밍 애니메이션 완료
      setTimeout(() => {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === botMessage.id ? { ...msg, isStreaming: false } : msg
          )
        );
      }, 800);

    } catch (error) {
      console.error('ChatBot API 오류:', error);
      
      const errorMessage = {
        id: messages.length + 2,
        text: '죄송해요. 일시적으로 잘 안 들리는 거 같은데 다시 시도해 주시겠어요? 🙏',
        sender: 'bot',
        timestamp: new Date(),
        isStreaming: false
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* 📱 챗봇 버튼 */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white shadow-2xl hover:shadow-3xl transform transition-all duration-300 hover:scale-110 flex items-center justify-center"
        >
          <span className="text-3xl group-hover:scale-125 transition-transform">💬</span>
          <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center animate-pulse font-bold">!</span>
        </button>
      )}

      {/* 💬 챗 윈도우 */}
      {isOpen && (
        <div className="absolute bottom-0 right-0 w-96 h-[650px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slideUp">
          {/* 헤더 */}
          <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🐾</span>
              <div>
                <h3 className="font-bold text-lg leading-tight">PetCare+ AI</h3>
                <p className="text-xs text-purple-100">• 온라인 상태</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition duration-200 hover:rotate-90"
            >
              ✕
            </button>
          </div>

          {/* 메시지 영역 */}
          <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-blue-50 to-purple-50 space-y-3">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                <div
                  className={`max-w-xs px-4 py-3 rounded-2xl text-sm leading-relaxed transition-all duration-300 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md rounded-br-none'
                      : 'bg-white text-gray-800 border border-gray-200 shadow-sm rounded-bl-none'
                  } ${message.isStreaming ? 'opacity-70 animate-pulse' : 'opacity-100'}`}
                >
                  <p className="whitespace-pre-wrap break-words">{message.text}</p>
                  <span className={`text-xs mt-1 block opacity-60 ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString('ko-KR', { 
                      hour: 'numeric', 
                      minute: '2-digit',
                      hour12: true 
                    })}
                  </span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-700 px-4 py-3 rounded-2xl rounded-bl-none border border-gray-200 shadow-sm">
                  <div className="flex space-x-2 items-center">
                    <div className="text-lg">PetCare+ AI</div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 입력 영역 */}
          <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4 bg-white rounded-b-2xl space-y-2">
            {/* 팁 텍스트 */}
            <div className="text-xs text-gray-500 px-2">
              💡 편하게 행동하듯이 입력하세요. AI가 즉시 답변해요!
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="궁금한 거 편하게 물어봐 주세요..."
                disabled={loading}
                className="flex-1 border border-gray-300 rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full px-5 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-105"
              >
                {loading ? '...' : '➤'}
              </button>
            </div>
          </form>
        </div>
      )}
        </div>
      )}
    </div>
  );
};

export default ChatBot;
