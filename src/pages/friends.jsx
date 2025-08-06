import React from "react";
import MiniDrawer from '../components/MiniDrawer';

const Friends = () => {
  return (
    <div className="dashboard-layout">
      <MiniDrawer menuType="social" />
      <div className="dashboard-main-content">
        <div className="dashboard-summary">
          <h1>Friends</h1>
          <p>This is the page for user's follower/following lists and add Friends.</p>
        </div>
      </div>
    </div>
  );
};

export default Friends;