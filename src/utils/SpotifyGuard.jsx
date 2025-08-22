// utils/SpotifyGuard.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function SpotifyGuard({
  user,
  spotifyConnected,
  spotifyCheckDone,
  children,
}) {
  if (!user) return <Navigate to="/auth" replace />;
  if (!spotifyCheckDone) return null; // wait for server check
  if (!spotifyConnected) return <Navigate to="/redirect-spotify" replace />;
  return children;
}
