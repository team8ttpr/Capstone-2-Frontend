import React, { useState, useEffect, useMemo } from "react";
import MiniDrawer from "../components/MiniDrawer";
import axios from "axios";
import PostCard from "../components/PostCard";
import SearchBar from "../components/SearchBar";
import { API_URL } from "../shared";

const Feed = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (user) {
      setCurrentUser(user);
    } else {
      axios
        .get(`${API_URL}/auth/me`, { withCredentials: true })
        .then((res) => setCurrentUser(res.data.user))
        .catch((err) => console.error("Failed to fetch current user:", err));
    }

    axios
      .get(`${API_URL}/api/posts`, { withCredentials: true })
      .then((res) => setPosts(res.data.filter((p) => p.status !== "draft")))
      .catch((err) => console.error("Failed to fetch posts:", err));
  }, [user]);

  const handlePostUpdate = () => {
    axios
      .get(`${API_URL}/api/posts`, { withCredentials: true })
      .then((res) => setPosts(res.data.filter((p) => p.status !== "draft")))
      .catch((err) => console.error("Failed to fetch posts:", err));
  };

  // filter client-side
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(
      (p) =>
        (p.title || "").toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q) ||
        (p.author?.username || "").toLowerCase().includes(q)
    );
  }, [posts, query]);

  return (
    <div className="dashboard-layout">
      <MiniDrawer menuType="social" />
      <div className="dashboard-main-content">
        <div className="dashboard-summary">
          <h1 style={{ textAlign: "center" }}>Feed</h1>

          <SearchBar onSearch={setQuery} />

          {filtered.length === 0 ? (
            <p style={{ textAlign: "center" }}>No matching posts.</p>
          ) : (
            filtered.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                // ⚠️ Make sure this prop name matches PostCard’s signature.
                // If PostCard expects `user`, pass `user={currentUser}` instead.
                user={currentUser}
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
