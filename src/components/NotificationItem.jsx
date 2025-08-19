import React from "react";
import { Link } from "react-router-dom";
import "../style/NotificationItem.css";

const NotificationItem = ({ n, onClick }) => {
  const actorName =
    n.actor?.spotifyDisplayName || n.actor?.username || "someone";
  const avatar =
    n.actor?.spotifyProfileImage || // <-- correct casing
    n.actor?.profileImage || // nice fallback if you store a manual profile image
    n.actor?.avatarURL || // final fallback
    "/img/avatar-placeholder.png";
  const time = new Date(n.createdAt).toLocaleString();

  let body = null;
  if (n.type === "new_follower") {
    body = (
      <span>
        <strong>{actorName}</strong> followed you
      </span>
    );
  } else if (n.type === "post_liked") {
    body = (
      <span>
        <strong>{actorName}</strong> liked your{" "}
        {n.postId ? <Link to={`/post/${n.postId}`}>post</Link> : "post"}
      </span>
    );
  } else if (n.type === "comment") {
    body = (
      <span>
        <strong>{actorName}</strong> commented on your{" "}
        {n.postId ? <Link to={`/post/${n.postId}`}>post</Link> : "post"}:{" "}
        <em>{n.content}</em>
      </span>
    );
  }

  return (
    <div
      className={`notif-card ${n.seen ? "" : "notif-unread"}`}
      onClick={() => onClick?.(n)}
      role="button"
      tabIndex={0}
    >
      <img className="notif-avatar" src={avatar} alt={`${actorName} avatar`} />
      <div className="notif-main">
        <div className="notif-text">{body}</div>
        <div className="notif-meta">
          <span className="notif-time">{time}</span>
          {!n.seen && <span className="notif-dot" aria-label="unread" />}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
