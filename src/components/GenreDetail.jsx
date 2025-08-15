import React from "react";
import { Bar } from "react-chartjs-2";
import "../style/GenreDetail.css";

const GenreDetail = ({ genre, artists, onClose }) => {
  if (!genre) return null;

  const barData = {
    labels: artists.map((artist) => artist.name),
    datasets: [
      {
        label: "Popularity",
        data: artists.map((artist) => artist.popularity),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  const barOptions = {
    indexAxis: "y",
    scales: {
      x: {
        min: 0,
        max: 100,
        title: { display: true, text: "Popularity" },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `Popularity: ${context.parsed.x}`;
          },
        },
      },
    },
  };

  return (
    <div className="genre-detail-popup">
      <div className="genre-detail-content">
        <button className="genre-detail-close" onClick={onClose}>&times;</button>
        <h2>Artists for "{genre}"</h2>
        <Bar data={barData} options={barOptions} height={220} />
      </div>
    </div>
  );
};

export default GenreDetail;
