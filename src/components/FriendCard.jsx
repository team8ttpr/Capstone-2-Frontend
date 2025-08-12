import React from "react";
import axios from "axios";
import { API_URL } from "../shared";

const FriendCard = ({ user, isFollowing, isMe, busy, onToggleFollow }) => {
  return (
    <div
      className="friend-card"
      style={{
        border: "1px solid #ccc",
        borderRadius: 8,
        padding: 12,
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 12,
      }}
    >
      <img
        src={user.spotifyProfileImage || user.avatarURL || user.profileImage}
        alt={user.username}
        width={40}
        height={40}
        style={{ borderRadius: "50%", objectFit: "cover" }}
        onError={(e) => (e.currentTarget.style.display = "none")}
      />
      <div style={{ flex: 1 }}>
        <strong>@{user.username}</strong>
        <div style={{ fontSize: 14, opacity: 0.8 }}>
          {[user.firstName, user.lastName].filter(Boolean).join(" ")}
        </div>
      </div>
      {!isMe && (
        <button disabled={busy} onClick={() => onToggleFollow(user.username)}>
          {isFollowing
            ? busy
              ? "Unfollowing..."
              : "Unfollow"
            : busy
            ? "Following..."
            : "Follow"}
        </button>
      )}
    </div>
  );
};

export default FriendCard;
