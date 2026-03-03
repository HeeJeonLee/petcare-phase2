import React, { useState } from 'react';
import Anthropic from '@anthropic-ai/sdk';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState([{
    id: 1,
    text: 'PetCare+ AI입니다. 펫보험 관련 질문 편하게 물어봐 주세요!',
    sender: 'bot'
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const client = new Anthropic({
    apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY
  });

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(p => [...p, { id: p.length + 1, text: input, sender: 'user' }]);
    setInput('');
    setLoading(true);

    try {
      const res = await client.messages.create({
        model: 'claude-opus-4-1-20250805',
        max_tokens: 300,
        messages: [...messages.map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text })), { role: 'user', content: input }]
      });

      setMessages(p => [...p, { id: p.length + 1, text: res.content[0].text, sender: 'bot' }]);
    } catch (err) {
      setMessages(p => [...p, { id: p.length + 1, text: '죄송해요. 다시 시도해 주세요.', sender: 'bot' }]);
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
