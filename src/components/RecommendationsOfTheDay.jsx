import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../shared";
import SpotifyEmbed from "./SpotifyEmbed";
import "../style/RecommendedSongs.css";

const RecommendationsOfTheDay = () => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_URL}/auth/spotify/ai-recommendations`, { withCredentials: true })
      .then((res) => {
        setTracks(res.data.tracks || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch recommendations");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading recommendations...</div>;
  if (error) return <div>{error}</div>;
  if (!tracks.length) return <div>No recommendations found.</div>;

  return (
    <div className="recommendations-day-container" style={{ maxHeight: '480px', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      <h3>Recommendations of the Day</h3>
      <div className="recommendations-day-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
        {tracks.map((track) => (
          <div className="recommendation-embed" key={track.id || track.uri}>
            <SpotifyEmbed type="track" id={track.id} width="100%" height={80} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationsOfTheDay;
