import React from "react";
import MiniDrawer from '../components/MiniDrawer';

const Feed = () => {
  return (
    <div className="dashboard-layout">
      <MiniDrawer menuType="social" />
      <div className="dashboard-main-content">
        <div className="dashboard-summary">
          <h1>Social Feed</h1>
          <p>This is the page for user's feed.</p>
        </div>
      </div>
    </div>
  );
};

export default Feed;