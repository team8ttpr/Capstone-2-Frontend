import React from "react";
import MiniDrawer from '../components/MiniDrawer';

const Messages = () => {
  return (
    <div className="dashboard-layout">
      <MiniDrawer menuType="social" />
      <div className="dashboard-main-content">
        <div className="dashboard-summary">
          <h1>Messages</h1>
          <p>This is the page for user's message logs.</p>
        </div>
      </div>
    </div>
  );
};

export default Messages;