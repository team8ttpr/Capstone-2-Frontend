import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/PostCard.css";
import { API_URL } from "../shared";

const PostCard = ({ post, currentUser, onPostUpdate }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const isOwner = currentUser?.id === post.author?.id || currentUser?.id === post.userId;
  const author = post.author || post.user || { username: "Unknown", avatarURL: null, spotifyProfileImage: null, profileImage: null };
  const getAuthorAvatar = () => author.avatarURL || author.spotifyProfileImage || author.profileImage || null;

  const formatDate = (dateString) => {
    const diffInHours = Math.floor((new Date() - new Date(dateString)) / (1000 * 60 * 60));
    if (diffInHours < 1) return "now";
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInHours < 48) return "1d";
    return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`${API_URL}/api/posts/${post.id}`, { withCredentials: true });
      if (onPostUpdate) onPostUpdate();
      setShowPostModal(false);
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete post.");
    }
  };

  const handleGoToPost = () => window.location.href = `/posts/${post.id}`;
  const handleUnfollow = () => { alert("Unfollow functionality coming soon!"); setShowPostModal(false); };

  const handleLike = async () => {
    try {
      await axios.post(`${API_URL}/api/posts/${post.id}/like`, {}, { withCredentials: true });
      setIsLiked(!isLiked);
      setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
    } catch (error) {
      console.error("Like failed:", error);
    }
  };

  const handleCopyLink = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/posts/${post.id}`);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleRepost = (e) => { e.stopPropagation(); alert("Repost functionality coming soon!"); };

  return (
    <div className={`concept-post-card ${post.status === "draft" ? "post-draft" : ""}`}>
      <div className="concept-post-header">
        <div className="header-left">
          <div className="author-avatar">
            {getAuthorAvatar() ? (
              <img src={getAuthorAvatar()} alt={`${author.username}'s avatar`} />
            ) : (
              <div className="default-avatar">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            )}
          </div>
          <span className="author-name">{author.username}</span>
        </div>

        <div className="header-center">
          <h2 className="post-title">{post.title}</h2>
        </div>

        <div className="header-right">
          {post.status === "draft" && <div className="draft-badge">DRAFT</div>}
          <button className="post-menu-button" onClick={(e) => { e.stopPropagation(); setShowPostModal(true); }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="19" r="2" />
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

        {post.spotifyEmbedUrl && (
          <div className="spotify-section">
            {post.spotifyEmbedUrl.includes("playlist") && (
              <div className="fork-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 2l3 6v8l-3 6v-6H3l3-2-3-2h3V2zm9 12h3l-3 2 3 2h-3v6l-3-6V8l3-6v6z" />
                </svg>
                fork
              </div>
            )}
            <div className="spotify-embed-container">
              <iframe
                src={post.spotifyEmbedUrl}
                width="100%"
                allowtransparency="true"
                allow="encrypted-media"
                title={`Spotify ${post.spotifyType}: ${post.title}`}
                style={{ border: 'none' }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="concept-post-footer">
        <div className="footer-left">
          <span className="timestamp">{formatDate(post.createdAt)}</span>
          {post.isPublic && (
            <span className="public-indicator">
              <svg width="12" height="12" viewBox="-63 65 128 128" fill="currentColor">
                <path d="M4.8,189.6c33.5-2,59-30.9,56.8-64.4c-2-33.5-30.9-59-64.4-56.8c-33.5,2-59,30.9-56.8,64.4 C-57.6,166.2-28.7,191.6,4.8,189.6z M-12.6,116.5c-1.7-3.3,3.1-5.1,5.6-7.6c3.1-3.3,9.8-8.7,9-10.7C1.2,96-5.6,90-9.3,91.4 c-0.8,0-5.1,4.8-6.1,5.6c0-1.7-0.3-2.6-0.3-4.2c0-1.1-2.2-2-2-2.8c0.2-1.9,4.8-5.4,5.9-6.8c-0.9-0.6-4-2.8-4.8-2.5 c-2,1.1-4.5,1.9-6.7,2.8c0-0.8-0.2-1.6-0.3-2c4.2-2.2,8.7-3.7,13.4-4.8l4.2,1.6l3.1,3.3l3.1,2.9c0,0,1.9,0.8,2.6,0.8 c0.9-0.2,3.9-4,3.9-4l-1.2-2.9l-0.2-2.6c8.4,0.8,16.1,3.3,23.1,7.6c-1.1,0.2-2.6,0.3-4,0.8c-0.6-0.3-3.9,0.3-3.7,1.7 c0.2,1.1,5.9,5.7,8.4,9.8c2.5,4.2,9.5,6.8,10.7,11.5c1.2,5.4-0.8,12.4,0.2,18.9c0.9,6.4,7.9,13,7.9,13s3.1,0.9,5.6,0.3 c-1.9,9.5-6.1,18.2-12.6,25.6c-7.3,8.2-16.5,14-26.9,16.5c1.2-3.7,3.7-7.3,6.1-9.3c2-1.9,4.5-5.1,5.4-7.6c0.9-2.6,2.2-4.8,3.7-7.3 c1.9-3.3-5.7-7.9-8.2-8.7c-5.6-2-9.8-4.8-14.6-7.9c-3.6-2.2-14.3,2.8-18.3,1.2c-5.4-2-7.3-3.7-12.1-6.8c-5-3.3-3.6-10.2-3.9-15.4 c3.7,0,8.8-1.6,11.5,1.2c0.8,0.9,3.7,4.8,5.4,3.3C-9.2,122.3-12,117.6-12.6,116.5z M-42.4,97.4c0.3,2.6,1.7,4.7,1.7,6.5 c0,7.3-0.6,11.6,4,17.4c1.9,2.2,2.5,5.6,3.3,8.4c0.9,2.6,4,3.9,6.4,5.4c4.5,2.9,8.8,6.7,13.7,9.3c3.1,1.7,5,2.6,4.5,6.4 c-0.6,2.9-0.6,4.8-2,7.6c-0.3,0.9,2.2,5.9,2.9,6.5c2.5,2,4.8,4,7.5,5.9c4,2.9,0,7.3-1.6,11.8c-11.8-0.8-23.1-5.4-32.3-13.4 c-10.7-9.5-17.1-22.7-18-36.8C-53.3,119.5-50.2,107.5-42.4,97.4z" />
              </svg>
              Public
            </span>
          )}
        </div>

        <div className="concept-actions">
          <button className="concept-action-btn comment-btn" title="Comment">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.99 4c0-1.1-.89-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
            </svg>
            <span className="action-label">Comment</span>
          </button>

          <button className={`concept-action-btn like-btn ${isLiked ? "liked" : ""}`} onClick={handleLike} title="Like">
            <svg width="18" height="18" viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span className="action-label">Like</span>
            {likesCount > 0 && <span className="like-count">{likesCount}</span>}
          </button>

          <button className="concept-action-btn share-btn" onClick={(e) => { e.stopPropagation(); setShowShareModal(true); }} title="Share">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke="currentColor" strokeWidth="2" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span className="action-label">Share</span>
          </button>
        </div>
      </div>

      {showPostModal && (
        <div className="modal-overlay" onClick={() => setShowPostModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Post Options</h3>
              <button className="close-modal-btn" onClick={() => setShowPostModal(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
            
            <div className="modal-content">
              <button className="modal-option" onClick={handleGoToPost}>
                <div className="option-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                    <polyline points="14,2 14,8 20,8"/>
                  </svg>
                </div>
                <div className="option-details">
                  <h4>Go to Post</h4>
                  <p>View full post page</p>
                </div>
              </button>

              {!isOwner && (
                <button className="modal-option danger" onClick={handleUnfollow}>
                  <div className="option-icon danger">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-1c0-1.1.9-2 2-2h9c.8 0 1.5-.7 1.5-1.5s-.7-1.5-1.5-1.5H6c-1.66 0-3 1.34-3 3v3h1zm9-9.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zM7.5 12c.83 0 1.5-.67 1.5-1.5S8.33 9 7.5 9 6 9.67 6 10.5 6.67 12 7.5 12zm4.5-1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5-1.5.67-1.5 1.5z"/>
                    </svg>
                  </div>
                  <div className="option-details">
                    <h4>Unfollow</h4>
                    <p>Stop following this user</p>
                  </div>
                </button>
              )}

              {isOwner && (
                <button className="modal-option danger" onClick={handleDelete}>
                  <div className="option-icon danger">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
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

      {showShareModal && (
        <div className="modal-overlay" onClick={() => { setShowShareModal(false); setLinkCopied(false); }}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Share Post</h3>
              <button className="close-modal-btn" onClick={() => { setShowShareModal(false); setLinkCopied(false); }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>

            <div className="modal-content">
              <button className="modal-option" onClick={handleCopyLink}>
                <div className="option-icon copy">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                  </svg>
                </div>
                <div className="option-details">
                  <h4>Copy Link</h4>
                  <p>{linkCopied ? "Link copied!" : "Copy link to post"}</p>
                </div>
                {linkCopied && (
                  <div className="check-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  </div>
                )}
              </button>

              <button className="modal-option" onClick={handleRepost}>
                <div className="option-icon repost">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 7v4H5.83l3.58-3.59L8 6l-6 6 6 6 1.41-1.41L5.83 13H21V7z" />
                  </svg>
                </div>
                <div className="option-details">
                  <h4>Repost</h4>
                  <p>Share this post with your followers</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;