import React from "react";
import axios from "axios";
import { API_URL } from "../shared";
import { useNavigate } from "react-router-dom";

const getProfileImage = (profile) => {
  return (
    profile?.profileImage ||
    profile?.spotifyProfileImage ||
    profile?.avatarURL ||
    "/default-avatar.png"
  );
};

const FriendCard = ({
  user,
  isFollowing,
  isMe,
  busy,
  onToggleFollow,
  isOnline,
}) => {
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    if (e.target.tagName === "BUTTON") return;
    navigate(`/profile/${user.username}`);
  };

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
        cursor: "pointer",
      }}
      onClick={handleCardClick}
    >
      <div style={{ position: "relative" }}>
        <img
          src={getProfileImage(user)}
          alt={user.username}
          width={40}
          height={40}
          style={{
            borderRadius: "50%",
            objectFit: "cover",
            outline: isOnline ? "2px solid #27c93f" : "2px solid transparent",
          }}
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
        <span
          aria-label={isOnline ? "online" : "offline"}
          title={isOnline ? "Online" : "Offline"}
          style={{
            position: "absolute",
            right: -2,
            bottom: -2,
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: isOnline ? "#27c93f" : "#a3a3a3",
            boxShadow: "0 0 0 2px #fff",
          }}
        />
      </div>
      <div style={{ flex: 1 }}>
        <strong>@{user.username}</strong>
        <div style={{ fontSize: 14, opacity: 0.8 }}>
          {[user.firstName, user.lastName].filter(Boolean).join(" ")}
        </div>
      </div>
      {!isMe && (
        <button
          disabled={busy}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFollow(user.username);
          }}
        >
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