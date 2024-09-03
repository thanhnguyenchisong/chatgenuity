import React, { useState, useEffect } from 'react';
import ChatLayout from '../components/ChatLayout';
import LoginForm from '../components/LoginForm';
import { ThemeProvider } from 'next-themes';

const Index = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('chatwhirl_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (username, password) => {
    // In a real application, you would validate the password here
    const newUser = { username };
    setUser(newUser);
    localStorage.setItem('chatwhirl_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('chatwhirl_user');
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background text-foreground">
        {!user ? (
          <div className="flex items-center justify-center h-screen">
            <LoginForm onLogin={handleLogin} />
          </div>
        ) : (
          <ChatLayout username={user.username} onLogout={handleLogout} />
        )}
      </div>
    </ThemeProvider>
  );
};

export default Index;