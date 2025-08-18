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

  return (
    <div className="dashboard-layout">
      <MiniDrawer menuType="social" />
      <div className="dashboard-main-content">
        <h1>Notifications</h1>
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
                onClick={() =>
                  setNotifs((prev) =>
                    prev.map((x) => (x.id === n.id ? { ...x, seen: true } : x))
                  )
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
