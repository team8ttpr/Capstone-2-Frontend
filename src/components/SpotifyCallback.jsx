import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../shared";

const SpotifyCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("processing");

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const error = searchParams.get("error");

      if (error) {
        setStatus("error");
        setTimeout(() => navigate("/"), 3000);
        return;
      }

      if (!code) {
        setStatus("error");
        setTimeout(() => navigate("/"), 3000);
        return;
      }

      try {
        await axios.post(
          `${API_URL}/auth/spotify/callback`,
          { code, state },
          { withCredentials: true }
        );
        setStatus("success");
        setTimeout(() => navigate("/"), 2000);
      } catch (error) {
        console.error("Spotify callback error:", error);
        setStatus("error");
        setTimeout(() => navigate("/"), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="callback-container">
      {status === "processing" && <div>Connecting to Spotify...</div>}
      {status === "success" && <div>✅ Spotify connected successfully! Redirecting...</div>}
      {status === "error" && <div>❌ Failed to connect Spotify. Redirecting...</div>}
    </div>
  );
};

export default SpotifyCallback;