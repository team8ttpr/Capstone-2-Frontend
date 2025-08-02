import React from "react";
import MiniDrawer from '../components/MiniDrawer';

const topTracks = () => {
  return (
    <div className="dashboard-layout">
      <MiniDrawer />
      <div className="dashboard-main-content">
        <div className="dashboard-summary">
          <h1>Top Tracks</h1>
          <p>This is the page to display user's top tracks.</p>
        </div>
      </div>
    </div>
  );
};

export default topTracks;