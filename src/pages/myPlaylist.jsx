import React from "react";
import MiniDrawer from '../components/MiniDrawer';

const myPlaylist = () => {
  return (
    <div className="dashboard-layout">
      <MiniDrawer />
      <div className="dashboard-main-content">
        <div className="dashboard-summary">
          <h1>My Playlists</h1>
          <p>This is the page to display user's current existing playlists.</p>
        </div>
      </div>
    </div>
  );
};

export default myPlaylist;