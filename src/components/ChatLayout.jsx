import React from 'react';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
import { Button } from './ui/button';
import { Moon, Sun, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import useChatManagement from '../hooks/useChatManagement';

const ChatLayout = ({ username, onLogout, keycloak }) => {
  const { theme, setTheme } = useTheme();
  const makeAuthenticatedRequest = async (url, method, body = null) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${keycloak.token}`,
      };
      const options = {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
      };
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      if('DELETE' === method) return;
      return await response.json();
    } catch (error) {
      console.error('Error making authenticated request:', error);
      throw error;
    }
  };

  const {
    chats,
    currentChatId,
    setCurrentChatId,
    addNewChat,
    updateChat,
    handleChatNameEdit,
    removeChat
  } = useChatManagement(makeAuthenticatedRequest);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar 
        chats={chats} 
        currentChatId={currentChatId} 
        setCurrentChatId={setCurrentChatId} 
        addNewChat={addNewChat}
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
          makeAuthenticatedRequest={makeAuthenticatedRequest}
        />
      </main>
    </div>
  );
};

export default ChatLayout;