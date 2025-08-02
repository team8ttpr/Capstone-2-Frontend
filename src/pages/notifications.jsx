import React from "react";
import MiniDrawer from '../components/MiniDrawer';

const Notifications = () => {
  return (
    <div className="dashboard-layout">
      <MiniDrawer menuType="social" />
      <div className="dashboard-main-content">
        <div className="dashboard-summary">
          <h1>Notifications</h1>
          <p>This is the page to display user's notifications.</p>
        </div>
      </div>
    </div>
  );
};

export default Notifications;