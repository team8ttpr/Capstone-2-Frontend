import React, { useState } from "react";
import Modal from "../components/PostForm";
import MiniDrawer from "../components/MiniDrawer";
import "../style/MyPost.css";

const MyPost = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="dashboard-layout">
      <MiniDrawer menuType="social" />
      <div className="dashboard-main-content">
        <div className="my-post-container">
          <div className="header-section">
            <h1>My Posts</h1>
            <p>Create and manage your posts and drafts.</p>
          </div>

          <div className="create-post-section">
            <div className="post-form-container">
              <h2>Share Your Music</h2>
              <p>
                Create a post and add your favorite music to share with the
                community.
              </p>

              <div className="modal-trigger-section">
                <Modal modal={isModalOpen} toggleModal={toggleModal} />
              </div>
            </div>
          </div>

          <div className="posts-list-section">
            <h2>Your Posts</h2>
            <div className="posts-placeholder">
              <p>
                Your created posts will appear here once the backend routes are
                implemented.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPost;
