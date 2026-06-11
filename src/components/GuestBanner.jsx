import React, { useState } from "react";
import "../style/GuestBanner.css";

// Persistent floating notice shown while browsing as a guest. Collapses to a
// small pill so it's always present without blocking the page.
const GuestBanner = ({ onSignUp, onExit }) => {
  const [minimized, setMinimized] = useState(false);

  if (minimized) {
    return (
      <button
        className="guest-pill"
        onClick={() => setMinimized(false)}
        aria-label="Guest mode — expand"
      >
        👀 Guest mode
      </button>
    );
  }

  return (
    <div className="guest-island" role="status">
      <button
        className="guest-island-min"
        onClick={() => setMinimized(true)}
        aria-label="Minimize"
        title="Minimize"
      >
        –
      </button>
      <div className="guest-island-emoji">👀</div>
      <div className="guest-island-title">You're browsing as a guest</div>
      <div className="guest-island-text">
        Create an account to access all features — post, message, follow, and
        connect your Spotify.
      </div>
      <button className="guest-island-cta" onClick={onSignUp}>
        Create an account
      </button>
      <button className="guest-island-exit" onClick={onExit}>
        Exit guest mode
      </button>
    </div>
  );
};

export default GuestBanner;
