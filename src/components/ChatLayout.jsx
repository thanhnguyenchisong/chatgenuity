import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
import { Button } from './ui/button';
import { Moon, Sun, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';

const ChatLayout = ({ username, onLogout }) => {
  const [chats, setChats] = useState([{ id: 1, title: 'New chat', messages: [] }]);
  const [currentChatId, setCurrentChatId] = useState(1);
  const { theme, setTheme } = useTheme();
  const [editingChatId, setEditingChatId] = useState(null);

  const addNewChat = () => {
    const newChat = { id: Date.now(), title: 'New chat', messages: [] };
    setChats([...chats, newChat]);
    setCurrentChatId(newChat.id);
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
          <span className="font-bold text-center flex-grow">Welcome, {username}!</span>
          <div>
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="mr-2">
              {theme === 'dark' ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={onLogout}>
              <LogOut className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </div>
        </div>
        <ChatArea 
          chat={chats.find(chat => chat.id === currentChatId)} 
          updateChat={(newMessages) => updateChat(currentChatId, newMessages)} 
        />
      </main>
    </div>
  );
};

export default ChatLayout;