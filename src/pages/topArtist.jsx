import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../shared';
import { useNavigate } from 'react-router-dom';
import '../style/TopArtist.css';
import MiniDrawer from '../components/MiniDrawer';

const TopArtist = ({ user }) => {
  const [topArtists, setTopArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('medium_term');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchTopArtists();
  }, [user, navigate, timeRange]);

  const fetchTopArtists = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get(`${API_URL}/auth/spotify/top-artists`, {
        params: { time_range: timeRange },
        withCredentials: true
      });

      setTopArtists(response.data.items || []);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/auth');
        return;
      }
      setError('Failed to load top artists. Please make sure Spotify is connected.');
      console.error('Error fetching top artists:', error);
    } finally {
      setLoading(false);
    }
  };

  const timeRangeLabels = {
    short_term: "Last 4 Weeks",
    medium_term: "Last 6 Months", 
    long_term: "All Time"
  };

  // Extract Spotify artist ID from the URI or external URL
  const getSpotifyArtistId = (artist) => {
    if (artist.uri) {
      return artist.uri.split(':')[2];
    }
    if (artist.external_urls?.spotify) {
      const url = artist.external_urls.spotify;
      const match = url.match(/artist\/([a-zA-Z0-9]+)/);
      return match ? match[1] : null;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
            <MiniDrawer />
      <div className="top-artist-container">
        <div className="loading">Loading your top artists...</div>
      </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="dashboard-layout">
            <MiniDrawer />
      <div className="top-artist-container">
        <div className="auth-required">
          <h2>Authentication Required</h2>
          <p>Please log in to view your top artists.</p>
        </div>
      </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
          <MiniDrawer />
    <div className="top-artist-container">
      <div className="header-section">
        <h1>Your Top Artists</h1>
        <p>Discover your most listened to artists, {user.username}!</p>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchTopArtists} className="retry-btn">
            Try Again
          </button>
        </div>
      )}

      <div className="time-range-selector">
        <h3>Time Period:</h3>
        <div className="time-range-buttons">
          {Object.entries(timeRangeLabels).map(([value, label]) => (
            <button
              key={value}
              className={`time-range-btn ${timeRange === value ? 'active' : ''}`}
              onClick={() => setTimeRange(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="artists-section">
        {topArtists.length > 0 ? (
          <div className="artists-embed-list">
            {topArtists.map((artist, index) => {
              const artistId = getSpotifyArtistId(artist);
              
              return (
                <div key={artist.id} className="artist-embed-item">
                  <div className="artist-rank">#{index + 1}</div>
                  {artistId ? (
                    <iframe
                      src={`https://open.spotify.com/embed/artist/${artistId}?utm_source=generator&theme=0`}
                      width="80%"
                      height="352"
                      frameBorder="0"
                      allowFullScreen=""
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                      title={`${artist.name}`}
                    />
                  ) : (
                    <div className="embed-fallback">
                      <div className="fallback-content">
                        <h4>{artist.name}</h4>
                        <div className="artist-genres">
                          {artist.genres.slice(0, 3).map((genre, idx) => (
                            <span key={idx} className="genre-tag">
                              {genre}
                            </span>
                          ))}
                        </div>
                        <p className="popularity">Popularity: {artist.popularity}%</p>
                        <p className="followers">{artist.followers.total.toLocaleString()} followers</p>
                        {artist.external_urls?.spotify && (
                          <a 
                            href={artist.external_urls.spotify} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="spotify-link"
                          >
                            Open in Spotify
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-data">
            <h3>No Top Artists Found</h3>
            <p>You don't have enough listening history to show top artists for this time period.</p>
            <p>Try selecting a different time range or listen to more music on Spotify!</p>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default TopArtist;