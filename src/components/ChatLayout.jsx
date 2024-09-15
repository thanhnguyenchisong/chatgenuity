import React from 'react';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
import { Button } from './ui/button';
import {Moon, Sun, LogOut, Volume2, VolumeX} from 'lucide-react';
import { useTheme } from 'next-themes';
import useChatManagement from '../hooks/useChatManagement';
import useInterview, {INTERVIEW_MODE} from "@/hooks/useInterview.js";
import InterviewQuestionArea from "@/components/InterviewQuestionArea.jsx";
import InterviewConductArea from "@/components/InterviewConductArea.jsx";

const ChatLayout = ({ username, onLogout, keycloak }) => {
  const { theme, setTheme } = useTheme();

  const makeAuthenticatedRequest = async (url, method, body = null) => {
    try {
      // Refresh token if it's close to expiration (e.g., less than 30 seconds left)
      const tokenExpiresIn = keycloak.tokenParsed.exp - Math.floor(Date.now() / 1000);
      if (tokenExpiresIn < 30) {
        await keycloak.updateToken(30);
      }

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
      if ('DELETE' === method) return;
      return await response.json();
    } catch (error) {
      console.error('Error making authenticated request:', error);
      if (error.message.includes('Token refresh failed')) {
        // If token refresh fails, redirect to login
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

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleSpeak = () => {
    console.log(`Bot Speak: ${!botSpeak}`)
    setBotSpeak(!botSpeak)
  };

  let mainPane
  switch (interviewMode) {
    case INTERVIEW_MODE.DISABLED:
      mainPane = (
          <ChatArea
              chat={chats.find(chat => chat.id === currentChatId)}
              updateChat={(newMessages) => updateChat(currentChatId, newMessages)}
              makeAuthenticatedRequest={makeAuthenticatedRequest}
              speak={speak} botSpeak={botSpeak} transcribe={transcribe}
          />
      )
      break;
    case INTERVIEW_MODE.INTERVIEW_QUESTION:
      mainPane = (
          <InterviewQuestionArea
              setInterviewMode={setInterviewMode}
              setInterviewQuestion={setInterviewQuestion}
              question={question} questionFile={questionFile}
          />
      )
      break;
    case INTERVIEW_MODE.INTERVIEW_CONDUCT:
      mainPane = (
          <InterviewConductArea
              interviewQuestion={interviewQuestion}
              conduct={conduct} feedback={feedback}
              speak={speak} botSpeak={botSpeak} transcribe={transcribe}
          />
      )
      break;
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar 
        chats={chats} 
        currentChatId={currentChatId} 
        setCurrentChatId={setCurrentChatId} 
        addNewChat={addNewChat}
        handleChatNameEdit={handleChatNameEdit}
        removeChat={removeChat}
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
        {mainPane}
      </main>
    </div>
  );
};

export default ChatLayout;