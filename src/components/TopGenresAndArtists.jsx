import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../shared";
import GenreCharts from "./GenreCharts";
import GenreDetail from "./GenreDetail";
import { DEMO_TOP_GENRES, DEMO_ARTISTS_BY_GENRE } from "../demoData";
import { BlockSkeleton } from "./Skeletons";
import "../style/TopGenresAndArtists.css";

const TopGenresAndArtists = ({ demo = false }) => {
  const [topGenres, setTopGenres] = useState(demo ? DEMO_TOP_GENRES : []);
  const [artistsByGenre, setArtistsByGenre] = useState(demo ? DEMO_ARTISTS_BY_GENRE : {});
  const [loading, setLoading] = useState(!demo);
  const [error, setError] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [chartType, setChartType] = useState("pie");

  useEffect(() => {
    if (demo) {
      setTopGenres(DEMO_TOP_GENRES);
      setArtistsByGenre(DEMO_ARTISTS_BY_GENRE);
      setLoading(false);
      return;
    }
    axios
      .get(`${API_URL}/auth/spotify/history`, { withCredentials: true })
      .then((res) => {
        setTopGenres(res.data.topGenres || []);
        setArtistsByGenre(res.data.artistsByGenre || {});
        setLoading(false);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          setError("Session expired. Please log in again.");
          // Optionally, redirect to login page here
          // window.location.href = "/auth";
        } else {
          setError("Failed to fetch top genres and artists");
        }
        setLoading(false);
      });
  }, [demo]);

  const handleChartClick = (genre) => {
    setSelectedGenre(genre);
  };

  const handleCloseDetail = () => {
    setSelectedGenre(null);
  };

  const headingStyle = {
    fontSize: "2rem",
    fontWeight: 700,
    color: "#fff",
    marginBottom: "1.2rem",
    textShadow: "0 2px 12px rgba(0,0,0,0.18)",
    background: "linear-gradient(90deg, #1db954 0%, #14532d 100%)",
    borderRadius: "10px",
    padding: "0.75rem 1.2rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
  };

  if (loading) {
    return (
      <div style={{ flex: "0 0 340px", minWidth: 240, maxWidth: 340 }}>
        <h2 style={headingStyle}>Top Genres</h2>
        <BlockSkeleton width={340} height={340} />
      </div>
    );
  }
  if (error) return <div>{error}</div>;

  // Spotify has stopped returning the `genres` field on top artists for many
  // accounts, so there may be nothing to plot — show a clear message instead
  // of an empty chart.
  if (!topGenres.length) {
    return (
      <div style={{ flex: "0 0 340px", minWidth: 240, maxWidth: 340 }}>
        <h2 style={headingStyle}>Top Genres</h2>
        <div
          style={{
            background: "rgba(16,44,32,0.85)",
            borderRadius: 16,
            padding: "2rem 1.2rem",
            textAlign: "center",
            color: "#cbd5c5",
            minHeight: 300,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
          }}
        >
          <div style={{ fontSize: "2.5rem" }}>🎧</div>
          <p>Spotify didn't return genre data for your top artists right now.</p>
          <p style={{ fontSize: "0.85rem", opacity: 0.7 }}>
            Listen to more music and check back later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "flex-start", position: "relative" }}>
      <div style={{ flex: "0 0 340px", minWidth: 240, maxWidth: 340 }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#fff', marginBottom: '1.2rem', textShadow: '0 2px 12px rgba(0,0,0,0.18)', background: 'linear-gradient(90deg, #1db954 0%, #14532d 100%)', borderRadius: '10px', padding: '0.75rem 1.2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}>Top Genres</h2>
        <div className="chart-type-selector">
          <button
            className={`chart-type-btn${chartType === "pie" ? " active" : ""}`}
            onClick={() => setChartType("pie")}
            type="button"
          >
            Pie Chart
          </button>
          <button
            className={`chart-type-btn${chartType === "bar" ? " active" : ""}`}
            onClick={() => setChartType("bar")}
            type="button"
          >
            Bar Chart
          </button>
        </div>
        <GenreCharts
          topGenres={topGenres}
          artistsByGenre={artistsByGenre}
          onChartClick={handleChartClick}
          chartType={chartType}
          chartSize={180}
        />
      </div>
      <GenreDetail
        genre={selectedGenre}
        artists={selectedGenre ? artistsByGenre[selectedGenre] || [] : []}
        onClose={handleCloseDetail}
      />
    </div>
  );
};

export default TopGenresAndArtists;
