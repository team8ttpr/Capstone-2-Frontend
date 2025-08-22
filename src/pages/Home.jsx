// src/pages/Home.jsx
import React from "react";
import "../style/Home.css";
import { User, MessageCircle, Settings, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SNAPSHOTS = [
  {
    key: "dashboard",
    icon: <LayoutDashboard className="snapshot-icon" />,
    title: "Dashboard",
    desc: "Keep track of your music trend library and get recommendations.",
    route: "/dashboard",
    preview: (
      <div className="snapshot-preview">Dashboard preview coming soon!</div>
    ),
  },
  {
    key: "social",
    icon: <Settings className="snapshot-icon" />,
    title: "Social Features",
    desc: "Connect, share, and interact with your music community.",
    route: "/social",
    preview: (
      <div className="snapshot-preview">Social preview coming soon!</div>
    ),
  },
  {
    key: "ai",
    icon: <MessageCircle className="snapshot-icon" />,
    title: "AI Chat",
    desc: "Chat with our AI to get music recommendations and insights.",
    route: "/ai",
    preview: (
      <div className="snapshot-preview">AI Chat preview coming soon!</div>
    ),
  },
  {
    key: "profile",
    icon: <User className="snapshot-icon" />,
    title: "Profile Customization",
    desc: "Personalize your profile with music embeds, themes, and more.",
    route: "/profile",
    preview: (
      <div className="snapshot-preview">Profile preview coming soon!</div>
    ),
  },
];

const Home = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem("authToken");

  const handleSnapshotClick = (route) => {
    if (user) {
      navigate(route);
    }
  };

  return (
    <div className="home">
      <div className="home-title">
        <img
          src="https://res.cloudinary.com/di9wb90kg/image/upload/v1755882923/spotterLogo_c4j6rr.png"
          alt="Spotter Logo"
          className="spotter-logo"
        />
        <span>Welcome to Spotter</span>
      </div>
      <div className="home-intro">
        Where music meets community.
        <br />
        Discover, chat, and customize your profile in a friendly, playful space.
      </div>
      <button className="get-started-btn" onClick={() => navigate("/auth")}>
        Get Started
      </button>
      <div className="home-snapshots">
        {SNAPSHOTS.map((snap) => (
          <div
            className={`snapshot-card static-snapshot${
              user ? " clickable" : ""
            }`}
            key={snap.key}
            onClick={() => handleSnapshotClick(snap.route)}
            style={user ? { cursor: "pointer" } : {}}
          >
            {snap.icon}
            <div className="snapshot-title">{snap.title}</div>
            <div className="snapshot-desc">{snap.desc}</div>
            {snap.preview}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
