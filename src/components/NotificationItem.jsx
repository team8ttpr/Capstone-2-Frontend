import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../style/NotificationItem.css";

const avatar = (profile) => {
  return (
    profile?.profileImage ||
    profile?.spotifyProfileImage ||
    profile?.avatarURL ||
    "/default-avatar.png"
  );
};


function timeAgo(date) {
  const now = new Date();
  const diff = Math.floor((now - date) / 1000); // seconds
  if (diff < 60) return `${diff} sec ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) === 1 ? '' : 's'} ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) === 1 ? '' : 's'} ago`;
  if (diff < 2592000) return `${Math.floor(diff / 604800)} week${Math.floor(diff / 604800) === 1 ? '' : 's'} ago`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)} month${Math.floor(diff / 2592000) === 1 ? '' : 's'} ago`;
  return `${Math.floor(diff / 31536000)} year${Math.floor(diff / 31536000) === 1 ? '' : 's'} ago`;
}

const NotificationItem = ({ n, onClick, fading, showRelativeTime }) => {
  const [localFading, setLocalFading] = useState(false);

  const actorName =
    n.actor?.spotifyDisplayName || n.actor?.username || "someone";
  const actorUsername = n.actor?.username || "";

  const time = showRelativeTime
    ? timeAgo(new Date(n.createdAt))
    : new Date(n.createdAt).toLocaleString();

  let body = null;
  if (n.type === "new_follower") {
    body = (
      <span>
        <Link
          to={`/profile/${actorUsername}`}
          style={{ color: "#fff", fontWeight: 700, textDecoration: "none" }}
        >
          {actorName}
        </Link>{" "}
        followed you
      </span>
    );
  } else if (n.type === "post_liked") {
    body = (
      <span>
        <Link
          to={`/profile/${actorUsername}`}
          style={{ color: "#fff", fontWeight: 700, textDecoration: "none" }}
        >
          {actorName}
        </Link>{" "}
        liked your{" "}
        {n.postId ? <Link to={`/post/${n.postId}`}>post</Link> : "post"}
      </span>
    );
  } else if (n.type === "comment") {
    body = (
      <span>
        <Link
          to={`/profile/${actorUsername}`}
          style={{ color: "#fff", fontWeight: 700, textDecoration: "none" }}
        >
          {actorName}
        </Link>{" "}
        commented on your{" "}
        {n.postId ? <Link to={`/post/${n.postId}`}>post</Link> : "post"}:{" "}
        <em>{n.content}</em>
      </span>
    );
  } else if (n.type === "message") {
    body = (
      <span>
        <Link
          to={`/profile/${actorUsername}`}
          style={{ color: "#fff", fontWeight: 700, textDecoration: "none" }}
        >
          {actorName}
        </Link>{" "}
        sent you a <Link to={`/social/messages`}>message</Link>
      </span>
    );
  } else if (n.type === "repost") {
    body = (
      <span>
        <Link
          to={`/profile/${actorUsername}`}
          style={{ color: "#fff", fontWeight: 700, textDecoration: "none" }}
        >
          {actorName}
        </Link>{" "}
        reposted your{" "}
        {n.postId ? <Link to={`/post/${n.postId}`}>post</Link> : "post"}
      </span>
    );
  }

  // Handle fade out and then call onClick (dismiss)
  const handleDismiss = () => {
    setLocalFading(true);
  };

  useEffect(() => {
    if (localFading) {
      const timer = setTimeout(() => {
        onClick?.(n);
      }, 500); // 500ms fade duration
      return () => clearTimeout(timer);
    }
  }, [localFading, n, onClick]);

  return (
    <div
      className={`notif-card ${n.seen ? "" : "notif-unread"}${
        localFading || fading ? " notif-fade" : ""
      }`}
      tabIndex={0}
    >
      <div className="notif-avatar-wrap">
        <Link to={`/profile/${actorUsername}`}>
          <img
            className="notif-avatar"
            src={avatar(n.actor)}
            alt={`${actorName} avatar`}
            style={{ cursor: "pointer" }}
          />
        </Link>
      </div>
      <div className="notif-main">
        <div className="notif-text">{body}</div>
        <div className="notif-meta">
          <span className="notif-time">{time}</span>
          {!n.seen && <span className="notif-dot" aria-label="unread" />}
        </div>
      </div>
      <button
        className="notif-dismiss-btn"
        onClick={handleDismiss}
        aria-label="Dismiss notification"
        tabIndex={0}
        style={{
          marginLeft: 16,
          background: "none",
          border: "none",
          color: "#bdbdbd",
          fontSize: 22,
          cursor: "pointer",
          borderRadius: "50%",
          transition: "background 0.2s, color 0.2s",
        }}
        onMouseOver={(e) => (e.currentTarget.style.color = "#fff")}
        onMouseOut={(e) => (e.currentTarget.style.color = "#bdbdbd")}
      >
        &times;
      </button>
    </div>
  );
};

export default NotificationItem;
