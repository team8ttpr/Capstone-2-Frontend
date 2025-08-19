import React from "react";
import { Button, CircularProgress } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
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
        background: "rgba(24, 24, 28, 0.95)",
        borderRadius: 12,
        padding: 16,
        display: "flex",
        alignItems: "center",
        gap: 16,
        marginBottom: 16,
        cursor: "pointer",
        boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
        border: "1px solid #232323",
        transition: "background 0.2s, box-shadow 0.2s",
      }}
      onClick={handleCardClick}
    >
      <div style={{ position: "relative" }}>
        <img
          src={getProfileImage(user)}
          alt={user.username}
          width={44}
          height={44}
          style={{
            borderRadius: "50%",
            objectFit: "cover",
            outline: isOnline ? "2px solid #27c93f" : "2px solid #444",
            background: "#18181c",
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
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: isOnline ? "#27c93f" : "#a3a3a3",
            boxShadow: "0 0 0 2px #18181c",
            border: "1.5px solid #232323",
          }}
        />
      </div>
      <div style={{ flex: 1 }}>
        <strong style={{ color: "#fff" }}>@{user.username}</strong>
        <div style={{ fontSize: 14, opacity: 0.8, color: "#bdbdbd" }}>
          {[user.firstName, user.lastName].filter(Boolean).join(" ")}
        </div>
      </div>
      {!isMe && (
        <Button
          variant={isFollowing ? "outlined" : "contained"}
          color={isFollowing ? "secondary" : "primary"}
          size="small"
          startIcon={
            busy ? (
              <CircularProgress size={18} color="inherit" />
            ) : isFollowing ? (
              <PersonRemoveIcon />
            ) : (
              <PersonAddIcon />
            )
          }
          disabled={busy}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFollow(user.username);
          }}
          sx={{
            minWidth: 110,
            fontWeight: 500,
            color: isFollowing ? "#fff" : undefined,
            borderColor: "#444",
            background: isFollowing ? "rgba(36,36,36,0.7)" : undefined,
          }}
        >
          {isFollowing
            ? busy
              ? "Unfollowing..."
              : "Unfollow"
            : busy
            ? "Following..."
            : "Follow"}
        </Button>
      )}
    </div>
  );
};

export default FriendCard;