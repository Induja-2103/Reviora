import React, { useState, useEffect, useRef } from 'react';
import { chatService } from '../services/api';
import { MessageSquare, Send, Sparkles, User, Terminal, Code } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';

const ChatAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hi! I am your Reviora AI Code Review assistant. Paste your code snippet in the context box below and ask me questions about logic bugs, optimization, or security risks!'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [contextCode, setContextCode] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() && !contextCode.trim()) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: inputText,
      context_code: contextCode || null
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setSending(true);

    try {
      const response = await chatService.sendMessage(userMsg.content, userMsg.context_code);
      setMessages((prev) => [
        ...prev,
        {
          id: response.id,
          role: response.role,
          content: response.content
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: 'Oops! I encountered an error connecting to the analysis engine. Please try again.'
        }
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="border-b border-white/5 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center space-x-2 select-none">
          <span>AI Chat Assistant</span>
        </h1>
        <p className="text-slate-400 text-xs font-semibold mt-1">Converse with the code analyzer regarding optimization, security, and bugs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[600px]">
        
        {/* Chat Messages Frame */}
        <GlassCard className="lg:col-span-8 border border-white/5 flex flex-col justify-between h-full p-6 bg-dark-900/10">
          {/* Scrollable messages container */}
          <div className="flex-1 overflow-y-auto space-y-6 pr-2 mb-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${
                  msg.role === 'user' ? 'justify-end' : ''
                }`}
              >
                {/* Assistant avatar logo */}
                {msg.role !== 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-accent-neon" />
                  </div>
                )}

                <div
                  className={`p-4 rounded-2xl max-w-[80%] text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-accent-primary text-white rounded-tr-none'
                      : 'bg-white/5 border border-white/5 text-slate-300 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap font-medium">{msg.content}</p>
                  
                  {msg.context_code && (
                    <div className="mt-3 p-3 rounded-lg bg-black/40 border border-white/5 font-mono text-xs text-slate-400 overflow-x-auto">
                      <code>{msg.context_code}</code>
                    </div>
                  )}
                </div>

                {/* User icon */}
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-slate-400" />
                  </div>
                )}
              </div>
            ))}
            
            {/* Typing status indicator */}
            {sending && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-accent-neon animate-pulse" />
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center space-x-1.5 rounded-tl-none">
                  <div className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Entry Input */}
          <form onSubmit={handleSend} className="flex items-center space-x-3 border-t border-white/5 pt-4">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl glass-input text-slate-100 text-sm font-semibold focus:outline-none"
              placeholder="Ask a question about your code or safety..."
            />
            <GlowButton type="submit" variant="primary" className="py-3 px-4 shrink-0 flex items-center justify-center">
              <Send className="w-4.5 h-4.5" />
            </GlowButton>
          </form>
        </GlassCard>

        {/* Reference Context Sidebar */}
        <div className="lg:col-span-4 flex flex-col justify-between h-full space-y-4">
          <GlassCard className="p-0 border border-white/10 flex-1 flex flex-col overflow-hidden bg-dark-900/10">
            <div className="flex items-center justify-between px-4 py-2.5 bg-dark-900 border-b border-white/5 shrink-0">
              <div className="flex items-center space-x-2">
                <Code className="w-4 h-4 text-accent-neon" />
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Referenced Snippet</span>
              </div>
            </div>
            
            <textarea
              value={contextCode}
              onChange={(e) => setContextCode(e.target.value)}
              className="flex-1 w-full p-4 bg-[#07070a]/20 text-slate-300 font-mono text-xs focus:outline-none resize-none leading-relaxed border-none"
              placeholder="Paste custom lines here to inject code context during chat interactions..."
            />
          </GlassCard>
        </div>

      </div>

    </div>
  );
};

export default ChatAssistant;
