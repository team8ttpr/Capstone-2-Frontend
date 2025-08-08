import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import MiniDrawer from "../components/MiniDrawer";
import SearchBar from "../components/Searchbar";
import { API_URL } from "../shared";

const MyPost = () => {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [currentUser, setCurrentUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [query, setQuery] = useState("");

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
    fetchPosts();
  };

  const fetchPosts = async () => {
    try {
      let url = `${API_URL}/api/posts/mine`;
      if (filter === "draft") {
        url = `${API_URL}/api/posts/drafts`;
      } else if (filter === "published") {
        url = `${API_URL}/api/posts/published`;
      }
      const response = await axios.get(url, { withCredentials: true });
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    axios
      .get(`${API_URL}/auth/me`, { withCredentials: true })
      .then((res) => setCurrentUser(res.data.user))
      .catch((err) => console.error("Failed to fetch current user:", err));

    fetchPosts();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const handlePostUpdate = () => {
    fetchPosts();
  };

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((p) => {
      const title = (p.title || "").toLowerCase();
      const desc = (p.description || "").toLowerCase();
      const user = (p.author?.username || "").toLowerCase();
      return title.includes(q) || desc.includes(q) || user.includes(q);
    });
  }, [posts, query]);

  const nothingToShow = filteredPosts.length === 0;

  return (
    <div className="dashboard-layout">
      <MiniDrawer menuType="social" />
      <div className="dashboard-main-content">
        <div className="dashboard-summary">
          <h1>My Posts</h1>
          <p>This is the page for user's posts and drafts.</p>

          <div
            className="filter-buttons"
            style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}
          >
            <button
              onClick={() => setFilter("all")}
              className={filter === "all" ? "active" : ""}
              style={{
                padding: "0.5rem 1rem",
                border: "1px solid #ddd",
                borderRadius: "6px",
                background: filter === "all" ? "#007bff" : "white",
                color: filter === "all" ? "white" : "#333",
                cursor: "pointer",
              }}
            >
              All
            </button>
            <button
              onClick={() => setFilter("published")}
              className={filter === "published" ? "active" : ""}
              style={{
                padding: "0.5rem 1rem",
                border: "1px solid #ddd",
                borderRadius: "6px",
                background: filter === "published" ? "#007bff" : "white",
                color: filter === "published" ? "white" : "#333",
                cursor: "pointer",
              }}
            >
              Published
            </button>
            <button
              onClick={() => setFilter("draft")}
              className={filter === "draft" ? "active" : ""}
              style={{
                padding: "0.5rem 1rem",
                border: "1px solid #ddd",
                borderRadius: "6px",
                background: filter === "draft" ? "#007bff" : "white",
                color: filter === "draft" ? "white" : "#333",
                cursor: "pointer",
              }}
            >
              Draft
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

          <SearchBar onSearch={setQuery} />

          <PostForm
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onPostCreated={handlePostCreated}
          />

          <div className="posts-container">
            {nothingToShow ? (
              <div
                className="no-posts"
                style={{
                  textAlign: "center",
                  padding: "3rem",
                  background: "#f8f9fa",
                  borderRadius: "8px",
                  border: "1px solid #e9ecef",
                }}
              >
                <h3>No posts found</h3>
                <p>
                  {query
                    ? "No posts match your search."
                    : filter === "all"
                    ? "You haven't created any posts yet."
                    : filter === "published"
                    ? "You don't have any published posts."
                    : "You don't have any draft posts."}
                </p>
                {!query && (
                  <button
                    onClick={toggleModal}
                    style={{
                      padding: "0.75rem 1.5rem",
                      border: "none",
                      borderRadius: "6px",
                      background: "#007bff",
                      color: "white",
                      cursor: "pointer",
                      fontSize: "1rem",
                      marginTop: "1rem",
                    }}
                  >
                    Create Your First Post
                  </button>
                )}
              </div>
            ) : (
              filteredPosts.map((post) => (
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
