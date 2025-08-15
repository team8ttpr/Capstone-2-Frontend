import React from "react";
import FriendCard from "./FriendCard";

export default function UserListModal({ open, onClose, users, title }) {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(0,0,0,0.45)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 24,
          width: 350,
          maxHeight: 400,
          overflowY: "auto",
          boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
        }}
        onClick={e => e.stopPropagation()}
      >
        <h2 style={{ marginTop: 0 }}>{title}</h2>
        {users && users.length > 0 ? (
          <div>
            {users.map(u => (
              <FriendCard
                key={u.id}
                user={u}
                isFollowing={u.isFollowing}
                isMe={false}
                busy={false}
                onToggleFollow={() => {}}
              />
            ))}
          </div>
        ) : (
          <div style={{ color: "#777", fontStyle: "italic" }}>No users found.</div>
        )}
        <button
          style={{
            marginTop: 16,
            padding: "6px 18px",
            borderRadius: 6,
            border: "1px solid #bbb",
            background: "#f5f5f5",
            cursor: "pointer"
          }}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}