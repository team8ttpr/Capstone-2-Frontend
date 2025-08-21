import React, { useState, useEffect, useRef } from "react";
import MiniDrawer from "../components/MiniDrawer";
import NotificationItem from "../components/NotificationItem";
import axios from "axios";
import { API_URL } from "../shared";
import { socket } from "../ws";

const Notifications = () => {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  // prevents duplicate fetches in React 18 dev StrictMode
  const didFetch = useRef(false);
  const abortRef = useRef(null);

  useEffect(() => {
    if (didFetch.current) return; // <-- only run once
    didFetch.current = true;

    abortRef.current = new AbortController();

    (async () => {
      try {
        const res = await axios.get(`${API_URL}/api/notifications`, {
          withCredentials: true,
          signal: abortRef.current.signal, // cancel on unmount
        });
        setNotifs(res.data);
      } catch (e) {
        // ignore cancel errors
        if (e.name !== "CanceledError" && e.code !== "ERR_CANCELED") {
          console.error("Failed to load notifications:", e);
        }
      } finally {
        setLoading(false);
      }
    })();

    // keep live socket updates WITHOUT refetching
    const onNew = (notif) => setNotifs((prev) => [notif, ...prev]);
    socket.on("notification:new", onNew);

    return () => {
      socket.off("notification:new", onNew);
      abortRef.current?.abort();
    };
  }, []);

  // Dismiss all notifications with fade out
  const handleDismissAll = () => {
    setNotifs((prev) =>
      prev.map((n) => ({ ...n, fading: true }))
    );
    setTimeout(() => setNotifs([]), 500); // match fade duration
    // Optionally, call backend to mark all as dismissed
    axios.post(`${API_URL}/api/notifications/dismiss-all`, {}, { withCredentials: true }).catch(() => {});
  };

  // Dismiss single notification (with fade)
  const handleDismiss = (notifId) => {
    setNotifs((prev) =>
      prev.map((n) =>
        n.id === notifId ? { ...n, fading: true } : n
      )
    );
    setTimeout(
      () =>
        setNotifs((prev) =>
          prev.filter((n) => n.id !== notifId)
        ),
      500
    );
    // Optionally, call backend to mark as dismissed
    axios.post(`${API_URL}/api/notifications/${notifId}/dismiss`, {}, { withCredentials: true }).catch(() => {});
  };

  return (
    <div className="dashboard-layout">
      <MiniDrawer menuType="social" />
      <div className="dashboard-main-content">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h1
            style={{
              color: "#fff",
              marginBottom: "0.7rem",
              fontWeight: 800,
              fontSize: "2.2rem",
              letterSpacing: "-1px",
            }}
          >
            Notifications
          </h1>
          {notifs.length > 0 && (
            <button
              onClick={handleDismissAll}
              style={{
                background: "#1db954",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "8px 18px",
                fontWeight: 600,
                fontSize: "1rem",
                cursor: "pointer",
                marginLeft: "1rem",
                transition: "background 0.2s",
              }}
            >
              Dismiss All
            </button>
          )}
        </div>
        <div
          style={{
            width: "100%",
            height: "3px",
            background: "linear-gradient(90deg, #1db954 0%, #27c93f 100%)",
            borderRadius: "2px",
            marginBottom: "1.5rem",
          }}
        />
        {loading ? (
          <div className="notif-loading">Loading…</div>
        ) : notifs.length === 0 ? (
          <div className="notif-empty">You’re all caught up 🎉</div>
        ) : (
          <div className="notif-list">
            {notifs.map((n) => (
              <NotificationItem
                key={n.id}
                n={n}
                fading={n.fading}
                onClick={() => handleDismiss(n.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;