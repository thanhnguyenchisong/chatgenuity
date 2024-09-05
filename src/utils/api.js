import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8080';

export const sendMessage = async (message, selectedModel) => {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, model: selectedModel }),
  });

  if (!response.ok) {
    throw new Error('Failed to send message');
  }

  const reader = response.body.getReader();
  return reader;
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
      }
    };

    readStream();

    return () => {
      reader.cancel();
    };
  }, [reader]);

  return { streamedResponse, isComplete };
};