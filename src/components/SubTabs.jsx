import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../style/SubTabs.css";

const GROUPS = {
  dashboard: [
    { label: "Analytics", path: "/dashboard/analytics" },
    { label: "Top Tracks", path: "/dashboard/toptracks" },
    { label: "Top Artist", path: "/dashboard/topartist" },
    { label: "My Playlist", path: "/dashboard/myplaylist" },
  ],
  social: [
    { label: "Feed", path: "/social/feed" },
    { label: "Friends", path: "/social/friends" },
    { label: "Messages", path: "/social/messages" },
    { label: "My Posts", path: "/social/mypost" },
    { label: "Notifications", path: "/social/notifications" },
  ],
};

// Renders the mobile sub-nav for a section, or nothing if the route isn't in a group.
export default function SubTabs() {
  const location = useLocation();
  const group = location.pathname.startsWith("/dashboard")
    ? "dashboard"
    : location.pathname.startsWith("/social")
    ? "social"
    : null;
  if (!group) return null;
  return (
    <nav className="subtabs">
      {GROUPS[group].map((t) => (
        <Link
          key={t.path}
          to={t.path}
          className={`subtab ${location.pathname === t.path ? "active" : ""}`}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
