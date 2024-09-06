import React from 'react';
import ChatLayout from '../components/ChatLayout';
import { ThemeProvider } from 'next-themes';

const Index = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background text-foreground">
        <ChatLayout username="Guest" onLogout={() => {}} />
      </div>
    </ThemeProvider>
  );
};

export default Index;