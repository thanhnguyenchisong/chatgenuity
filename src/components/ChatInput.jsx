import React, {useEffect, useState} from 'react';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Send, Mic } from 'lucide-react';

const ChatInput = ({ onSendMessage, transcribe, disabled = false }) => {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [message, setMessage] = useState('');
  const [micAvailable, setMicAvailable] = useState(true);
  const [micRecording, setMicRecording] = useState(false);
  const [transcribedMessage, setTranscribedMessage] = useState('');

  useEffect(() => {
    if (transcribedMessage.trim()) {
      onSendMessage(transcribedMessage);
      setTranscribedMessage('')
    }
  }, [transcribedMessage]);

  useEffect(() => {
    if (mediaRecorder) {
      let chunks = []
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunks, {type: mediaRecorder.mimeType})
        chunks = []
        const message = await transcribe(audioBlob)
        setTranscribedMessage(message)
      }
      mediaRecorder.ondataavailable = function (e) {
        chunks.push(e.data)
      }
      console.log("MediaDevice created")
      console.log("Start recording")
      mediaRecorder.start()
      setMicRecording(true)
    }
  }, [mediaRecorder]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleMicOnClick = () => {
    if (!mediaRecorder) {
      if (navigator.mediaDevices.getUserMedia) {
        const constraints = {audio: true}

        let onSuccess = (stream) => {
          setMediaRecorder(new MediaRecorder(stream))
        }

        let onError = () => {
          console.log("Error getting MediaDevice")
          setMicAvailable(false)
        }

        navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
      } else {
        console.log("MediaDevice not supported")
        setMicAvailable(false)
      }
    }
    if (mediaRecorder) {
      if (!micRecording) {
        console.log("Start recording")
        mediaRecorder.start()
      } else {
        console.log("Stop recording")
        mediaRecorder.stop()
      }
      setMicRecording(!micRecording)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end">
      <Textarea
        disabled={micRecording || disabled}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
        className="flex-1 mr-2"
        rows={3}
      />
      <Button type="submit" size="icon" disabled={micRecording || disabled}>
        <Send className="h-4 w-4" />
      </Button>
      <Button type="button" onClick={handleMicOnClick} disabled={!micAvailable || disabled} className={"ml-2" + (micRecording ? " bg-red-800 hover:bg-red-900" : "")} size="icon">
        <Mic className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default ChatInput;