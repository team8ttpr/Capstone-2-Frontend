import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../shared';
import { useNavigate } from 'react-router-dom';
import '../style/TopArtist.css';

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

  if (loading) {
    return (
      <div className="top-artist-container">
        <div className="loading">Loading your top artists...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="top-artist-container">
        <h2>Authentication Required</h2>
        <p>Please log in to view your top artists.</p>
      </div>
    );
  }

  return (
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
          <div className="artists-grid">
            {topArtists.map((artist, index) => (
              <div key={artist.id} className="artist-card">
                <div className="artist-rank">#{index + 1}</div>
                <div className="artist-image">
                  {artist.images?.[0] ? (
                    <img 
                      src={artist.images[0].url} 
                      alt={artist.name}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="artist-placeholder" style={{ display: artist.images?.[0] ? 'none' : 'flex' }}>
                    <span>♫</span>
                  </div>
                </div>
                <div className="artist-info">
                  <h3 className="artist-name">{artist.name}</h3>
                  <div className="artist-genres">
                    {artist.genres.slice(0, 3).map((genre, idx) => (
                      <span key={idx} className="genre-tag">
                        {genre}
                      </span>
                    ))}
                  </div>
                  <div className="artist-meta">
                    <span className="popularity">
                      Popularity: {artist.popularity}%
                    </span>
                    <span className="followers">
                      {artist.followers.total.toLocaleString()} followers
                    </span>
                  </div>
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
            ))}
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
  );
};

export default TopArtist;