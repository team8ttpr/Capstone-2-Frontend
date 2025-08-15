import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../shared";
import GenreCharts from "./GenreCharts";
import GenreDetail from "./GenreDetail";
import "../style/TopGenresAndArtists.css";

const TopGenresAndArtists = () => {
  const [topGenres, setTopGenres] = useState([]);
  const [artistsByGenre, setArtistsByGenre] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [chartType, setChartType] = useState("pie");

  useEffect(() => {
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
  }, []);

  const handleChartClick = (genre) => {
    setSelectedGenre(genre);
  };

  const handleCloseDetail = () => {
    setSelectedGenre(null);
  };

  if (loading) return <div>Loading top genres and artists...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ display: "flex", alignItems: "flex-start", position: "relative" }}>
      <div style={{ flex: "0 0 340px", minWidth: 240, maxWidth: 340 }}>
        <h2>Top Genres</h2>
        <div className="chart-type-selector" style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
          <button
            className={`chart-type-btn${chartType === "pie" ? " active" : ""}`}
            onClick={() => setChartType("pie")}
            style={{
              padding: "6px 16px",
              borderRadius: "6px",
              border: chartType === "pie" ? "2px solid #36A2EB" : "1px solid #ccc",
              background: chartType === "pie" ? "#eaf6ff" : "#fff",
              fontWeight: chartType === "pie" ? "bold" : "normal",
              cursor: "pointer"
            }}
          >
            Pie Chart
          </button>
          <button
            className={`chart-type-btn${chartType === "bar" ? " active" : ""}`}
            onClick={() => setChartType("bar")}
            style={{
              padding: "6px 16px",
              borderRadius: "6px",
              border: chartType === "bar" ? "2px solid #36A2EB" : "1px solid #ccc",
              background: chartType === "bar" ? "#eaf6ff" : "#fff",
              fontWeight: chartType === "bar" ? "bold" : "normal",
              cursor: "pointer"
            }}
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
