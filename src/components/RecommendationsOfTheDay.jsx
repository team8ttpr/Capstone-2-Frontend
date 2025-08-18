import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../shared";
import SpotifyEmbed from "./SpotifyEmbed";
import "../style/RecommendationsOfTheDay.css";

const RecommendationsOfTheDay = () => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? tracks.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === tracks.length - 1 ? 0 : prev + 1));
  };

  if (loading) return <div>Loading recommendations...</div>;
  if (error) return <div>{error}</div>;
  if (!tracks.length) return <div>No recommendations found.</div>;

  const currentTrack = tracks[currentIndex];

  return (
    <>
      <h3>Recommendations of the Day</h3>
      <h5>AI-powered</h5>
      <div className="recommendations-day-list" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <button onClick={handlePrev} className="arrow-btn" aria-label="Previous" style={{ marginRight: '1rem' }}>
          &#8592;
        </button>
        <div className="recommendation-embed">
          <SpotifyEmbed type="track" id={currentTrack.id} width="400" height={400} />
        </div>
        <button onClick={handleNext} className="arrow-btn" aria-label="Next" style={{ marginLeft: '1rem' }}>
          &#8594;
        </button>
      </div>
    </>
  );
};

export default RecommendationsOfTheDay;
