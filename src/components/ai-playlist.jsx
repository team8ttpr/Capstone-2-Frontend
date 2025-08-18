import React, { useState, useRef, useEffect } from 'react';
import axios from "axios";
import { API_URL } from "../shared";
import '../style/GenerateUI.css';

const ChatComponent = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (message.trim() === '') return;
    const userMessage = { text: message, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/auth/spotify/ai-playlist`,
        { prompt: message },
        { withCredentials: true } 
      );
      if (res.data.playlistUrl) {
        setMessages(prev => [...prev, { text: res.data.playlistUrl, sender: 'ai' }]);
      } else if (res.data.message) {
        setMessages(prev => [...prev, { text: res.data.message, sender: 'ai' }]);
      } else {
        setMessages(prev => [...prev, { text: "Sorry, something went wrong.", sender: 'ai' }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { text: "Error: Could not generate playlist.", sender: 'ai' }]);
    } finally {
      setLoading(false);
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`message-bubble ${msg.sender === 'user' ? 'user-message' : 'ai-message'}`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="message-bubble ai-message">
            <div className="loading-indicator">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-container">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here..."
          rows="1"
        />
        <button 
          onClick={handleSendMessage}
          disabled={loading || message.trim() === ''}
        >
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;