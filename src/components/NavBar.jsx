import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../style/NavBarStyles.css";

const NavBar = ({ user, onLogout }) => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">Spotter</Link>
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
        {user ? (
          <div className="user-section">
            <span className="username">Welcome, {user.username}!</span>
            <button onClick={onLogout} className="logout-btn">
              Logout
            </button>
          </div>
        ) : (
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
