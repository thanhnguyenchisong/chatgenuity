import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
import { Button } from './ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { createChat } from '../utils/api';

const ChatLayout = ({ username }) => {
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const { theme, setTheme } = useTheme();
  const [editingChatId, setEditingChatId] = useState(null);
  const [selectedModel, setSelectedModel] = useState('gpt-4');

  const addNewChat = async () => {
    try {
      const newChat = await createChat('New chat');
      setChats([...chats, newChat]);
      setCurrentChatId(newChat.id);
    } catch (error) {
      console.error('Failed to create new chat:', error);
    }
  };

  const updateChat = (chatId, newMessages) => {
    setChats(chats.map(chat => 
      chat.id === chatId ? { ...chat, messages: newMessages } : chat
    ));
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleChatNameEdit = (chatId, newTitle) => {
    setChats(chats.map(chat =>
      chat.id === chatId ? { ...chat, title: newTitle } : chat
    ));
    setEditingChatId(null);
  };

  const removeChat = (chatId) => {
    const newChats = chats.filter(chat => chat.id !== chatId);
    setChats(newChats);
    if (currentChatId === chatId) {
      setCurrentChatId(newChats[0]?.id || null);
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar 
        chats={chats} 
        currentChatId={currentChatId} 
        setCurrentChatId={setCurrentChatId} 
        addNewChat={addNewChat}
        editingChatId={editingChatId}
        setEditingChatId={setEditingChatId}
        handleChatNameEdit={handleChatNameEdit}
        removeChat={removeChat}
      />
      <main className="flex-1 flex flex-col">
        <div className="p-4 flex justify-between items-center">
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4">Chat GPT 4.0</SelectItem>
              <SelectItem value="gemini-1.5">Gemini 1.5</SelectItem>
            </SelectContent>
          </Select>
          <span className="font-bold text-center flex-grow">Welcome, {username}!</span>
          <div>
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="mr-2">
              {theme === 'dark' ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
            </Button>
          </div>
        </div>
        <ChatArea 
          chat={chats.find(chat => chat.id === currentChatId)} 
          updateChat={(newMessages) => updateChat(currentChatId, newMessages)} 
          selectedModel={selectedModel}
        />
      </main>
    </div>
  );
};

export default ChatLayout;