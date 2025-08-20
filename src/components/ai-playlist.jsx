import React, { useState, useRef, useEffect } from 'react';
import axios from "axios";
import { API_URL } from "../shared";
import '../style/ai-playlist.css';

const ChatComponent = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiTyping, setAiTyping] = useState('');
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
  }, [messages, aiTyping]);

  const handleSendMessage = async () => {
    if (message.trim() === '') return;
    const userMessage = { text: message, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setAiTyping('');
    try {
      const res = await axios.post(
        `${API_URL}/auth/spotify/ai-playlist`,
        { prompt: message },
        { withCredentials: true } 
      );
      let aiText = res.data.playlistUrl || res.data.message || "Sorry, something went wrong.";
      // Type out AI message character by character
      let i = 1;
      setAiTyping(aiText[0] || '');
      const typeInterval = setInterval(() => {
        setAiTyping(aiText.slice(0, i + 1));
        i++;
        if (i > aiText.length) {
          clearInterval(typeInterval);
          setMessages(prev => [...prev, { text: aiText, sender: 'ai' }]);
          setAiTyping('');
          setLoading(false);
        }
      }, 18); // speed of typing
    } catch (err) {
      setMessages(prev => [...prev, { text: "Error: Could not generate playlist.", sender: 'ai' }]);
      setAiTyping('');
      setLoading(false);
    } finally {
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
    <div className="chat-overlay">
      <div className="chat-box">
        <div className="messages-area">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`message-bubble ${msg.sender === 'user' ? 'user-message' : ''}`}
            >
              {msg.text}
            </div>
          ))}
          {aiTyping && (
            <div className="message-bubble">
              {aiTyping}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="input-area">
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
    </div>
  );
};

export default ChatComponent;