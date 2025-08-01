import React from "react";
import MiniDrawer from '../components/MiniDrawer';

const topArtist = () => {
  return (
    <div className="dashboard-layout">
      <MiniDrawer />
      <div className="dashboard-main-content">
        <div className="dashboard-summary">
          <h1>Top Artists</h1>
          <p>This is the page to display user's top artists.</p>
        </div>
      </div>
    </div>
  );
};

export default topArtist;