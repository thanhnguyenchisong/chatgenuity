import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const API_BASE_URL = 'http://localhost:8080';

let authToken = null;

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'An error occurred');
  }
  return response.json();
};

export const login = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    const data = await handleResponse(response);
    authToken = data.token;
    return data.user;
  } catch (error) {
    toast.error(error.message);
    throw error;
  }
};

export const createChat = async (title) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({ title }),
    });
    return await handleResponse(response);
  } catch (error) {
    toast.error(error.message);
    throw error;
  }
};

export const sendMessage = async (chatId, message, selectedModel) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chats/${chatId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({ message, model: selectedModel }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    const reader = response.body.getReader();
    return reader;
  } catch (error) {
    toast.error(error.message);
    throw error;
  }
};

export const useStreamResponse = (reader) => {
  const [streamedResponse, setStreamedResponse] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!reader) return;

    const readStream = async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            setIsComplete(true);
            break;
          }
          const chunk = new TextDecoder().decode(value);
          setStreamedResponse((prev) => prev + chunk);
        }
      } catch (error) {
        console.error('Error reading stream:', error);
        toast.error('Error reading response stream');
      }
    };

    readStream();

    return () => {
      reader.cancel();
    };
  }, [reader]);

  return { streamedResponse, isComplete };
};