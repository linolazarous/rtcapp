import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ScrollArea } from '../components/ui/scroll-area';
import { toast } from 'sonner';
import { 
  Send, 
  Brain, 
  User, 
  Loader2, 
  Sparkles,
  BookOpen,
  Lightbulb,
  Code
} from 'lucide-react';

const AITutorPage = () => {
  const { api, isAuthenticated, user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const suggestions = [
    { icon: Code, text: "Explain how async/await works in JavaScript" },
    { icon: BookOpen, text: "What are the key concepts in machine learning?" },
    { icon: Lightbulb, text: "How do I start learning cybersecurity?" },
  ];

  const handleSend = async () => {
    if (!input.trim()) return;

    if (!isAuthenticated) {
      toast.error('Please login to use the AI Tutor');
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await api.post('/ai/chat', {
        content: userMessage,
        lesson_context: null,
        course_id: null
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response.data.response }]);
      setSessionId(response.data.session_id);
    } catch (error) {
      console.error('AI chat error:', error);
      toast.error('Failed to get AI response');
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestion = (text) => {
    setInput(text);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] pt-20" data-testid="ai-tutor-page">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-5rem)] flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 bg-[#CCFF00]/10 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-[#CCFF00]" />
            <span className="text-sm text-[#CCFF00] font-medium">Powered by GPT-5.2</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-2">
            AI <span className="gradient-text">Tutor</span>
          </h1>
          <p className="text-[#A1A1AA]">Ask me anything about tech, programming, or your courses</p>
        </motion.div>

        {/* Chat Area */}
        <div className="flex-1 bg-[#0A0A0A] border border-[#27272A] flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 p-6" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center">
                <Brain className="w-16 h-16 text-[#27272A] mb-6" />
                <h3 className="text-lg font-bold text-white mb-2">Start a Conversation</h3>
                <p className="text-[#A1A1AA] text-center mb-8 max-w-md">
                  Ask questions about programming, data science, AI, cybersecurity, or any tech topic.
                </p>
                
                {/* Suggestions */}
                <div className="space-y-3 w-full max-w-md">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestion(suggestion.text)}
                      className="w-full flex items-center gap-3 p-4 bg-[#121212] border border-[#27272A] hover:border-[#CCFF00]/50 transition-colors text-left group"
                    >
                      <suggestion.icon className="w-5 h-5 text-[#CCFF00]" />
                      <span className="text-sm text-[#A1A1AA] group-hover:text-white transition-colors">
                        {suggestion.text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-[#CCFF00] flex items-center justify-center shrink-0">
                        <Brain className="w-4 h-4 text-black" />
                      </div>
                    )}
                    <div className={`max-w-[80%] p-4 ${
                      message.role === 'user' 
                        ? 'bg-[#121212] border border-[#27272A]' 
                        : 'bg-[#CCFF00]/10 border border-[#CCFF00]/20'
                    }`}>
                      <div className="prose prose-invert prose-sm max-w-none">
                        {message.content.split('\n').map((line, i) => (
                          <p key={i} className="text-white text-sm mb-2 last:mb-0">
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                    {message.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-[#27272A] flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </motion.div>
                ))}
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-4"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#CCFF00] flex items-center justify-center">
                      <Brain className="w-4 h-4 text-black" />
                    </div>
                    <div className="bg-[#CCFF00]/10 border border-[#CCFF00]/20 p-4">
                      <Loader2 className="w-5 h-5 text-[#CCFF00] animate-spin" />
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-[#27272A]">
            <div className="flex gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isAuthenticated ? "Ask anything..." : "Please login to chat"}
                disabled={!isAuthenticated || loading}
                className="flex-1 bg-[#121212] border-[#27272A] text-white placeholder:text-[#52525B] h-12"
                data-testid="ai-chat-input"
              />
              <Button
                onClick={handleSend}
                disabled={!isAuthenticated || loading || !input.trim()}
                className="bg-[#CCFF00] text-black hover:bg-[#B3E600] h-12 px-6"
                data-testid="ai-chat-send"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </Button>
            </div>
            {!isAuthenticated && (
              <p className="text-xs text-[#52525B] text-center mt-3">
                Please <a href="/login" className="text-[#CCFF00] hover:underline">login</a> to use the AI Tutor
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITutorPage;
