import React, { useEffect, useState } from "react";
import { API_URL } from "../shared";
import axios from "axios";
import { socket } from "../ws";

export default function Notifications() {
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    const fetchNotifs = async () => {
      const res = await axios.get(`${API_URL}/api/notifications`, {
        withCredentials: true,
      });
      setNotifs(res.data);
    };
    fetchNotifs();

    socket.on("notification:new", (notif) => {
      setNotifs((prev) => [notif, ...prev]);
    });

    return () => socket.off("notification:new");
  }, []);

  return (
    <div>
      <h1>Notifications</h1>
      <ul>
        {notifs.map((n) => (
          <li key={n.id}>
            {n.type === "new_follower" && (
              <span>{n.actor?.username} followed you</span>
            )}
            {n.type === "post_liked" && (
              <span>{n.actor?.username} liked your post</span>
            )}
            {n.type === "comment" && (
              <span>
                {n.actor?.username} commented: {n.content}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
