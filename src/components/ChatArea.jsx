import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatInput from './ChatInput';
import FormattedMessage from './FormattedMessage';
import { Bot } from 'lucide-react';
import { format } from 'date-fns';
import { API_BASE_URL } from '../config';

const ChatArea = ({ chat, updateChat, makeAuthenticatedRequest, speak, botSpeak, transcribe }) => {
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [pendingResponses, setPendingResponses] = useState({});
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (chat && chat.id) {
      setMessages([]); // Clear old messages
      fetchMessages(chat.id);
    }
  }, [chat?.id]);

  useEffect(() => {
    if (pendingResponses[chat?.id]) {
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }
  }, [pendingResponses, chat?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async (chatId) => {
    try {
      const fetchedMessages = await makeAuthenticatedRequest(`${API_BASE_URL}/message/getMessages?chatID=${chatId}`, 'GET');
      setMessages(fetchedMessages);
      updateChat(fetchedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (content) => {
    if (!chat) return;
    
    const newMessage = { id: Date.now(), content, isUser: true, timestamp: new Date() };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    updateChat(updatedMessages);
    
    setPendingResponses(prev => ({ ...prev, [chat.id]: true }));
    
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/chat/send`, 'POST', {
        chatID: chat.id,
        content: content
      });
      
      setPendingResponses(prev => ({ ...prev, [chat.id]: false }));
      
      const botResponse = { id: Date.now() + 1, content: response.content, isUser: false, timestamp: new Date() };
      const finalMessages = [...updatedMessages, botResponse];
      setMessages(finalMessages);
      updateChat(finalMessages);
      if (botSpeak) await speak(botResponse.content)
    } catch (error) {
      console.error('Error sending message:', error);
      setPendingResponses(prev => ({ ...prev, [chat.id]: false }));
    }
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
                <FormattedMessage content={message.content} />
                <span className="text-xs text-muted-foreground ml-2">
                  {format(new Date(message.timestamp), 'yyyy-MM-dd HH:mm:ss')}
                </span>
              </div>
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
        <div ref={messagesEndRef} />
      </div>
      <ChatInput onSendMessage={sendMessage} transcribe={transcribe} />
    </div>
  );
};

export default ChatArea;
