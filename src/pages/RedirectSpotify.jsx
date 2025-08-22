// src/pages/RedirectSpotify.jsx
import React from "react";

export default function RedirectSpotify() {
  return (
    <div
      style={{
        padding: 24,
        color: "white",
        textAlign: "center",
      }}
    >
      <h2 style={{ fontSize: "3rem", marginBottom: "1rem" }}>Spotify needed</h2>
      <p style={{ fontSize: "1.5rem" }}>
        This section requires a Spotify-connected account.
      </p>
      <p style={{ fontSize: "1.5rem" }}>
        Go link Spotify in Settings or continue using the rest of the app.
      </p>
    </div>
  );
}
