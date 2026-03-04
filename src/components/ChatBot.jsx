import React, { useState } from 'react';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState([{
    id: 1,
    text: '안녕하세요! PetCare+ AI 상담사입니다 🐾\n펫보험에 대해 궁금한 점을 물어보세요!',
    sender: 'bot'
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

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
    <div className="fixed bottom-6 right-6 z-50 w-80 h-80 bg-white rounded-lg shadow-lg flex flex-col">
      <div className="bg-blue-500 text-white p-3 flex justify-between items-center">
        <h3>PetCare+ AI</h3>
        <button onClick={() => setIsOpen(false)}>✕</button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map(m => (
          <div key={m.id} className={`p-2 rounded-lg ${m.sender === 'user' ? 'bg-blue-100 ml-8' : 'bg-gray-100 mr-8'}`}>
            {m.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="p-3 border-t flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="메시지 입력..." className="flex-1 border px-2 py-1 rounded" disabled={loading} />
        <button type="submit" disabled={loading} className="bg-blue-500 text-white px-3 py-1 rounded">전송</button>
      </form>
    </div>
  );
};

export default ChatBot;
