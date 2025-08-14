import React, { useEffect, useMemo, useState } from "react";
import FriendCard from "./FriendCard";
import { API_URL } from "../shared";

export default function AddFriendForm({ onClose }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");
        const authToken = localStorage.getItem("authToken"); 
        const res = await fetch(`${API_URL}/api/profile/all`, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`);
        }
        const data = await res.json();
        if (mounted) setUsers(data);
      } catch (e) {
        if (mounted) setError("Could not load users.");
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchUsers();
    return () => {
      mounted = false;
    };
  }, []);

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
                  isFollowing={false}
                  isMe={false}
                  busy={false}
                  onToggleFollow={() => {
                    console.log("Add friend:", u.id);
                  }}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
