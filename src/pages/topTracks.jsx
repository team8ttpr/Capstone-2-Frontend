import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../shared";
import { useNavigate } from "react-router-dom";
import "../style/TopTracks.css";

const TopTracks = ({ user }) => {
  const [topTracks, setTopTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('medium_term');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchTopTracks();
  }, [user, navigate, timeRange]);

  const fetchTopTracks = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get(`${API_URL}/auth/spotify/top-tracks`, {
        params: { time_range: timeRange },
        withCredentials: true,
      });
      
      setTopTracks(response.data.items || []);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/auth");
        return;
      }
      setError('Failed to load top tracks. Please make sure Spotify is connected.');
      console.error('Error fetching top tracks:', error);
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
      <div className="top-tracks-container">
        <div className="loading">Loading your top tracks...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="top-tracks-container">
        <h2>Authentication Required</h2>
        <p>Please log in to view your top tracks.</p>
      </div>
    );
  }

  return (
    <div className="top-tracks-container">
      <div className="header-section">
        <h1>Your Top Tracks</h1>
        <p>Your most played songs, {user.username}!</p>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchTopTracks} className="retry-btn">
            Try Again
          </button>
        </div>
      )}

      {/* Temporary Spotify Embed */}
      <div className="spotify-embed-section" style={{ marginBottom: '2rem' }}>
        <h2>Featured Playlist</h2>
        <iframe 
          style={{borderRadius:'12px'}} 
          src="https://open.spotify.com/embed/playlist/64xHocJM0ddYO7643niAm8?utm_source=generator" 
          width="100%" 
          height="352" 
          frameBorder="0" 
          allowFullScreen="" 
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
          loading="lazy">
        </iframe>
      </div>

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

      <div className="tracks-section">
        {topTracks.length > 0 ? (
          <div className="tracks-list">
            {topTracks.map((track, index) => (
              <div key={track.id} className="track-item">
                <span className="track-number">{index + 1}</span>
                
                {track.album?.images?.[0] && (
                  <div className="track-image">
                    <img 
                      src={track.album.images[0].url} 
                      alt={track.album.name}
                      width="60"
                      height="60"
                    />
                  </div>
                )}
                
                <div className="track-info">
                  <h3 className="track-name">{track.name}</h3>
                  <p className="track-artist">
                    {track.artists.map(artist => artist.name).join(', ')}
                  </p>
                  <p className="track-album">{track.album.name}</p>
                </div>
                
                <div className="track-popularity">
                  <span>Popularity: {track.popularity}%</span>
                  <div className="popularity-bar">
                    <div 
                      className="popularity-fill" 
                      style={{ width: `${track.popularity}%` }}
                    ></div>
                  </div>
                </div>

                {track.preview_url && (
                  <div className="track-preview">
                    <audio controls style={{ width: '200px' }}>
                      <source src={track.preview_url} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}

                {track.external_urls?.spotify && (
                  <a 
                    href={track.external_urls.spotify} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="spotify-link"
                  >
                    Open in Spotify
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="no-data">
            <h3>No Top Tracks Found</h3>
            <p>You don't have enough listening history to show top tracks for this time period.</p>
            <p>Try selecting a different time range or listen to more music on Spotify!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopTracks;