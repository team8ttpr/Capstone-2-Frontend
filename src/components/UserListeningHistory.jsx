import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../shared";
import UserListeningHistoryEmbeds from "./UserListeningHistoryEmbeds";
import '../style/UserListeningHistory.css';

const UserListeningHistory = () => {
  const [recentTracks, setRecentTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_URL}/auth/spotify/history`, { withCredentials: true })
      .then((res) => {
        setRecentTracks(res.data.recentTracks || []);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          setError("Session expired. Please log in again.");
        } else {
          setError("Failed to fetch listening history");
        }
        setLoading(false);
      });
  }, []);

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const played = new Date(dateString);
    const diffMs = now - played;
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return `${diffSec} seconds ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} minutes ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr} hours ago`;
    const diffDay = Math.floor(diffHr / 24);
    return `${diffDay} days ago`;
  };

  if (loading) return <div>Loading listening history...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <div
        className="user-listening-history-greeting"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? "▶" : "▼"} Your Recent Listening History
      </div>
      {!collapsed && (
        <UserListeningHistoryEmbeds
          recentTracks={recentTracks.map((item) => ({
            ...item,
            timeAgo: getTimeAgo(item.track.played_at),
          }))}
        />
      )}
    </div>
  );
};

export default UserListeningHistory;
