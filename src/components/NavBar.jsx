import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../style/NavBarStyles.css";

const NavBar = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const location = useLocation();

  // Check if user is currently on dashboard or social pages
  const isOnDashboard = location.pathname.startsWith('/dashboard');
  const isOnSocial = location.pathname.startsWith('/social');


  
  


  return (
    <nav className="navbar">
      
       <div className="dropdown">
      <button 
        className="dropdown-button"
        onMouseEnter={() => !isOnDashboard && setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <Link to="/dashboard">Dashboard</Link>
      </button>
      
      {isOpen && !isOnDashboard && (
        <div 
          className="dropdown-content"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <Link to="/dashboard/analytics">Analytics</Link>
          <Link to="/dashboard/myplaylist">My Playlists</Link>
          <Link to="/dashboard/topartist">Top Artists</Link>
          <Link to="/dashboard/toptracks">Top Tracks</Link>
        </div>
      )}
    </div>
     
     <div className="dropdown">
      <button 
        className="dropdown-button"
        onMouseEnter={() => !isOnSocial && setIsOpen2(true)}
        onMouseLeave={() => setIsOpen2(false)}
      >
        <Link to="/social">Social</Link>
      </button>
      
      {isOpen2 && !isOnSocial && (
        <div 
          className="dropdown-content"
          onMouseEnter={() => setIsOpen2(true)}
          onMouseLeave={() => setIsOpen2(false)}
        >
          <Link to="/social/feed">Feed</Link>
          <Link to="/social/mypost">My Posts</Link>
          <Link to="/social/friends">Friends</Link>
          <Link to="/social/messages">Messages</Link>
          <Link to="/social/notifications">Notifications</Link>
        </div>
      )}
    </div>
     
      <div className="ai-playlist">
        <Link to="/">AI Playlist</Link>
      </div>

      <div className="my-profile">
        <Link to="/">My Profile</Link>
      </div>

      <div className="nav-links">
        {user ? (
          <div className="user-section">
            <Link to="/top-tracks" className="nav-link">
              Top Tracks
            </Link>
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