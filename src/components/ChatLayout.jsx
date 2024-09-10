import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
import { Button } from './ui/button';
import { Moon, Sun, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';

const API_BASE_URL = 'http://localhost:8080';

const ChatLayout = ({ username, onLogout, keycloak }) => {
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const { theme, setTheme } = useTheme();
  const [editingChatId, setEditingChatId] = useState(null);

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

      return await response.json();
    } catch (error) {
      console.error('Error making authenticated request:', error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const fetchedChats = await makeAuthenticatedRequest(`${API_BASE_URL}/chat/getChats`, 'GET');
        setChats(fetchedChats);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();
  }, []);

  const addNewChat = async () => {
    try {
      const newChat = await makeAuthenticatedRequest(`${API_BASE_URL}/chat/create`, 'POST', { name: "New chat" });
      setChats([...chats, newChat]);
      setCurrentChatId(newChat.id);
    } catch (error) {
      console.error('Error creating new chat:', error);
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

  const handleChatNameEdit = async (chatId, newTitle) => {
    try {
      await makeAuthenticatedRequest(`${API_BASE_URL}/chat/update`, 'PUT', { name: newTitle });
      setChats(chats.map(chat =>
        chat.id === chatId ? { ...chat, name: newTitle } : chat
      ));
      setEditingChatId(null);
    } catch (error) {
      console.error('Error updating chat name:', error);
    }
  };

  const removeChat = async (chatId) => {
    try {
      await makeAuthenticatedRequest(`${API_BASE_URL}/chat/${chatId}`, 'DELETE');
      const newChats = chats.filter(chat => chat.id !== chatId);
      setChats(newChats);
      if (currentChatId === chatId) {
        setCurrentChatId(newChats[0]?.id || null);
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
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
          makeAuthenticatedRequest={makeAuthenticatedRequest}
        />
      </main>
    </div>
  );
};

export default ChatLayout;