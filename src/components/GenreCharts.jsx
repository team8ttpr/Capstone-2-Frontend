import React from "react";
import { Pie, Bar } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import "../style/GenreCharts.css";

Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const GenreCharts = ({ topGenres, artistsByGenre, onChartClick, chartType = "pie", chartSize = 180 }) => {
  // pie chart data
  const pieData = {
    labels: topGenres.map((g) => g.genre),
    datasets: [
      {
        data: topGenres.map((g) => g.count),
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#C9CBCF",
        ],
      },
    ],
  };

  // bar chart data
  const barData = {
    labels: topGenres.map((g) => g.genre),
    datasets: [
      {
        label: "Genre Count",
        data: topGenres.map((g) => g.count),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  // call back for showing artists
  const pieOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const genre = context.label;
            const artists = artistsByGenre[genre]?.map((a) => a.name).join(", ") || "No artists";
            return [
              `Count: ${context.parsed}`,
              `Artists: ${artists}`,
            ];
          },
        },
      },
    },
    onClick: (evt, elements) => {
      if (elements.length > 0 && onChartClick) {
        const idx = elements[0].index;
        const genre = pieData.labels[idx];
        onChartClick(genre);
      }
    },
  };

  const barOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          title: function (context) {
            return context[0].label;
          },
          label: function (context) {
            const genre = context.label;
            const artists = artistsByGenre[genre]?.map((a) => a.name).join(", ") || "No artists";
            return [
              `Count: ${context.parsed.y}`,
              `Artists: ${artists}`,
            ];
          },
        },
      },
    },
    indexAxis: "y",
    onClick: (evt, elements) => {
      if (elements.length > 0 && onChartClick) {
        const idx = elements[0].index;
        const genre = barData.labels[idx];
        onChartClick(genre);
      }
    },
  };

  return (
    <>
      {chartType === "pie" && (
        <Pie data={pieData} options={pieOptions} width={chartSize} height={chartSize} />
      )}
      {chartType === "bar" && (
        <Bar data={barData} options={barOptions} width={chartSize} height={chartSize} />
      )}
    </>
  );
};

export default GenreCharts;
