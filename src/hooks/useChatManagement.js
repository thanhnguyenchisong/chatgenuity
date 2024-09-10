import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8080';

const useChatManagement = (makeAuthenticatedRequest) => {
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const fetchedChats = await makeAuthenticatedRequest(`${API_BASE_URL}/chat/getChats`, 'GET');
      setChats(fetchedChats);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

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

  const handleChatNameEdit = async (chatId, newTitle) => {
    try {
      await makeAuthenticatedRequest(`${API_BASE_URL}/chat/update`, 'PUT', { id: chatId, name: newTitle });
      setChats(chats.map(chat =>
        chat.id === chatId ? { ...chat, name: newTitle } : chat
      ));
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

  return {
    chats,
    currentChatId,
    setCurrentChatId,
    addNewChat,
    updateChat,
    handleChatNameEdit,
    removeChat
  };
};

export default useChatManagement;