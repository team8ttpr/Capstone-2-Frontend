import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../shared";
import "../style/DemoBanner.css";

// Shown on dashboard sections when the logged-in user has no Spotify connection.
// Makes it explicit that the numbers are sample data, and offers a one-click
// path to start the Spotify connection flow.
const DemoBanner = ({ feature = "stats" }) => {
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const res = await axios.get(`${API_URL}/auth/spotify/login-url`);
      window.location.href = res.data.authUrl;
    } catch (e) {
      setConnecting(false);
    }
  };

  return (
    <div className="demo-banner" role="status">
      <span className="demo-banner-badge">Sample data</span>
      <span className="demo-banner-text">
        You're seeing example {feature} because your account isn't connected to
        Spotify. Connect Spotify to see your real data.
      </span>
      <button
        className="demo-banner-btn"
        onClick={handleConnect}
        disabled={connecting}
      >
        {connecting ? "Redirecting…" : "Connect Spotify"}
      </button>
    </div>
  );
};

export default DemoBanner;
