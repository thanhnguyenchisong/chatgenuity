import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SendHorizontal, UserCircle2, Bot, MoonStar, SunMedium } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from 'next-themes';

const ChatMessage = ({ message, isUser }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`flex items-end space-x-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isUser ? 'bg-blue-500' : isDark ? 'bg-gray-600' : 'bg-gray-300'}`}>
          {isUser ? <UserCircle2 className="w-6 h-6 text-white" /> : <Bot className={`w-6 h-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />}
        </div>
        <div className={`max-w-[70%] p-4 rounded-2xl shadow-md ${
          isUser 
            ? 'bg-blue-500 text-white' 
            : isDark 
              ? 'bg-gray-700 text-white' 
              : 'bg-white text-gray-800'
        }`}>
          {message}
        </div>
      </div>
    </motion.div>
  );
};

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const scrollAreaRef = useRef(null);
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, isUser: true }]);
      setInput('');
      // Simulate bot response (replace with actual API call in a real application)
      setTimeout(() => {
        setMessages(prev => [...prev, { text: "This is a simulated response from the chatbot. I'm here to assist you with any questions or tasks you might have!", isUser: false }]);
      }, 1000);
    }
  };

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <div className={`flex flex-col h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <header className={`${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md py-4 px-6 flex justify-between items-center`}>
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>ChatGenuity</h1>
        <Button onClick={toggleTheme} variant="ghost" size="icon">
          {isDark ? <SunMedium className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
        </Button>
      </header>
      <div className="flex-1 p-4 overflow-hidden">
        <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
          <AnimatePresence>
            {messages.map((msg, index) => (
              <ChatMessage key={index} message={msg.text} isUser={msg.isUser} />
            ))}
          </AnimatePresence>
        </ScrollArea>
      </div>
      <div className={`p-4 ${isDark ? 'bg-gray-800' : 'bg-white'} border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex space-x-2 max-w-4xl mx-auto">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className={`flex-grow ${isDark ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}
          />
          <Button onClick={handleSend} className="bg-blue-500 hover:bg-blue-600 text-white">
            <SendHorizontal className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
