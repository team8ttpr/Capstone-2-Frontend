import React, { useEffect, useState, useRef } from "react";
import FriendCard from "./FriendCard.jsx";
import { API_URL } from "../shared.js";
import axios from "axios";

export default function AddFriendForm({ onClose, onFollowChange }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const mounted = useRef(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(
        `${API_URL}/api/follow/all-with-follow-status`,
        { withCredentials: true }
      );
      if (mounted.current) setUsers(res.data || []);
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

      setUsers((prev) =>
        prev.map((u) =>
          u.username === username ? { ...u, isFollowing: !u.isFollowing } : u
        )
      );
      if (onFollowChange) onFollowChange();
    } catch (err) {
      console.error(err);
    }
  };

  const q = query.trim().toLowerCase();
  const filteredUsers = users.filter((u) => {
    const username = (u.username || "").toLowerCase();
    const first = (u.firstName || "").toLowerCase();
    const last = (u.lastName || "").toLowerCase();
    return q === ""
      ? true
      : username.includes(q) || first.includes(q) || last.includes(q);
  });

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(10,12,16,0.85)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#18181c",
          borderRadius: "14px",
          padding: "22px",
          width: "420px",
          maxWidth: "90vw",
          height: "520px",
          maxHeight: "90vh",
          boxShadow: "0 8px 30px rgba(0,0,0,0.45)",
          display: "flex",
          flexDirection: "column",
          border: "1.5px solid #232323",
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
          <h2 style={{ margin: 0, fontSize: "1.25rem", color: "#fff" }}>
            Add Friend
          </h2>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              fontSize: "1.2rem",
              cursor: "pointer",
              color: "#fff",
              opacity: 0.7,
              transition: "opacity 0.2s",
            }}
            onMouseOver={e => (e.currentTarget.style.opacity = 1)}
            onMouseOut={e => (e.currentTarget.style.opacity = 0.7)}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Search input */}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users by name or username…"
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: "8px",
            border: "1px solid #333",
            outline: "none",
            background: "#23232a",
            color: "#fff",
            marginBottom: 4,
          }}
        />

        <div
          style={{
            flex: 1,
            minHeight: "180px",
            border: "1px dashed #333",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            padding: "10px",
            overflowY: "auto",
            marginTop: "8px",
            background: "#202024",
          }}
        >
          {loading && (
            <div
              style={{
                textAlign: "center",
                color: "#aaa",
                fontStyle: "italic",
              }}
            >
              Loading…
            </div>
          )}
          {error && <div style={{ color: "#ff6b6b" }}>{error}</div>}
          {!loading && !error && filteredUsers.length === 0 && (
            <div
              style={{
                textAlign: "center",
                color: "#aaa",
                fontStyle: "italic",
              }}
            >
              No users found
            </div>
          )}
          {!loading && !error && filteredUsers.length > 0 && (
            <>
              {filteredUsers.map((u) => (
                <FriendCard
                  key={u.id}
                  user={u}
                  isFollowing={!!u.isFollowing}
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