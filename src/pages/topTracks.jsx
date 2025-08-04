import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../shared';
import { useNavigate } from 'react-router-dom';
import '../style/TopTracks.css';

const TopTracks = ({ user }) => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchTopTracks();
  }, [user, navigate]);

  const fetchTopTracks = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/spotify/top-tracks`, {
        withCredentials: true,
      });
      setTracks(response.data.items || []);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/auth');
      }
      console.error('Error fetching top tracks:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading your top tracks...</div>;
  }

  return (
    <div className="top-tracks-container">
      <h1>Your Top Tracks</h1>
      
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

      {/* Your Top Tracks */}
      <div className="user-tracks-section">
        <h2>Your Personal Top Tracks</h2>
        {tracks.length > 0 ? (
          <div className="tracks-list">
            {tracks.map((track, index) => (
              <div key={track.id} className="track-item">
                <span className="track-number">{index + 1}</span>
                <div className="track-info">
                  <strong className="track-name">{track.name}</strong>
                  <p className="track-artist">
                    {track.artists.map(artist => artist.name).join(', ')}
                  </p>
                  <p className="track-album">{track.album.name}</p>
                </div>
                {track.preview_url && (
                  <audio controls style={{ width: '200px' }}>
                    <source src={track.preview_url} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="no-tracks">
            <p>No top tracks data available</p>
            <p>This could be because:</p>
            <ul>
              <li>Your account is new and doesn't have enough listening history</li>
              <li>You haven't listened to enough music recently</li>
              <li>Your Spotify app is in development mode</li>
            </ul>
            <p>Try listening to some music on Spotify and check back later!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopTracks;