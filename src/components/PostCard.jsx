import React, { useState } from "react";
import axios from "axios";
import "../style/PostCard.css";

const PostCard = ({ post, user }) => {
  const [showMenu, setShowMenu] = useState(false);

  const isOwner = user?.id === post.author?.id || user?.id === post.userId;
  const author = post.author ||
    post.user || { username: "Unknown", avatarUrl: null };
  const createdAt = new Date(post.createdAt).toLocaleString(); // optional: format

  const copyShareLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/posts/${post.id}`);
    alert("Post link copied!");
  };

  const handleEdit = async (postId) => {
    if (!window.confirm("Do you want to edit this post?")) return;

    try {
      await axios.patch(`http://localhost:8080/api/posts/${postId}`, {
        status: "published",
      });
    } catch (error) {
      console.error("Edit failed:", error);
      alert("Failed to edit post.");
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(`http://localhost:8080/api/posts/${postId}`, {
        withCredentials: true,
      });
      alert("Post deleted!");
      window.location.reload(); // or use callback to re-fetch
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete post.");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/posts/${post.id}`);
    alert("Post link copied!");
  };

  return (
    <div className="post-card">
      {/* Top-right menu positioned here */}
      {isOwner && (
        <div className="post-menu">
          <button
            className="post-menu-button"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
          >
            ⋯
          </button>
          {showMenu && (
            <div className="post-dropdown">
              {post.status !== "published" && (
                <button onClick={() => handleEdit(post.id)}>Edit</button>
              )}
              <button onClick={() => handleDelete(post.id)}>Delete</button>
            </div>
          )}
        </div>
      )}

      {/* Post Header */}
      <div className="post-header">
        <img
          src={author.avatarUrl || "/default-avatar.png"}
          alt="avatar"
          className="avatar"
        />
        <div className="author-info">
          <div className="username">{author.username}</div>
          <div className="timestamp">{createdAt} • 🌐</div>
        </div>
      </div>

      {/* Post Body */}
      <div className="post-body">
        <p className="title">{post.title}</p>
        <p className="description">{post.description}</p>
        <div className="embed-placeholder">Embed coming soon...</div>
      </div>

      {/* Post Footer */}
      <div className="post-footer">
        <div className="reactions">❤️ 2</div>
        <div className="actions">
          <button>Like</button>
          <button>Comment</button>
          <button onClick={copyShareLink}>Share</button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
