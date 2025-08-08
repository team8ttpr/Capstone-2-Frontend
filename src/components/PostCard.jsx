import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/PostCard.css";
import { API_URL } from "../shared";
import EditPostModal from "./EditPostModal";

const PostCard = ({ post, currentUser, onPostUpdate }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const isDraft = post.status === "draft";
  const isOwner = currentUser && post.userId === currentUser.id;

  useEffect(() => {
    if (currentUser && post.likes) {
      setIsLiked(post.likes.some((like) => like.userId === currentUser.id));
    }
  }, [currentUser, post.likes]);

  const handleLike = async () => {
    if (!currentUser) return;

    try {
      const response = await axios.post(
        `${API_URL}/api/posts/${post.id}/like`,
        {},
        {
          withCredentials: true,
        }
      );

      setIsLiked(response.data.liked);
      setLikesCount(response.data.likesCount);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleComment = () => {
    console.log("Comment clicked for post:", post.id);
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleCopyLink = () => {
    const postUrl = `${window.location.origin}/post/${post.id}`;
    copyToClipboard(postUrl);
  };

  const handleRepost = () => {
    console.log("Repost clicked for post:", post.id);
    setShowShareModal(false);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmed) return;

    try {
      await axios.delete(`${API_URL}/api/posts/${post.id}`, {
        withCredentials: true,
      });

      alert("Post deleted successfully!");
      if (onPostUpdate) onPostUpdate();
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
    }
  };

  const handleGoToPost = () => {
    window.open(`/post/${post.id}`, "_blank");
    setShowPostModal(false);
  };

  const handleUnfollow = () => {
    console.log("Unfollow clicked for user:", post.userId);
    setShowPostModal(false);
  };

  const handleEdit = () => {
    setShowEditModal(true);
    setShowPostModal(false);
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    if (onPostUpdate) onPostUpdate();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d`;

    return date.toLocaleDateString();
  };

  const getDefaultAvatar = (username) => {
    return username ? username.charAt(0).toUpperCase() : "?";
  };

  const userData = post.user || post.User || null;
  const username = userData?.username || userData?.name || "Unknown User";
  const avatar =
    userData?.avatar ||
    userData?.profilePicture ||
    userData?.profile_picture ||
    null;

  const getSpotifyEmbedUrl = () => {
    if (post.spotifyEmbedUrl) {
      return post.spotifyEmbedUrl;
    }

    if (post.spotifyId && post.spotifyType) {
      return `https://open.spotify.com/embed/${post.spotifyType}/${post.spotifyId}?utm_source=generator&theme=0`;
    }

    return null;
  };

  const spotifyEmbedUrl = getSpotifyEmbedUrl();

  return (
    <div className={`concept-post-card ${isDraft ? "post-draft" : ""}`}>
      {post.originalPostId && (
        <div className="fork-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 2l3 3.5L12 2l3 3.5L18 2v6.5c0 1.1-.9 2-2 2h-4v7h-4v-7H4c-1.1 0-2-.9-2-2V2h4z" />
          </svg>
          Forked
        </div>
      )}

      <div className="concept-post-header">
        <div className="header-left">
          <div className="author-avatar">
            {avatar ? (
              <img src={avatar} alt={username} />
            ) : (
              <div className="default-avatar">{getDefaultAvatar(username)}</div>
            )}
          </div>
          <div className="author-name">{username}</div>
        </div>

        <div className="header-center">
          <h2 className="post-title">{post.title}</h2>
        </div>

        <div className="header-right">
          {isDraft && <div className="draft-badge">DRAFT</div>}
          <button
            className="post-menu-button"
            onClick={() => setShowPostModal(true)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="concept-main-content">
        <div className="post-text-section">
          <div className="post-text-container">
            <p className="post-description">{post.description}</p>
          </div>
        </div>

        {/* Show Spotify embed for both drafts and published posts */}
        {spotifyEmbedUrl && (
          <div className="spotify-section">
            <div className="spotify-embed-container">
              <iframe
                src={spotifyEmbedUrl}
                width="100%"
                allowtransparency="true"
                allow="encrypted-media"
                title={`Spotify ${post.spotifyType}: ${post.title}`}
                style={{ border: "none" }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="concept-post-footer">
        <div className="footer-left">
          <span>{formatDate(post.createdAt)}</span>
          {!isDraft && (
            <div className="public-indicator">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
              </svg>
              Public
            </div>
          )}
        </div>

        {/* Show actions for published posts, hide for drafts */}
        {!isDraft && (
          <div className="concept-actions">
            <button
              className="concept-action-btn comment-btn"
              onClick={handleComment}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h11c.55 0 1-.45 1-1z" />
              </svg>
              <span className="action-label">Comment</span>
            </button>

            <button
              className={`concept-action-btn like-btn ${
                isLiked ? "liked" : ""
              }`}
              onClick={handleLike}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span className="action-label">Like</span>
              {likesCount > 0 && (
                <span className="like-count">{likesCount}</span>
              )}
            </button>

            <button
              className="concept-action-btn share-btn"
              onClick={handleShare}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z" />
              </svg>
              <span className="action-label">Share</span>
            </button>
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Share Post</h3>
              <button
                className="close-modal-btn"
                onClick={() => setShowShareModal(false)}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>

            <div className="modal-content">
              <button className="modal-option copy" onClick={handleCopyLink}>
                <div className="option-icon copy">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                  </svg>
                </div>
                <div className="option-details">
                  <h4>Copy Link</h4>
                  <p>Copy link to this post</p>
                </div>
                {linkCopied && (
                  <svg
                    className="check-icon"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                )}
              </button>

              <button className="modal-option repost" onClick={handleRepost}>
                <div className="option-icon repost">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z" />
                  </svg>
                </div>
                <div className="option-details">
                  <h4>Repost</h4>
                  <p>Share this post to your profile</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post Options Modal */}
      {showPostModal && (
        <div className="modal-overlay" onClick={() => setShowPostModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Post Options</h3>
              <button
                className="close-modal-btn"
                onClick={() => setShowPostModal(false)}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>

            <div className="modal-content">
              <button className="modal-option" onClick={handleGoToPost}>
                <div className="option-icon">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                    <polyline points="14,2 14,8 20,8" />
                  </svg>
                </div>
                <div className="option-details">
                  <h4>Go to Post</h4>
                  <p>View full post page</p>
                </div>
              </button>

              {!isOwner && (
                <button
                  className="modal-option danger"
                  onClick={handleUnfollow}
                >
                  <div className="option-icon danger">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 31.906 32"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      preserveAspectRatio="xMidYMid"
                    >
                      <path d="M29.323,28.000 L31.610,30.293 C31.999,30.684 31.999,31.316 31.610,31.707 C31.415,31.902 31.160,32.000 30.905,32.000 C30.649,32.000 30.394,31.902 30.200,31.707 L27.913,29.414 L25.627,31.707 C25.432,31.902 25.177,32.000 24.922,32.000 C24.667,32.000 24.412,31.902 24.217,31.707 C23.827,31.316 23.827,30.684 24.217,30.293 L26.503,28.000 L24.217,25.707 C23.827,25.316 23.827,24.684 24.217,24.293 C24.606,23.902 25.237,23.902 25.627,24.293 L27.913,26.586 L30.200,24.293 C30.589,23.902 31.220,23.902 31.610,24.293 C31.999,24.684 31.999,25.316 31.610,25.707 L29.323,28.000 ZM21.638,22.294 C22.028,22.684 22.028,23.317 21.638,23.707 C21.249,24.097 20.618,24.098 20.228,23.706 L19.231,22.706 C19.031,22.505 18.925,22.229 18.940,21.947 C18.956,21.664 19.089,21.400 19.308,21.222 C22.876,18.321 23.000,13.053 23.000,13.000 L23.000,7.000 C22.444,4.024 18.877,2.035 16.019,2.001 L15.948,2.003 C13.076,2.003 9.529,4.087 8.968,7.087 L8.964,12.994 C8.964,13.045 9.019,18.324 12.587,21.225 C12.845,21.435 12.982,21.761 12.952,22.093 C12.922,22.425 12.728,22.720 12.436,22.880 L1.988,28.594 L1.988,30.000 L20.933,30.000 C21.484,30.000 21.930,30.448 21.930,31.000 C21.930,31.552 21.484,32.000 20.933,32.000 L1.988,32.000 C0.888,32.000 -0.007,31.103 -0.007,30.000 L-0.007,28.000 C-0.007,27.634 0.193,27.297 0.513,27.122 L10.274,21.785 C7.005,18.239 7.000,13.232 7.000,13.000 L7.000,7.000 L6.987,6.832 C7.672,2.777 12.112,0.043 15.865,0.003 L15.948,-0.000 C19.718,-0.000 24.219,2.744 24.908,6.829 L24.922,6.996 L24.926,12.990 C24.926,13.227 24.888,18.479 21.380,22.034 L21.638,22.294 Z" />
                    </svg>
                  </div>
                  <div className="option-details">
                    <h4>Unfollow</h4>
                    <p>Stop following this user</p>
                  </div>
                </button>
              )}

              {isOwner && post.status === "draft" && (
                <button className="modal-option" onClick={handleEdit}>
                  <div className="option-icon">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                    </svg>
                  </div>
                  <div className="option-details">
                    <h4>Edit Draft</h4>
                    <p>Modify your draft post</p>
                  </div>
                </button>
              )}

              {isOwner && (
                <button className="modal-option danger" onClick={handleDelete}>
                  <div className="option-icon danger">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                    </svg>
                  </div>
                  <div className="option-details">
                    <h4>Delete Post</h4>
                    <p>Permanently remove this post</p>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Post Modal */}
      {showEditModal && (
        <EditPostModal
          post={post}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
};

export default PostCard;
