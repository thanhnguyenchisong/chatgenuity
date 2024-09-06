import React, { useState, useEffect } from 'react';
import Keycloak from 'keycloak-js';
import ChatLayout from '../components/ChatLayout';
import LoginForm from '../components/LoginForm';
import { ThemeProvider } from 'next-themes';

const Index = () => {
  const [keycloak, setKeycloak] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const keycloakConfig = {
      url: 'http://localhost:9000',
      realm: 'chatbotdev',
      clientId: 'chatbotclient'
    };

    const keycloak = new Keycloak(keycloakConfig);

    keycloak.init({ onLoad: 'check-sso' })
      .then(auth => {
        setKeycloak(keycloak);
        setAuthenticated(auth);
      })
      .catch(error => {
        console.error("Keycloak initialization error:", error);
      });
  }, []);

  const handleLogin = () => {
    if (keycloak) {
      keycloak.login();
    }
  };

  const handleLogout = () => {
    if (keycloak) {
      keycloak.logout();
    }
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background text-foreground">
        {!authenticated ? (
          <div className="flex items-center justify-center h-screen">
            <LoginForm onLogin={handleLogin} />
          </div>
        ) : (
          <ChatLayout username={keycloak.tokenParsed.preferred_username} onLogout={handleLogout} />
        )}
      </div>
    </ThemeProvider>
  );
};

export default Index;