import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Moon, Sun, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import useChatManagement from '../hooks/useChatManagement';
import Documents from '../pages/Documents';
import ChatArea from './ChatArea';
import Sidebar from './Sidebar';
import DocumentUpload from './DocumentUpload';

const API_BASE_URL = 'http://localhost:8080';

const ChatLayout = ({ username, onLogout, keycloak }) => {
  const { theme, setTheme } = useTheme();
  const [currentView, setCurrentView] = useState('chat');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [documents, setDocuments] = useState([]);

  const makeAuthenticatedRequest = async (url, method, body = null, isFormData = false) => {
    try {
      const tokenExpiresIn = keycloak.tokenParsed.exp - Math.floor(Date.now() / 1000);
      if (tokenExpiresIn < 30) {
        await keycloak.updateToken(30);
      }

      const headers = {
        'Authorization': `Bearer ${keycloak.token}`,
      };

      if (!isFormData) {
        headers['Content-Type'] = 'application/json';
      }

      const options = {
        method,
        headers,
        body: isFormData ? body : (body ? JSON.stringify(body) : null),
      };

      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      if ('DELETE' === method) return;
      return await response.json();
    } catch (error) {
      console.error('Error making authenticated request:', error);
      if (error.message.includes('Token refresh failed')) {
        keycloak.login();
      }
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

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const fetchedDocuments = await makeAuthenticatedRequest(`${API_BASE_URL}/document/list`, 'GET');
      setDocuments(fetchedDocuments);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const openUploadModal = () => {
    setIsUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
    fetchDocuments(); // Refresh the documents list after upload
  };

  const renderContent = () => {
    switch (currentView) {
      case 'documents':
        return <Documents documents={documents} openUploadModal={openUploadModal} makeAuthenticatedRequest={makeAuthenticatedRequest} />;
      default:
        return <ChatArea chat={chats.find(chat => chat.id === currentChatId)} updateChat={updateChat} makeAuthenticatedRequest={makeAuthenticatedRequest} />;
    }
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
        setCurrentView={setCurrentView}
        openUploadModal={openUploadModal}
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
        {renderContent()}
      </main>
      <DocumentUpload 
        makeAuthenticatedRequest={makeAuthenticatedRequest}
        isOpen={isUploadModalOpen}
        onClose={closeUploadModal}
      />
    </div>
  );
};

export default ChatLayout;