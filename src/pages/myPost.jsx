import React from "react";
import MiniDrawer from '../components/MiniDrawer';

const myPost = () => {
  return (
    <div className="dashboard-layout">
      <MiniDrawer menuType="social" />
      <div className="dashboard-main-content">
        <div className="dashboard-summary">
          <h1>My Posts</h1>
          <p>This is the page for user's posts and drafts.</p>
        </div>
      </div>
    </div>
  );
};

export default myPost;