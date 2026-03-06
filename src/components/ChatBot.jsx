import React, { useState } from 'react';

const ChatBot = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState([{
    id: 1,
    text: '안녕하세요! PetCare+ AI 상담사입니다 🐾\n펫보험에 대해 궁금한 점을 물어보세요!',
    sender: 'bot'
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { id: Date.now(), text: userMessage, sender: 'user' }]);
    setInput('');
    setLoading(true);

    try {
      // 대화 기록을 API 형식으로 변환 (첫 인사 메시지 제외)
      const chatHistory = messages
        .slice(1) // 첫 번째 인사 메시지 제외
        .map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text
        }));
      
      // 현재 사용자 메시지 추가
      chatHistory.push({ role: 'user', content: userMessage });

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatHistory })
      });

      const data = await response.json();

      if (response.ok && data.content) {
        setMessages(prev => [...prev, { 
          id: Date.now() + 1, 
          text: data.content, 
          sender: 'bot' 
        }]);
      } else {
        throw new Error(data.error || '응답 오류');
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: '죄송해요, 일시적인 오류가 발생했어요. 잠시 후 다시 시도해 주세요! 🙏', 
        sender: 'bot' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return <div className="fixed bottom-6 right-6 z-50"><button onClick={() => setIsOpen(true)} className="w-14 h-14 rounded-full bg-blue-500 text-white text-2xl">💬</button></div>;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐾</span>
          <div>
            <h3 className="font-bold">PetCare+ AI</h3>
            <span className="text-xs opacity-80">Claude AI 기반 24시간 상담</span>
          </div>
        </div>
        <button onClick={handleClose} className="hover:bg-white/20 p-1 rounded">✕</button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map(m => (
          <div key={m.id} className={`p-3 rounded-xl max-w-[85%] ${m.sender === 'user' ? 'bg-blue-500 text-white ml-auto' : 'bg-white shadow-sm mr-auto border'}`}>
            <pre className="whitespace-pre-wrap font-sans text-sm">{m.text}</pre>
          </div>
        ))}
        {loading && (
          <div className="bg-white shadow-sm p-3 rounded-xl mr-auto border">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
            </div>
          </div>
        )}
      </div>
      <form onSubmit={handleSend} className="p-4 border-t bg-white flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="펫보험에 대해 물어보세요..." className="flex-1 border border-gray-300 px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" disabled={loading} />
        <button type="submit" disabled={loading} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition disabled:opacity-50">전송</button>
      </form>
      {/* 전문가 상담 신청 버튼 */}
      <div className="p-3 border-t bg-gray-50 rounded-b-2xl">
        <a 
          href="https://insurance-consultant-landing.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2.5 rounded-full font-semibold text-center hover:shadow-lg transition text-sm"
        >
          🧑‍💼 전문가 상담 신청하기
        </a>
      </div>
    </div>
  );
};

export default ChatBot;
