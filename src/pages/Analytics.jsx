import React from "react";
import MiniDrawer from '../components/MiniDrawer';

const Analytics = () => {
  return (
    <div className="dashboard-layout">
      <MiniDrawer />
      <div className="dashboard-main-content">
        <div className="dashboard-summary">
          <h1>Dashboard Summary</h1>
          <p>This is the main page for summary in the dashboard feature. You will be directed here upon logging in.</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;