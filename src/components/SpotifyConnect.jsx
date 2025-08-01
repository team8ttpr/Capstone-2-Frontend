import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../shared";
import { useNavigate } from "react-router-dom";
import "../style/SpotifyComponents.css";

const SpotifyConnect = ({ user }) => {
  const [spotifyData, setSpotifyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [topTracks, setTopTracks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: '/spotify' } });
      return;
    }
    
    checkSpotifyConnection();
  }, [user, navigate]);

  const checkSpotifyConnection = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/spotify/profile`, {
        withCredentials: true,
      });
      setSpotifyData(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login", { state: { from: '/spotify' } });
        return;
      }
      setSpotifyData({ connected: false });
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
      navigate("/login", { state: { from: '/spotify' } });
    }
  }
};

  const getTopTracks = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/spotify/top-tracks`, {
        withCredentials: true,
      });
      setTopTracks(response.data.items);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login", { state: { from: '/spotify' } });
      }
    }
  };

  const disconnectSpotify = async () => {
    try {
      await axios.delete(`${API_URL}/auth/spotify/disconnect`, {
        withCredentials: true,
      });
      setSpotifyData({ connected: false });
      setTopTracks([]);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login", { state: { from: '/spotify' } });
      }
    }
  };

  if (loading) {
    return (
      <div className="spotify-container">
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="spotify-container">
        <h2>Authentication Required</h2>
        <p>Please log in to connect your Spotify account.</p>
      </div>
    );
  }

  return (
    <div className="spotify-container">
      <h2>Spotify Integration</h2>
      <p>Welcome, {user.username}!</p>

      {!spotifyData?.connected ? (
        <div>
          <p>Connect your Spotify account to see your music data!</p>
          <button onClick={connectSpotify} className="spotify-connect-btn">
            Connect Spotify
          </button>
        </div>
      ) : (
        <div>
          <div className="spotify-profile">
            <h3>Connected as: {spotifyData.profile?.display_name}</h3>
            {spotifyData.profile?.images?.[0] && (
              <img
                src={spotifyData.profile.images[0].url}
                alt="Profile"
                width="100"
              />
            )}
          </div>

          <div className="spotify-actions">
            <button onClick={getTopTracks} className="spotify-btn">
              Get Top Tracks
            </button>
            <button
              onClick={disconnectSpotify}
              className="spotify-btn disconnect"
            >
              Disconnect
            </button>
          </div>

          {topTracks.length > 0 && (
            <div className="top-tracks">
              <h3>Your Top Tracks</h3>
              {topTracks.map((track, index) => (
                <div key={track.id} className="track-item">
                  <span>{index + 1}. </span>
                  <strong>{track.name}</strong> by{" "}
                  {track.artists.map((a) => a.name).join(", ")}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SpotifyConnect;