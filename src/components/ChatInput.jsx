import React, { useState } from 'react';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Send } from 'lucide-react';

const ChatInput = ({ onSendMessage, isTyping }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isTyping) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end">
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
        className="flex-1 mr-2"
        rows={3}
        disabled={isTyping}
      />
      <Button type="submit" size="icon" disabled={isTyping}>
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default ChatInput;