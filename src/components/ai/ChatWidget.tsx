'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { language, t } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.body.style.top = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
    return () => {
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.body.style.top = '';
    };
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    if (messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: t('chat.initialMessage'),
        },
      ]);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Get conversation history (last 10 messages)
      const history = messages.slice(-10).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          language: language,
          history: history,
        }),
      });

      // Check if response is OK before parsing JSON
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`API returned ${response.status}: ${errorText}`);
      }

      // Check content type to ensure it's JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const errorText = await response.text();
        console.error('API returned non-JSON response:', errorText);
        throw new Error('API returned non-JSON response');
      }

      const data = await response.json();

      const aiResponse: ChatMessage = {
        role: 'assistant',
        content: data.response || 'Desculpa, não consegui processar a tua pergunta.',
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: language === 'pt'
          ? 'Desculpe, ocorreu um erro ao processar a sua mensagem. Por favor, tente novamente.'
          : 'Sorry, there was an error processing your message. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={handleOpen}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-50 bg-[var(--accent)] text-[#1a1a2e] p-3 sm:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        aria-label="Chat with Singular AI"
      >
        <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-20 sm:bottom-24 right-0 sm:right-6 z-50 w-full sm:w-96 h-[calc(100vh-80px)] sm:h-[500px] bg-[var(--card)] rounded-none sm:rounded-2xl shadow-2xl border border-[var(--border)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[var(--accent)] text-[#1a1a2e] p-3 sm:p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
                <div>
                  <h3 className="font-semibold text-sm sm:text-base">{t('chat.title')}</h3>
                  <p className="text-[10px] sm:text-xs text-white/80">
                    {t('chat.subtitle')}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-1 sm:p-2 hover:bg-[var(--foreground)]/20 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[80%] p-2 sm:p-3 rounded-xl sm:rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-[var(--accent)] text-[#1a1a2e]'
                        : 'bg-[var(--card)] text-[var(--foreground)]'
                    }`}
                  >
                    <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[var(--card)] p-2 sm:p-3 rounded-xl sm:rounded-2xl">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[var(--accent)] rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[var(--accent)] rounded-full animate-bounce delay-100" />
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[var(--accent)] rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 sm:p-4 border-t border-[var(--border)]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('chat.placeholder')}
                  className="flex-1 px-3 sm:px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-xs sm:text-sm text-[var(--foreground)] placeholder:text-[var(--muted)]"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="p-2 sm:p-2 bg-[var(--accent)] text-[#1a1a2e] rounded-lg hover:bg-[var(--primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
