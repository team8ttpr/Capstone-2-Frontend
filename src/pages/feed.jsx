import React, { useState, useEffect } from "react";
import MiniDrawer from "../components/MiniDrawer";
import axios from "axios";
import PostCard from "../components/PostCard";
import SearchField from "../components/Searchbar";
import style from "../style/PostCard.css";
import { API_URL } from "../shared";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    axios
      .get(`${API_URL}/auth/me`, { withCredentials: true })
      .then((res) => setCurrentUser(res.data.user))
      .catch((err) => console.error("Failed to fetch current user:", err));

    axios
      .get(`${API_URL}/api/posts/feed`)
      .then((res) => {
        setPosts(res.data);
      })
      .catch((err) => console.error("Failed to fetch posts:", err));
  }, []);

  const handlePostUpdate = () => {
    axios
      .get(`${API_URL}/api/posts/feed`)
      .then((res) => {
        setPosts(res.data);
      })
      .catch((err) => console.error("Failed to fetch posts:", err));
  };

  const filtered = posts.filter((p) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    const title = (p.title || "").toLowerCase();
    const desc = (p.description || "").toLowerCase();
    const user = (p.author?.username || "").toLowerCase();
    return title.includes(q) || desc.includes(q) || user.includes(q);
  });

  return (
    <div className="dashboard-layout">
      <MiniDrawer menuType="social" />
      <div className="dashboard-main-content">
        <div className="dashboard-summary">
          <h1 style={{ textAlign: "center" }}>Feed</h1>
          <SearchField onSearch={setQuery} />
          {filtered.length === 0 ? (
            <p style={{ textAlign: "center" }}>No public posts yet.</p>
          ) : (
            filtered.map((post) => (
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
