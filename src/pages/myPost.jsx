import React, { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "../components/PostCard";
import Modal from "../components/PostForm";
import MiniDrawer from "../components/MiniDrawer";

const MyPost = () => {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("all"); // 'all', 'draft', or 'published'
  const [currentUser, setCurrentUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    // Fetch current user
    axios
      .get("http://localhost:8080/auth/me", { withCredentials: true })
      .then((res) => setCurrentUser(res.data.user))
      .catch((err) => console.error("Failed to fetch current user:", err));

    // Fetch logged-in user's posts
    axios
      .get("http://localhost:8080/api/posts/mine", { withCredentials: true })
      .then((res) => setPosts(res.data))
      .catch((err) => console.error("Failed to fetch my posts:", err));
  }, []);

  const filteredPosts = posts.filter((post) => {
    if (filter === "all") return true;
    return post.status === filter;
  });

  return (
    <div className="dashboard-summary">
      <MiniDrawer menuType="social" />
      <div className="dashboard-main-content">
        <div className="dashboard-summary">
          <h1>My Posts</h1>
          <p>This is the page for user's posts and drafts.</p>

          {/* Filter Buttons */}
          <div style={{ marginBottom: "1rem" }}>
            <button onClick={() => setFilter("all")}>All</button>
            <button onClick={() => setFilter("published")}>Published</button>
            <button onClick={() => setFilter("draft")}>Draft</button>
            <button onClick={toggleModal}>+ Create Post</button>
          </div>

          <Modal modal={isModalOpen} toggleModal={toggleModal} />

          {filteredPosts.length === 0 ? (
            <p>No posts found for selected filter.</p>
          ) : (
            filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} currentUser={currentUser} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPost;
