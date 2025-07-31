import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../shared";
import { useNavigate } from "react-router-dom";

const SpotifyConnect = () => {
  const [spotifyData, setSpotifyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [topTracks, setTopTracks] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkUserAuth();
  }, []);

  useEffect(() => {
    checkSpotifyConnection();
  }, []);

  const checkUserAuth = async () => {
    try {
      const authResponse = await axios.get(`${API_URL}/auth/me`, {
        withCredentials: true,
      });

      if (!authResponse.data.user) {
        navigate("/login");
        return;
      }

      setUser(authResponse.data.user);
      await checkSpotifyConnection();
    } catch (error) {
      console.error("Auth check failed:", error);
      navigate("/login");
    }
  };

  const checkSpotifyConnection = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/spotify/profile`, {
        withCredentials: true,
      });
      setSpotifyData(response.data);
    } catch (error) {
      console.error("Error checking Spotify connection:", error);
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
      console.error("Error getting Spotify auth URL:", error);
    }
  };

  const getTopTracks = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/spotify/top-tracks`, {
        withCredentials: true,
      });
      setTopTracks(response.data.items);
    } catch (error) {
      console.error("Error getting top tracks:", error);
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
      console.error("Error disconnecting Spotify:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="spotify-container">
      <h2>Spotify Integration</h2>

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
