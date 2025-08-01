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
          navigate('/login?error=access_denied');
          return;
        }

        if (!code) {
          navigate('/login?error=no_code');
          return;
        }

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
          navigate('/?spotify_login=success');
          return;
        }

        const token = localStorage.getItem('authToken');
        
        if (!token) {
          navigate('/login?error=no_auth');
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
        navigate('/login?error=callback_failed');
      }
    };

    handleCallback();
  }, [searchParams, navigate, setUser]);

  return (
    <div>
      <h2>Connecting to Spotify...</h2>
      <p>Please wait while we complete the connection.</p>
    </div>
  );
};

export default SpotifyCallback;