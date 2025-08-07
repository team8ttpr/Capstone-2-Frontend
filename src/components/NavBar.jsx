import React from "react";
import { Link } from "react-router-dom";
import "../style/NavBarStyles.css";

const NavBar = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">Capstone-2</Link>
      </div>

      <div className="nav-center">
        <div className="nav-section">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
        </div>
        
        <div className="nav-section">
          <Link to="/social" className="nav-link">Social</Link>
        </div>

        <div className="nav-section">
          <Link to="/ai-playlist" className="nav-link">AI Playlist</Link>
        </div>

        <div className="nav-section">
          <Link to="/profile" className="nav-link">My Profile</Link>
        </div>
      </div>

      <div className="nav-links">
        {user ? (
          <div className="user-section">
            <Link to="/profile" className="username-link">
              Welcome, {user.username}!
            </Link>
            <button onClick={onLogout} className="logout-btn">
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-links">
            <Link to="/auth" className="nav-link">
              Log In
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;