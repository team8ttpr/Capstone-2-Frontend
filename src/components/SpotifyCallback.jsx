import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../shared';

const SpotifyCallback = ({ setUser }) => { 
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        if (error) {
          navigate('/auth?error=access_denied');
          return;
        }

        if (!code) {
          navigate('/auth?error=no_code');
          return;
        }

        const token = localStorage.getItem('authToken');
        
        if (state === 'spotify_login') {
          const response = await axios.post(
            `${API_URL}/auth/spotify/login`,
            { code, state },
            { withCredentials: true }
          );

          if (response.data.token) {
            localStorage.setItem('authToken', response.data.token);
          }

          setUser(response.data.user);
          navigate('/top-tracks?spotify_login=success');
          return;
        }

        if (!token) {
          navigate('/auth?error=no_auth');
          return;
        }

        const response = await axios.post(
          `${API_URL}/auth/spotify/callback`,
          { code, state },
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        navigate('/spotify?success=true');
        
      } catch (error) {
        console.error('Spotify callback error:', error.message);
        navigate('/auth?error=callback_failed');
      }
    };

    handleCallback();
  }, [searchParams, navigate, setUser]);

  return (
    <div className="callback-container">
      <h2>Connecting to Spotify...</h2>
      <p>Please wait while we complete the connection.</p>
    </div>
  );
};

export default SpotifyCallback;