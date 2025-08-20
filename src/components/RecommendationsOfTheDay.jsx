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
      .get(`${API_URL}/auth/spotify/ai-recommendations`, { withCredentials: true }) //add s
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

  if (loading) {
    return (
      <div className="recommendations-day-ipod" style={{ position: 'relative', zIndex: 1, width: '420px', minHeight: '400px', borderRadius: '32px', padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="recommendations-day-ipod-title">Recommendations of the Day</div>
        <div className="recommendations-day-ipod-subtitle">AI-powered</div>
        <div style={{ color: '#1db954', fontSize: '1.2rem', marginTop: '1rem', textAlign: 'center' }}>
          Waiting for Gemini to cook up some recommendations 🔥...
        </div>
      </div>
    );
  }
  if (error) return <div>{error}</div>;
  if (!tracks.length) return <div>No recommendations found.</div>;

  const currentTrack = tracks[currentIndex];

  return (
    <div className="recommendations-day-ipod" style={{ position: 'relative', zIndex: 1, width: '600px', minHeight: '400px', borderRadius: '32px', padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div className="recommendations-day-ipod-title">Recommendations of the Day</div>
      <div className="recommendations-day-ipod-subtitle">AI-powered</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <button onClick={handlePrev} className="arrow-btn" aria-label="Previous" style={{ marginRight: '1rem' }}>
          &#8592;
        </button>
        <div className="recommendations-day-ipod-screen" style={{ width: '500px', height: '400px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <SpotifyEmbed type="track" id={currentTrack.id} width="480" height={400} />
        </div>
        <button onClick={handleNext} className="arrow-btn" aria-label="Next" style={{ marginLeft: '1rem' }}>
          &#8594;
        </button>
      </div>
    </div>
  );
};

export default RecommendationsOfTheDay;
