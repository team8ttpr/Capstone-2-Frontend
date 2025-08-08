import React, { useState, useEffect } from "react";
import MiniDrawer from "../components/MiniDrawer";
import axios from "axios";
import PostCard from "../components/PostCard";
import style from "../style/PostCard.css";
import { API_URL } from "../shared";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_URL}/auth/me`, { withCredentials: true })
      .then((res) => {
        console.log("Current user:", res.data.user);
        setCurrentUser(res.data.user);
      })
      .catch((err) => console.error("Failed to fetch current user:", err));

    axios
      .get(`${API_URL}/api/posts?include=user`, { withCredentials: true })
      .then((res) => {
        console.log("Feed posts data:", res.data);
        const publicPosts = res.data.filter((post) => post.status !== "draft");
        setPosts(publicPosts);
      })
      .catch((err) => console.error("Failed to fetch posts:", err));
  }, []);

  const handlePostUpdate = () => {
    axios
      .get(`${API_URL}/api/posts?include=user`, { withCredentials: true })
      .then((res) => {
        const publicPosts = res.data.filter((post) => post.status !== "draft");
        setPosts(publicPosts);
      })
      .catch((err) => console.error("Failed to fetch posts:", err));
  };

  return (
    <div className="dashboard-layout">
      <MiniDrawer menuType="social" />
      <div className="dashboard-main-content">
        <div className="dashboard-summary">
          <h1 style={{ textAlign: "center" }}>Feed</h1>
          {posts.length === 0 ? (
            <p style={{ textAlign: "center" }}>No public posts yet.</p>
          ) : (
            posts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
                currentUser={currentUser}
                onPostUpdate={handlePostUpdate}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;