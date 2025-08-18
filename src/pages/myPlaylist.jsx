import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../shared";
import { useNavigate } from "react-router-dom";
import "../style/MyPlaylist.css";
import MiniDrawer from "../components/MiniDrawer";
import SpotifyEmbed from "../components/SpotifyEmbed";

const MyPlaylist = ({ user }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchPlaylists();
  }, [user, navigate]);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${API_URL}/auth/spotify/playlists`, {
        withCredentials: true,
      });

      setPlaylists(response.data.items || []);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/auth");
        return;
      }
      setError(
        "Failed to load playlists. Please make sure Spotify is connected."
      );
      console.error("Error fetching playlists:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSpotifyPlaylistId = (playlist) => {
    if (playlist.uri) {
      return playlist.uri.split(":")[2];
    }
    if (playlist.external_urls?.spotify) {
      const url = playlist.external_urls.spotify;
      const match = url.match(/playlist\/([a-zA-Z0-9]+)/);
      return match ? match[1] : null;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <MiniDrawer />
        <div className="dashboard-main-content">
          <div className="my-playlist-container">
            <div className="loading">Loading your playlists...</div>
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
          <div className="my-playlist-container">
            <div className="auth-required">
              <h2>Authentication Required</h2>
              <p>Please log in to view your playlists.</p>
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
              <div className="playlists-embed-list">
                {playlists.map((playlist, index) => {
                  const playlistId = getSpotifyPlaylistId(playlist);

                  return (
                    <div key={playlist.id} className="playlist-embed-item">
                      <div className="playlist-number">{index + 1}</div>
                      {playlistId ? (
                        <SpotifyEmbed
                          type="playlist"
                          id={playlistId}
                          width="100%"
                          height="352"
                        />
                      ) : (
                        <div className="embed-fallback">
                          <div className="fallback-content">
                            <h4>{playlist.name}</h4>
                            <p>
                              {playlist.description ||
                                "No description available"}
                            </p>
                            <p className="track-count">
                              {playlist.tracks.total} tracks
                            </p>
                            <p className="owner">
                              By: {playlist.owner.display_name}
                            </p>
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
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="no-data">
                <h3>No Playlists Found</h3>
                <p>You don't have any playlists yet.</p>
                <p>Create some playlists on Spotify and they'll appear here!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPlaylist;
