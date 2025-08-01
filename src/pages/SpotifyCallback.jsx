import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../shared';

const SpotifyCallback = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Parse code and state from URL
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const returnedState = params.get('state');
    const storedState = localStorage.getItem('spotifyState');

    if (!code || !returnedState) {
      setError('Missing code or state from Spotify.');
      return;
    }
    if (returnedState !== storedState) {
      setError('State mismatch. Please try logging in again.');
      return;
    }

    // Send code and state to backend
    axios.post(`${API_URL}/auth/spotify/callback`, { code, state: returnedState }, { withCredentials: true })
      .then(res => {
        setSuccess(true);
        // Optionally redirect to dashboard or show success
        setTimeout(() => navigate('/analytics'), 2000);
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Failed to connect Spotify account.');
      });
  }, [navigate]);

  return (
    <div className="spotify-callback-container">
      {error ? (
        <div className="error-message">{error}</div>
      ) : success ? (
        <div className="success-message">Spotify connected! Redirecting...</div>
      ) : (
        <div>Connecting your Spotify account...</div>
      )}
    </div>
  );
};

export default SpotifyCallback;
