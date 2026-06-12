import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu as MenuIcon,
  Close,
  Analytics,
  ChatBubble,
  AutoAwesome,
  Person,
  Logout,
} from "@mui/icons-material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import "../style/MobileNav.css";

const LOGO =
  "https://res.cloudinary.com/di9wb90kg/image/upload/v1755882970/logoWhite_tjqsw6.png";

// Top-level destinations. AI is hidden for guests (needs real Spotify).
const buildItems = (guest) => {
  const items = [
    { label: "Dashboard", path: "/dashboard", icon: <Analytics /> },
    { label: "Social", path: "/social", icon: <ChatBubble /> },
  ];
  if (!guest) items.push({ label: "AI Playlist", path: "/ai", icon: <AutoAwesome /> });
  items.push({ label: "My Profile", path: "/profile", icon: <Person /> });
  return items;
};

export default function MobileNav({ user, guest = false, onLogout }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const items = buildItems(guest);
  const close = () => setOpen(false);

  return (
    <>
      <div className="mobile-nav">
        <button className="mn-burger" aria-label="Menu" onClick={() => setOpen(true)}>
          <MenuIcon />
        </button>
        <Link to="/" className="mn-brand" onClick={close}>
          <img src={LOGO} alt="Spotter" />
        </Link>
        {user && (
          <Link to="/social/notifications" className="mn-bell" aria-label="Notifications">
            <NotificationsIcon />
          </Link>
        )}
      </div>

      {open && <div className="mn-scrim" onClick={close} />}
      <aside className={`mn-drawer ${open ? "open" : ""}`}>
        <div className="mn-drawer-head">
          <div className="mn-avatar" />
          <div>
            <div className="mn-user">{user ? user.username : "Guest"}</div>
            <div className="mn-status">{guest ? "Browsing Spotter" : "Connected"}</div>
          </div>
          <button className="mn-close" aria-label="Close" onClick={close}>
            <Close />
          </button>
        </div>
        <hr className="mn-divider" />
        {items.map((it) => (
          <Link
            key={it.path}
            to={it.path}
            onClick={close}
            className={`mn-item ${location.pathname.startsWith(it.path) ? "active" : ""}`}
          >
            <span className="mn-ic">{it.icon}</span>
            <span className="mn-label">{it.label}</span>
          </Link>
        ))}
        <button
          className="mn-item mn-logout"
          onClick={() => { close(); onLogout && onLogout(); }}
        >
          <span className="mn-ic"><Logout /></span>
          <span className="mn-label">{guest ? "Exit guest mode" : "Log out"}</span>
        </button>
      </aside>
    </>
  );
}
