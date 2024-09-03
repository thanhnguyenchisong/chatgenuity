import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatInput from './ChatInput';
import { Bot, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from './ui/button';

const ChatArea = ({ chat, updateChat }) => {
  const [isTyping, setIsTyping] = useState(false);

  const addMessage = (content, isUser = true) => {
    if (!chat) return; // Add this check
    const newMessage = { id: Date.now(), content, isUser, reaction: null };
    updateChat([...(chat.messages || []), newMessage]);
    if (isUser) {
      setIsTyping(true);
      setTimeout(() => {
        const botResponse = { id: Date.now() + 1, content: "This is a fake response from the AI.", isUser: false, reaction: null };
        updateChat([...(chat.messages || []), newMessage, botResponse]);
        setIsTyping(false);
      }, 2000);
    }
  };

  const handleReaction = (messageId, reaction) => {
    if (!chat) return; // Add this check
    updateChat(chat.messages.map(message => 
      message.id === messageId 
        ? { ...message, reaction: message.reaction === reaction ? null : reaction }
        : message
    ));
  };

  if (!chat) {
    return <div className="flex-1 flex items-center justify-center">No chat selected</div>;
  }

  return (
    <div className="flex-1 flex flex-col p-4 overflow-hidden">
      <div className="flex-1 overflow-y-auto mb-4">
        <AnimatePresence>
          {chat.messages && chat.messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-4 ${message.isUser ? 'text-right' : 'text-left'}`}
            >
              <div
                className={`inline-block p-3 rounded-lg ${
                  message.isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                }`}
              >
                {!message.isUser && (
                  <Bot className="inline-block mr-2 h-4 w-4" />
                )}
                {message.content}
              </div>
              {!message.isUser && (
                <div className="mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReaction(message.id, 'like')}
                    className={message.reaction === 'like' ? 'text-green-500' : ''}
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReaction(message.id, 'dislike')}
                    className={message.reaction === 'dislike' ? 'text-red-500' : ''}
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center text-muted-foreground"
          >
            <Bot className="mr-2 h-4 w-4" />
            <span className="typing-animation">
              <span>.</span><span>.</span><span>.</span>
            </span>
          </motion.div>
        )}
      </div>
      <ChatInput onSendMessage={addMessage} />
    </div>
  );
};

export default ChatArea;