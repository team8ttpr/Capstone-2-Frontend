import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../shared';
import { useNavigate } from 'react-router-dom';
import '../style/MyPlaylist.css';

const MyPlaylist = ({ user }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchPlaylists();
  }, [user, navigate]);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get(`${API_URL}/auth/spotify/playlists`, { 
        withCredentials: true 
      });

      setPlaylists(response.data.items || []);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/auth');
        return;
      }
      setError('Failed to load playlists. Please make sure Spotify is connected.');
      console.error('Error fetching playlists:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="my-playlist-container">
        <div className="loading">Loading your playlists...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="my-playlist-container">
        <h2>Authentication Required</h2>
        <p>Please log in to view your playlists.</p>
      </div>
    );
  }

  return (
    <div className="my-playlist-container">
      <div className="header-section">
        <h1>My Playlists</h1>
        <p>Your personal music collections, {user.username}!</p>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchPlaylists} className="retry-btn">
            Try Again
          </button>
        </div>
      )}

      <div className="playlists-section">
        {playlists.length > 0 ? (
          <div className="playlists-grid">
            {playlists.map((playlist) => (
              <div key={playlist.id} className="playlist-card">
                <div className="playlist-image">
                  {playlist.images?.[0] ? (
                    <img 
                      src={playlist.images[0].url} 
                      alt={playlist.name}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="playlist-placeholder" style={{ display: playlist.images?.[0] ? 'none' : 'flex' }}>
                    <span>♪</span>
                  </div>
                </div>
                <div className="playlist-info">
                  <h3 className="playlist-name">{playlist.name}</h3>
                  <p className="playlist-description">
                    {playlist.description || 'No description'}
                  </p>
                  <div className="playlist-meta">
                    <span className="track-count">{playlist.tracks.total} tracks</span>
                    <span className="owner">by {playlist.owner.display_name}</span>
                  </div>
                  {playlist.external_urls?.spotify && (
                    <a 
                      href={playlist.external_urls.spotify} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="spotify-link"
                    >
                      Open in Spotify
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-data">
            <h3>No Playlists Found</h3>
            <p>You don't have any playlists yet, or they couldn't be loaded.</p>
            <p>Try connecting your Spotify account or creating some playlists!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPlaylist;