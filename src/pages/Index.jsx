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

    keycloak.init({ 
      onLoad: 'check-sso',
      checkLoginIframe: false,
      pkceMethod: 'S256'
    })
      .then(auth => {
        setKeycloak(keycloak);
        setAuthenticated(auth);

        if (auth) {
          refreshTokenPeriodically(keycloak);
        }
      })
      .catch(error => {
        console.error("Keycloak initialization error:", error);
      });
  }, []);

  const refreshTokenPeriodically = (keycloak) => {
    setInterval(() => {
      keycloak.updateToken(70)
        .then((refreshed) => {
          if (refreshed) {
            console.log('Token refreshed');
          } else {
            console.log('Token not refreshed, valid for ' 
              + Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds');
          }
        })
        .catch(() => {
          console.error('Failed to refresh token');
          keycloak.login();
        });
    }, 60000); // Check every minute
  };

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
          <ChatLayout 
            username={keycloak.tokenParsed.preferred_username} 
            onLogout={handleLogout} 
            keycloak={keycloak}
          />
        )}
      </div>
    </ThemeProvider>
  );
};

export default Index;