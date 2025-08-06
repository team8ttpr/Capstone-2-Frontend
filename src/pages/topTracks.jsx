import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../shared";
import { useNavigate } from "react-router-dom";
import "../style/TopTracks.css";
import MiniDrawer from "../components/MiniDrawer";
import SearchComponent from "../components/SearchComponent";
import SpotifyEmbed from "../components/SpotifyEmbed";

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

  const getSpotifyTrackId = (track) => {
    if (track.uri) {
      return track.uri.split(':')[2];
    }
    if (track.external_urls?.spotify) {
      const url = track.external_urls.spotify;
      const match = url.match(/track\/([a-zA-Z0-9]+)/);
      return match ? match[1] : null;
    }
    return null;
  };

  const handleResultSelect = (result) => {
    console.log('Selected:', result);
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <MiniDrawer />
        <div className="dashboard-main-content">
          <div className="top-tracks-container">
            <div className="loading">Loading your top tracks...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="dashboard-layout">
        <MiniDrawer />
        <div className="dashboard-main-content">
          <div className="top-tracks-container">
            <div className="auth-required">
              <h2>Authentication Required</h2>
              <p>Please log in to view your top tracks.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <MiniDrawer />
      <div className="dashboard-main-content">
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

          <SearchComponent 
            onResultSelect={handleResultSelect}
            placeholder="Search for songs, artists, albums, or playlists..."
          />

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
              <div className="tracks-embed-list">
                {topTracks.map((track, index) => {
                  const trackId = getSpotifyTrackId(track);
                  
                  return (
                    <div key={track.id} className="track-embed-item">
                      <div className="track-rank">#{index + 1}</div>
                      {trackId ? (
                        <SpotifyEmbed 
                          type="track" 
                          id={trackId} 
                          width="100%" 
                          height="152" 
                        />
                      ) : (
                        <div className="embed-fallback">
                          <div className="fallback-content">
                            <h4>{track.name}</h4>
                            <p>{track.artists.map(artist => artist.name).join(', ')}</p>
                            <p className="album-name">{track.album.name}</p>
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
                        </div>
                      )}
                    </div>
                  );
                })}
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
      </div>
    </div>
  );
};

export default TopTracks;