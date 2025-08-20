import React, { useState, useRef, useEffect } from 'react';
import axios from "axios";
import { API_URL } from "../shared";
import '../style/GenerateUI.css';

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

  const getPlaylistIdFromUrl = (url) => {
    const match = url.match(/open\.spotify\.com\/playlist\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  };

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
      
      if (res.data.playlistUrl) {
        const playlistId = getPlaylistIdFromUrl(res.data.playlistUrl);
        let aiText = res.data.message || "Here's your playlist!";
        
        // Type out AI message character by character
        let i = 1;
        setAiTyping(aiText[0] || '');
        const typeInterval = setInterval(() => {
          setAiTyping(aiText.slice(0, i + 1));
          i++;
          if (i > aiText.length) {
            clearInterval(typeInterval);
            setMessages(prev => [...prev, { 
              text: aiText, 
              sender: 'ai', 
              type: 'playlist',
              playlistId: playlistId 
            }]);
            setAiTyping('');
            setLoading(false);
          }
        }, 18); // speed of typing
      } else if (res.data.message) {
        let aiText = res.data.message;
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
      } else {
        setMessages(prev => [...prev, { text: "Sorry, something went wrong.", sender: 'ai' }]);
        setLoading(false);
      }
    } catch (err) {
      setMessages(prev => [...prev, { text: "Error: Could not generate playlist.", sender: 'ai' }]);
      setAiTyping('');
      setLoading(false);
    } finally {
      setMessage('');
    }
  };

  const SpotifyEmbed = ({ playlistId }) => {
    return (
      <div className="spotify-embed-container">
        <iframe
          src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`}
          width="100%"
          height="380"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="spotify-embed-iframe"
        />
        <div className="spotify-embed-actions">
          <a 
            href={`https://open.spotify.com/playlist/${playlistId}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="spotify-open-button"
          >
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm4 0h-2V7h2v10z"/>
            </svg>
            Open in Spotify
          </a>
        </div>
      </div>
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-overlay">
      <div className="chat-container">
        <div className="chat-header">
          <div className="chat-title">Playlist Assistant</div>
          <button className="close-button">×</button>
        </div>
        <div className="messages-container">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`message-bubble ${msg.sender === 'user' ? 'user-message' : 'ai-message'}`}
            >
              {msg.type === 'playlist' && msg.playlistId ? (
                <SpotifyEmbed playlistId={msg.playlistId} />
              ) : (
                msg.text
              )}
            </div>
          ))}
          {aiTyping && (
            <div className="message-bubble ai-message">
              {aiTyping}
            </div>
          )}
          {loading && !aiTyping && (
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
            placeholder="Describe the playlist you want to create..."
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