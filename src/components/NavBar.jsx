import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { API_URL } from "../shared";
import "../style/NavBarStyles.css";
import NotificationItem from "./NotificationItem";
import axios from "axios";

const NavBar = ({ user, onLogout }) => {
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const notifRef = useRef();

  useEffect(() => {
    if (user) {
      axios
        .get(`${API_URL}/api/notifications`, { withCredentials: true })
        .then((res) => setNotifications(Array.isArray(res.data) ? res.data : []))
        .catch(() => setNotifications([]));
    }
  }, [user]);

  useEffect(() => {
    if (showNotifications && user) {
      axios
        .get(`${API_URL}/api/notifications`, { withCredentials: true })
        .then((res) => setNotifications(Array.isArray(res.data) ? res.data : []))
        .catch(() => setNotifications([]));
    }
  }, [showNotifications, user]);

  useEffect(() => {
    if (user && user.id) {
      axios
        .get(`${API_URL}/api/profile/${user.username || user.id}`, { withCredentials: true })
        .then((res) => setUserInfo(res.data))
        .catch(() => setUserInfo(null));
    }
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showNotifications]);

  // Dismiss single notification 
  const handleDismiss = (notifId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, fading: true } : n))
    );
    setTimeout(
      () => setNotifications((prev) => prev.filter((n) => n.id !== notifId)),
      500
    );
    axios
      .post(
        `${API_URL}/api/notifications/${notifId}/dismiss`,
        {},
        { withCredentials: true }
      )
      .catch(() => {});
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">
          <img
            src="https://res.cloudinary.com/di9wb90kg/image/upload/v1755882970/logoWhite_tjqsw6.png"
            alt="Spotter Logo"
            style={{ height: "54px", verticalAlign: "middle" }}
          />
        </Link>
      </div>

      <div className="nav-center">
        {user && (
          <>
            <div className="nav-section">
              <Link
                to="/dashboard"
                className={`nav-link${
                  location.pathname.startsWith("/dashboard") ? " active" : ""
                }`}
              >
                Dashboard
              </Link>
            </div>

            <div className="nav-section">
              <Link
                to="/social"
                className={`nav-link${
                  location.pathname.startsWith("/social") ? " active" : ""
                }`}
              >
                Social
              </Link>
            </div>

            <div className="nav-section">
              <Link
                to="/ai"
                className={`nav-link${
                  location.pathname.startsWith("/ai") ? " active" : ""
                }`}
              >
                AI Playlist
              </Link>
            </div>

            <div className="nav-section">
              <Link
                to="/profile"
                className={`nav-link${
                  location.pathname.startsWith("/profile") ? " active" : ""
                }`}
              >
                My Profile
              </Link>
            </div>
          </>
        )}
      </div>

      <div className="nav-links">
        {userInfo && (
          <div className="user-section">
            <div
              className="nav-section"
              style={{ position: "relative" }}
              ref={notifRef}
            >
              <button
                className="notif-btn"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  position: "relative"
                }}
                onClick={() => setShowNotifications((v) => !v)}
                aria-label="Notifications"
              >
                <NotificationsIcon
                  style={{
                    color: showNotifications ? "#1db954" : "#fff",
                  }}
                />
                {/* Notification counter badge */}
                {notifications.filter(n => !n.seen).length > 0 && (
                  <span
                    className="notif-counter"
                    style={{
                      position: "absolute",
                      top: -4,
                      right: -4,
                      background: "#ff3b3b",
                      color: "#fff",
                      borderRadius: "50%",
                      minWidth: 18,
                      height: 18,
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 1px 4px #ff3b3b44",
                      padding: "0 5px",
                      zIndex: 2,
                      pointerEvents: "none"
                    }}
                  >
                    {notifications.filter(n => !n.seen).length}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div
                  className="notif-dropdown"
                  style={{
                    position: "absolute",
                    top: 36,
                    right: 0,
                    minWidth: 280,
                    background: "#23232a",
                    color: "#fff",
                    borderRadius: 8,
                    boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
                    zIndex: 1000,
                    padding: 12,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      marginBottom: 8,
                    }}
                  >
                    Notifications
                  </div>
                  {notifications.length === 0 ? (
                    <div
                      style={{
                        color: "#bbb",
                        fontStyle: "italic",
                      }}
                    >
                      No notifications
                    </div>
                  ) : (
                    <div style={{ maxHeight: 320, overflowY: "auto" }}>
                      {notifications.map((notif) => (
                        <NotificationItem
                          key={notif.id}
                          n={notif}
                          onClick={() => handleDismiss(notif.id)}
                          showRelativeTime={true}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <img
              src={userInfo.profileImage || userInfo.spotifyProfileImage || userInfo.avatarURL || userInfo.avatar || "/default-avatar.png"}
              alt="Profile"
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                objectFit: "cover",
                marginRight: 3,
                boxShadow: "0 1px 4px #1db95444",
                background: "#23232a",
                border: "2px solid #232323"
              }}
            />
            <span style={{ color: "#fff", fontWeight: 600, fontSize: "1.15rem", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginRight: 6 }}>
              {userInfo.firstName && userInfo.lastName
                ? `${userInfo.firstName} ${userInfo.lastName}`
                : userInfo.displayName
                ? userInfo.displayName
                : userInfo.username}
            </span>
            <button onClick={onLogout} className="logout-btn">
              Logout
            </button>
          </div>
        )}
        {!userInfo && (
          <div className="auth-links">
            <Link
              to="/auth"
              className={`nav-link${
                location.pathname.startsWith("/auth") ? " active" : ""
              }`}
            >
              Log In
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
