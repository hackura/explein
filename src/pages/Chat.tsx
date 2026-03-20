import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', content: `Hello! I am your Explein AI study assistant. What subject are we tackling today?` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-study-material', {
        body: { 
          type: 'chat', 
          messages: newMessages.slice(-6) // Send last 6 messages for context
        }
      });

      if (error) throw error;
      if (data && data.error) throw new Error(data.error);

      const aiResponse = { 
        id: Date.now() + 1, 
        role: 'ai', 
        content: typeof data === 'string' ? data : "I'm sorry, I couldn't process that request."
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (err: any) {
      console.error('Chat failed:', err);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'ai',
        content: `Error: ${err.message || "Failed to connect to Gemini"}. Please ensure your GEMINI_API_KEY is correct and the Edge Function is deployed.`
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <Bot className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">AI Study Assistant</h2>
            <p className="text-xs text-gray-500">Always online</p>
          </div>
        </div>
        <button className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-lg flex items-center gap-2 hover:bg-blue-100 transition-colors font-medium">
          <Sparkles className="w-4 h-4" />
          New Topic
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-blue-600 text-white text-xs font-bold' : 'bg-blue-100'}`}>
              {msg.role === 'user' ? (
                user?.email?.charAt(0).toUpperCase() || 'U'
              ) : (
                <Bot className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm shadow-md shadow-blue-100' : 'bg-gray-100 text-gray-800 rounded-tl-sm'}`}>
              <p className="text-sm sm:text-base leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
              <Bot className="w-5 h-5 text-blue-600" />
            </div>
            <div className="bg-gray-100 rounded-2xl rounded-tl-sm p-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200 bg-white shrink-0">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
