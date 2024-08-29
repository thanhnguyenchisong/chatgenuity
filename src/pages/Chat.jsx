import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SendHorizontal, UserCircle2, Bot, MoonStar, SunMedium, Edit2, Trash2, Check, X, Smile, ThumbsUp, ThumbsDown, Eraser } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from 'next-themes';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip } from "@/components/ui/tooltip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const ChatMessage = ({ message, isUser, onEdit, onDelete }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(message.text);

  const handleEdit = () => {
    onEdit(message.id, editedText);
    setIsEditing(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`flex items-end space-x-2 ${isUser ? 'flex-row-reverse' : 'flex-row'} group`}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isUser ? 'bg-blue-500' : isDark ? 'bg-gray-600' : 'bg-gray-300'}`}>
          {isUser ? <UserCircle2 className="w-6 h-6 text-white" /> : <Bot className={`w-6 h-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />}
        </div>
        <div className={`max-w-[70%] p-4 rounded-2xl shadow-md relative ${
          isUser 
            ? 'bg-blue-500 text-white' 
            : isDark 
              ? 'bg-gray-700 text-white' 
              : 'bg-white text-gray-800'
        }`}>
          {isEditing ? (
            <Textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="mb-2"
            />
          ) : (
            message.text
          )}
          <div className={`text-xs mt-2 ${isUser ? 'text-blue-200' : isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {format(new Date(message.timestamp), 'HH:mm')}
          </div>
          {isUser && (
            <div className={`absolute top-2 right-2 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity`}>
              {isEditing ? (
                <>
                  <Button size="icon" variant="ghost" onClick={handleEdit}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => setIsEditing(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button size="icon" variant="ghost" onClick={() => setIsEditing(true)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => onDelete(message.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const TypingIndicator = () => (
  <div className="flex items-center space-x-2 text-gray-400">
    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '200ms' }}></div>
    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '400ms' }}></div>
  </div>
);

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef(null);
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (input.trim()) {
      const newMessage = { id: Date.now(), text: input, isUser: true, timestamp: new Date() };
      setMessages([...messages, newMessage]);
      setInput('');
      setIsTyping(true);
      // Simulate bot response (replace with actual API call in a real application)
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { 
          id: Date.now(),
          text: "This is an advanced simulated response from the chatbot. I'm here to assist you with any questions or tasks you might have!",
          isUser: false,
          timestamp: new Date()
        }]);
      }, 2000);
    }
  };

  const handleEdit = (id, newText) => {
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, text: newText } : msg
    ));
  };

  const handleDelete = (id) => {
    setMessages(messages.filter(msg => msg.id !== id));
  };

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <div className={`flex flex-col h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <header className={`${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md py-4 px-6 flex justify-between items-center`}>
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Chat Bot</h1>
        <Button onClick={toggleTheme} variant="ghost" size="icon">
          {isDark ? <SunMedium className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
        </Button>
      </header>
      <div className="flex-1 p-4 overflow-hidden">
        <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
          <AnimatePresence>
            {messages.map((msg) => (
              <ChatMessage 
                key={msg.id} 
                message={msg} 
                isUser={msg.isUser} 
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
          {isTyping && <TypingIndicator />}
        </ScrollArea>
      </div>
      <div className={`p-4 ${isDark ? 'bg-gray-800' : 'bg-white'} border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex space-x-2 max-w-4xl mx-auto">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
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
