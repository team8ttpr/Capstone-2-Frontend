import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../shared";
import { useNavigate } from "react-router-dom";
import "../style/SpotifyComponents.css";

const TopTracks = ({ user }) => {
  const [topTracks, setTopTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentTimeRange, setCurrentTimeRange] = useState("short_term");
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    checkSpotifyAndLoadTracks();
  }, [user, navigate]);

  const checkSpotifyAndLoadTracks = async () => {
    try {
      setLoading(true);
      setError("");

      // Check if Spotify is connected
      const profileResponse = await axios.get(`${API_URL}/auth/spotify/profile`, {
        withCredentials: true,
      });

      if (profileResponse.data.connected) {
        setSpotifyConnected(true);
        await loadTopTracks("short_term");
      } else {
        setSpotifyConnected(false);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login");
        return;
      }
      setError("Failed to check Spotify connection");
      setSpotifyConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const loadTopTracks = async (timeRange) => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${API_URL}/auth/spotify/top-tracks?time_range=${timeRange}`, {
        withCredentials: true,
      });

      setTopTracks(response.data.items || []);
      setCurrentTimeRange(timeRange);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login");
        return;
      }
      setError("Failed to load top tracks");
      setTopTracks([]);
    } finally {
      setLoading(false);
    }
  };

  const connectSpotify = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/spotify/auth-url`, {
        withCredentials: true,
      });
      window.location.href = response.data.authUrl;
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login");
      } else {
        setError("Failed to connect to Spotify");
      }
    }
  };

  const getTimeRangeLabel = (timeRange) => {
    switch(timeRange) {
      case "short_term": return "Last 4 Weeks";
      case "medium_term": return "Last 6 Months";
      case "long_term": return "All Time";
      default: return "";
    }
  };

  if (!user) {
    return (
      <div className="spotify-container">
        <h2>Please log in to view your top tracks</h2>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="spotify-container">
        <h2>Your Top Tracks</h2>
        <div>Loading...</div>
      </div>
    );
  }

  if (!spotifyConnected) {
    return (
      <div className="spotify-container">
        <h2>Your Top Tracks</h2>
        <p>Connect your Spotify account to see your top tracks!</p>
        <button onClick={connectSpotify} className="spotify-connect-btn">
          Connect Spotify
        </button>
      </div>
    );
  }

  return (
    <div className="spotify-container">
      <h2>Your Top Tracks</h2>
      
      {error && (
        <div className="error-message" style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '0.75rem',
          borderRadius: '4px',
          margin: '1rem 0',
          border: '1px solid #f5c6cb'
        }}>
          {error}
        </div>
      )}

      <div className="time-range-buttons">
        <button 
          onClick={() => loadTopTracks("short_term")} 
          className={`spotify-btn ${currentTimeRange === "short_term" ? "active" : ""}`}
        >
          Last 4 Weeks
        </button>
        <button 
          onClick={() => loadTopTracks("medium_term")} 
          className={`spotify-btn ${currentTimeRange === "medium_term" ? "active" : ""}`}
        >
          Last 6 Months
        </button>
        <button 
          onClick={() => loadTopTracks("long_term")} 
          className={`spotify-btn ${currentTimeRange === "long_term" ? "active" : ""}`}
        >
          All Time
        </button>
      </div>

      {topTracks.length > 0 ? (
        <div className="top-tracks">
          <h3>Your Top Tracks - {getTimeRangeLabel(currentTimeRange)}</h3>
          <div className="tracks-list">
            {topTracks.map((track, index) => (
              <div key={track.id} className="track-item-detailed">
                <div className="track-number">{index + 1}</div>
                <div className="track-image">
                  {track.album?.images?.[2] && (
                    <img 
                      src={track.album.images[2].url} 
                      alt={track.album.name}
                      width="64"
                      height="64"
                    />
                  )}
                </div>
                <div className="track-info">
                  <div className="track-name">{track.name}</div>
                  <div className="track-artist">
                    {track.artists.map((artist) => artist.name).join(", ")}
                  </div>
                  <div className="track-album">{track.album.name}</div>
                </div>
                <div className="track-popularity">
                  <div className="popularity-bar">
                    <div 
                      className="popularity-fill" 
                      style={{ width: `${track.popularity}%` }}
                    ></div>
                  </div>
                  <span className="popularity-text">{track.popularity}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="no-tracks">
          <p>No top tracks found for {getTimeRangeLabel(currentTimeRange).toLowerCase()}.</p>
          <p>Try a different time range or listen to more music on Spotify!</p>
        </div>
      )}
    </div>
  );
};

export default TopTracks;