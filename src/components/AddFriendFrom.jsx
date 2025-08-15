import React, { useEffect, useState, useRef } from "react";
import FriendCard from "./FriendCard";
import { API_URL } from "../shared.js";
import axios from "axios";

export default function AddFriendForm({ onClose, onFollowChange }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const mounted = useRef(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(
        `${API_URL}/api/follow/all-with-follow-status`,
        { withCredentials: true }
      );
      if (mounted.current) setUsers(res.data);
    } catch (e) {
      console.error(e);
      if (mounted.current) setError("Could not load users.");
    } finally {
      if (mounted.current) setLoading(false);
    }
  };

  useEffect(() => {
    mounted.current = true;
    fetchUsers();
    return () => {
      mounted.current = false;
    };
  }, []);

  const handleToggleFollow = async (username) => {
    try {
      await axios.post(
        `${API_URL}/api/profile/${username}/follow`,
        {},
        { withCredentials: true }
      );
      fetchUsers();
      if (onFollowChange) onFollowChange();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.45)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "20px",
          width: "420px",
          maxWidth: "90%",
          boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "1.25rem" }}>Add Friend</h2>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              fontSize: "1.2rem",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        <div
          style={{
            flex: 1,
            minHeight: "180px",
            border: "1px dashed #bbb",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            padding: "10px",
            overflowY: "auto",
          }}
        >
          {loading && (
            <div
              style={{
                textAlign: "center",
                color: "#777",
                fontStyle: "italic",
              }}
            >
              Loading…
            </div>
          )}
          {error && <div style={{ color: "#b00" }}>{error}</div>}
          {!loading && !error && users.length === 0 && (
            <div
              style={{
                textAlign: "center",
                color: "#777",
                fontStyle: "italic",
              }}
            >
              No users found
            </div>
          )}
          {!loading && !error && users.length > 0 && (
            <>
              {users.map((u) => (
                <FriendCard
                  key={u.id}
                  user={u}
                  isFollowing={u.isFollowing}
                  isMe={false}
                  busy={false}
                  onToggleFollow={() => handleToggleFollow(u.username)}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
