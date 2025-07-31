import React from "react";
import { Link } from "react-router-dom";
import "./NavBarStyles.css";

const NavBar = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">Capstone I</Link>
      </div>

      <div className="nav-links">
        {user ? (
          <div className="user-section">
            <Link to="/spotify" className="nav-link">
              Spotify
            </Link>
            <span className="username">Welcome, {user.username}!</span>
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