import React, { useState } from 'react';
import { Button } from './ui/button';
import { Moon, Sun, LogOut, Volume2, VolumeX } from 'lucide-react';
import { useTheme } from 'next-themes';
import useChatManagement from '../hooks/useChatManagement';
import Documents from '../pages/Documents';
import ChatArea from './ChatArea';
import Sidebar from './Sidebar';
import DocumentUpload from './DocumentUpload';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import useInterview, { INTERVIEW_MODE } from "@/hooks/useInterview.js";
import InterviewQuestionArea from "@/components/InterviewQuestionArea.jsx";
import InterviewConductArea from "@/components/InterviewConductArea.jsx";

const ChatLayout = ({ username, onLogout, keycloak }) => {
  const { theme, setTheme } = useTheme();
  const [currentView, setCurrentView] = useState('chat');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [refreshDocuments, setRefreshDocuments] = useState(false);

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

  const {
    transcribe,
    speak,
    question,
    questionFile,
    conduct,
    feedback,
    botSpeak,
    setBotSpeak,
    interviewMode,
    setInterviewMode,
    interviewQuestion,
    setInterviewQuestion
  } = useInterview()

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  const openUploadModal = () => setIsUploadModalOpen(true);
  const closeUploadModal = () => setIsUploadModalOpen(false);
  const handleUploadSuccess = () => {
    setIsSuccessDialogOpen(true);
    setRefreshDocuments(prev => !prev);
  };
  const handleUploadError = (message) => {
    setErrorMessage(message);
    setIsErrorDialogOpen(true);
  };
  const toggleSpeak = () => setBotSpeak(!botSpeak);

  const renderContent = () => {
    if (currentView === 'documents') {
      return <Documents openUploadModal={openUploadModal} makeAuthenticatedRequest={makeAuthenticatedRequest} refreshTrigger={refreshDocuments} />;
    }

    switch (interviewMode) {
      case INTERVIEW_MODE.DISABLED:
        return (
          <ChatArea
            chat={chats.find(chat => chat.id === currentChatId)}
            updateChat={(newMessages) => updateChat(currentChatId, newMessages)}
            makeAuthenticatedRequest={makeAuthenticatedRequest}
            speak={speak} botSpeak={botSpeak} transcribe={transcribe}
          />
        );
      case INTERVIEW_MODE.INTERVIEW_QUESTION:
        return (
          <InterviewQuestionArea
            setInterviewMode={setInterviewMode}
            setInterviewQuestion={setInterviewQuestion}
            question={question} questionFile={questionFile}
          />
        );
      case INTERVIEW_MODE.INTERVIEW_CONDUCT:
        return (
          <InterviewConductArea
            interviewQuestion={interviewQuestion}
            conduct={conduct} feedback={feedback}
            speak={speak} botSpeak={botSpeak} transcribe={transcribe}
          />
        );
      default:
        return null;
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
        setInterviewMode={setInterviewMode}
      />
      <main className="flex-1 flex flex-col">
        <div className="p-4 flex justify-between items-center">
          <span className="font-bold text-center flex-grow">Welcome, {username}!</span>
          <div>
            <Button variant="ghost" size="icon" onClick={toggleSpeak} className="mr-2">
              {botSpeak ? <Volume2 className="h-[1.2rem] w-[1.2rem]" /> : <VolumeX className="h-[1.2rem] w-[1.2rem]" />}
            </Button>
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
        onUploadSuccess={handleUploadSuccess}
        onUploadError={handleUploadError}
      />
      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Successful</DialogTitle>
          </DialogHeader>
          <p>Your document has been successfully uploaded.</p>
        </DialogContent>
      </Dialog>
      <Dialog open={isErrorDialogOpen} onOpenChange={setIsErrorDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Error</DialogTitle>
          </DialogHeader>
          <p>{errorMessage}</p>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatLayout;
