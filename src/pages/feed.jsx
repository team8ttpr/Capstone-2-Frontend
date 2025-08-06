import React, { useState, useEffect } from "react";
import MiniDrawer from "../components/MiniDrawer";
import PostCard from "../components/PostCard"; // ✅ Make sure this path is correct
import axios from "axios";

const Feed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/posts", { withCredentials: true })
      .then((res) => {
        const publicPosts = res.data.filter((post) => post.status !== "draft");
        setPosts(publicPosts);
      })
      .catch((err) => console.error("Failed to fetch posts:", err));
  }, []);

  return (
    <div className="dashboard-layout">
      <MiniDrawer menuType="social" />
      <div className="dashboard-main-content">
        <div className="dashboard-summary">
          <h1 style={{ textAlign: "center" }}>Feed</h1>
          {posts.length === 0 ? (
            <p style={{ textAlign: "center" }}>No public posts yet.</p>
          ) : (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;
