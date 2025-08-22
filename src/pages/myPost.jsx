import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import MiniDrawer from "../components/MiniDrawer";
import SearchBar from "../components/SearchBar";
import "../style/MyPost.css";
import { API_URL } from "../shared";

const MyPost = () => {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [currentUser, setCurrentUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [query, setQuery] = useState("");

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
    fetchPosts();
  };

const fetchPosts = async () => {
  try {
    const url = `${API_URL}/api/posts/my`;
    const response = await axios.get(url, { withCredentials: true });
    setPosts(response.data);
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
};

  useEffect(() => {
    axios
      .get(`${API_URL}/auth/me`, { withCredentials: true })
      .then((res) => {
        console.log("Current user:", res.data.user);
        setCurrentUser(res.data.user);
      })
      .catch((err) => console.error("Failed to fetch current user:", err));
    fetchPosts();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const handlePostUpdate = () => {
    fetchPosts();
  };

const filtered = useMemo(() => {
  const q = query.trim().toLowerCase();
  let filteredPosts = posts;
  if (filter === "draft") {
    filteredPosts = filteredPosts.filter(p => p.status === "draft");
  } else if (filter === "published") {
    filteredPosts = filteredPosts.filter(p => p.status === "published");
  }
  if (!q) return filteredPosts;
  return filteredPosts.filter(
    (p) =>
      (p.title || "").toLowerCase().includes(q) ||
      (p.description || "").toLowerCase().includes(q) ||
      (p.status || "").toLowerCase().includes(q)
  );
}, [posts, query, filter]);

return (
    <div className="dashboard-layout">
      <MiniDrawer menuType="social" />
      <div className="dashboard-main-content">
        <div className="dashboard-summary">
          <h1 style={{ textAlign: "left", color: "white" }} >My Posts</h1>

          {/* Filter Buttons */}
          <div
            className="filter-buttons"
            style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}
          >
            <button
              onClick={() => setFilter("all")}
              className={filter === "all" ? "active" : ""}
              style={{
                padding: "0.5rem 1rem",
                border: filter === "all" ? "2px solid #1db954" : "1px solid #23232a",
                borderRadius: "6px",
                background: filter === "all" ? "#23232a" : "#18181c",
                color: filter === "all" ? "#1db954" : "#fff",
                fontWeight: filter === "all" ? 700 : 500,
                cursor: "pointer",
                boxShadow: filter === "all" ? "0 2px 8px rgba(29,185,84,0.08)" : "none",
                transition: "all 0.2s",
              }}
            >
              All
            </button>
            <button
              onClick={() => setFilter("draft")}
              className={filter === "draft" ? "active" : ""}
              style={{
                padding: "0.5rem 1rem",
                border: filter === "draft" ? "2px solid #1db954" : "1px solid #23232a",
                borderRadius: "6px",
                background: filter === "draft" ? "#23232a" : "#18181c",
                color: filter === "draft" ? "#1db954" : "#fff",
                fontWeight: filter === "draft" ? 700 : 500,
                cursor: "pointer",
                boxShadow: filter === "draft" ? "0 2px 8px rgba(29,185,84,0.08)" : "none",
                transition: "all 0.2s",
              }}
            >
              Draft
            </button>
            <button
              onClick={() => setFilter("published")}
              className={filter === "published" ? "active" : ""}
              style={{
                padding: "0.5rem 1rem",
                border: filter === "published" ? "2px solid #1db954" : "1px solid #23232a",
                borderRadius: "6px",
                background: filter === "published" ? "#23232a" : "#18181c",
                color: filter === "published" ? "#1db954" : "#fff",
                fontWeight: filter === "published" ? 700 : 500,
                cursor: "pointer",
                boxShadow: filter === "published" ? "0 2px 8px rgba(29,185,84,0.08)" : "none",
                transition: "all 0.2s",
              }}
            >
              Published
            </button>
            <button
              onClick={toggleModal}
              style={{
                padding: "0.5rem 1.5rem",
                border: "none",
                borderRadius: "6px",
                background: "#28a745",
                color: "white",
                cursor: "pointer",
                marginLeft: "auto",
              }}
            >
              + Create Post
            </button>
          </div>

          <SearchBar onSearch={setQuery} placeholder="Search for a post..." />

          {/* Post Form Modal */}
          <PostForm
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onPostCreated={handlePostCreated}
          />

          {/* Posts List */}
          <div className="posts-container">
            {posts.length === 0 ? (
              <div
                className="no-posts"
                style={{
                  textAlign: "center",
                  padding: "3rem",
                  background: "#18181c",
                  borderRadius: "8px",
                  border: "1px solid #23232a",
                  color: "#fff",
                }}
              >
                <h3>No posts found</h3>
                <p>
                  {filter === "all" && "You haven't created any posts yet."}
                  {filter === "published" &&
                    "You don't have any published posts."}
                  {filter === "draft" && "You don't have any draft posts."}
                </p>
                <button
                  onClick={toggleModal}
                  style={{
                    padding: "0.75rem 1.5rem",
                    border: "none",
                    borderRadius: "6px",
                    background: "#1db954",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "1rem",
                    marginTop: "1rem",
                  }}
                >
                  Create Your First Post
                </button>
              </div>
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
    </div>
  );
};

export default MyPost;
