import React, { useState, useEffect } from "react";
import FriendCard from "./FriendCard";
import axios from "axios";
import { API_URL } from "../shared";

export default function UserListModal({
  open,
  onClose,
  users: initialUsers,
  title,
  onFollowChange,
}) {
  const [users, setUsers] = useState(initialUsers || []);

  useEffect(() => {
    if (open) setUsers(initialUsers || []);
  }, [open]);

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

  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.45)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#18181c",
          borderRadius: 18,
          padding: 28,
          width: 580,
          maxHeight: 480,
          overflowY: "auto",
          boxShadow: "0 8px 30px rgba(0,0,0,0.45)",
          border: "2px solid #145c2c",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ marginTop: 0, color: "#fff", fontWeight: 700, marginBottom: 18 }}>{title}</h2>
        {users && users.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {users.map((u) => (
              <FriendCard
                key={u.id}
                user={u}
                isFollowing={u.isFollowing}
                isMe={false}
                busy={false}
                onToggleFollow={handleToggleFollow}
              />
            ))}
          </div>
        ) : (
          <div style={{ color: "#bbb", fontStyle: "italic" }}>
            No users found.
          </div>
        )}
        <button
          style={{
            marginTop: 16,
            padding: "8px 24px",
            borderRadius: 8,
            border: "2px solid #145c2c",
            background: "#23232a",
            color: "#1db954",
            fontWeight: 600,
            fontSize: "1rem",
            cursor: "pointer",
            alignSelf: "flex-start",
            transition: "background 0.2s, color 0.2s, border 0.2s",
          }}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}