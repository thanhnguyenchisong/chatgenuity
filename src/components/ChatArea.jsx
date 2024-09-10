import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatInput from './ChatInput';
import { Bot, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from './ui/button';

const API_BASE_URL = 'http://localhost:8080';

const ChatArea = ({ chat, updateChat, makeAuthenticatedRequest }) => {
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (chat && chat.id) {
      setMessages([]); // Clear old messages
      fetchMessages(chat.id);
    }
  }, [chat?.id]);

  const fetchMessages = async (chatId) => {
    try {
      const fetchedMessages = await makeAuthenticatedRequest(`${API_BASE_URL}/chat/messages?chatID=${chatId}`, 'GET');
      setMessages(fetchedMessages);
      updateChat(fetchedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (content) => {
    if (!chat) return;
    
    const newMessage = { id: Date.now(), content, isUser: true, reaction: null };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    updateChat(updatedMessages);
    
    setIsTyping(true);
    
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/chat/send`, 'POST', {
        chatID: chat.id,
        content: content
      });
      
      const botResponse = { id: Date.now() + 1, content: response.content, isUser: false, reaction: null };
      const finalMessages = [...updatedMessages, botResponse];
      setMessages(finalMessages);
      updateChat(finalMessages);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleReaction = (messageId, reaction) => {
    const updatedMessages = messages.map(message => 
      message.id === messageId 
        ? { ...message, reaction: message.reaction === reaction ? null : reaction }
        : message
    );
    setMessages(updatedMessages);
    updateChat(updatedMessages);
  };

  if (!chat) {
    return <div className="flex-1 flex items-center justify-center">No chat selected</div>;
  }

  return (
    <div className="flex-1 flex flex-col p-4 overflow-hidden">
      <div className="flex-1 overflow-y-auto mb-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-4 ${message.isUser ? 'text-right' : 'text-left'}`}
            >
              <div className={`inline-block p-3 rounded-lg ${message.isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                {!message.isUser && <Bot className="inline-block mr-2 h-4 w-4" />}
                {message.content}
              </div>
              {!message.isUser && (
                <div className="mt-2">
                  <Button variant="ghost" size="sm" onClick={() => handleReaction(message.id, 'like')} className={message.reaction === 'like' ? 'text-green-500' : ''}>
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleReaction(message.id, 'dislike')} className={message.reaction === 'dislike' ? 'text-red-500' : ''}>
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center text-muted-foreground">
            <Bot className="mr-2 h-4 w-4" />
            <span className="typing-animation">
              <span>.</span><span>.</span><span>.</span>
            </span>
          </motion.div>
        )}
      </div>
      <ChatInput onSendMessage={sendMessage} />
    </div>
  );
};

export default ChatArea;