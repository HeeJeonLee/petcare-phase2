// src/components/ChatBot.jsx
import React, { useState, useRef, useEffect } from 'react';
import Anthropic from '@anthropic-ai/sdk';

const ChatBot = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: '안녕하세요! PetCare+ AI입니다. 펫보험, 반려동물 건강 등 편하게 물어봐 주세요.',
      sender: 'bot',
      timestamp: new Date(),
      isStreaming: false
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const client = new Anthropic({
    apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY
  });

  const systemPrompt = `당신은 PetCare+ AI 챗봇입니다. 친절하고 자연스럽습니다.`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

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

      const botResponseText = response.content[0].type === 'text' 
        ? response.content[0].text 
        : '죄송해요. 다시 시도해 주세요.';
      
      const botMessage = {
        id: messages.length + 2,
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date(),
        isStreaming: false
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('ChatBot 오류:', error);
      const errorMessage = {
        id: messages.length + 2,
        text: '죄송해요. 일시적 오류가 발생했습니다.',
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
    if (onClose) onClose();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all flex items-center justify-center"
        >
          <span className="text-3xl">💬</span>
        </button>
      )}

      {isOpen && (
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🐾</span>
              <div>
                <h3 className="font-bold">PetCare+ AI</h3>
                <p className="text-xs">온라인</p>
              </div>
            </div>
            <button onClick={handleClose} className="hover:bg-white hover:bg-opacity-20 p-2 rounded-full">
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-blue-50 space-y-3">
            {messages.map(message => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white border border-gray-200'
                }`}>
                  <p>{message.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="메시지..."
                disabled={loading}
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded-full disabled:opacity-50"
              >
                전송
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
