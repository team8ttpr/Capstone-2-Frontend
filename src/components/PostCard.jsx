import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/PostCard.css";
import { API_URL } from "../shared";
import EditPostModal from "./EditPostModal";
import ForkPlaylistModal from "./ForkPlaylistModal";
import ShareModal from "./ShareModal";
import PostOptionsModal from "./PostOptionModal";
import { useNavigate } from "react-router-dom";
import { socket } from "../ws";

const getProfileImage = (profile) => {
  return (
    profile?.profileImage ||
    profile?.spotifyProfileImage ||
    profile?.avatarURL ||
    profile?.avatar ||
    profile?.profile_image ||
    "/default-avatar.png"
  );
};

const PostCard = ({ post, currentUser, onPostUpdate }) => {
  const userData = post.author || post.user || post.User || null;
  const username =
    userData?.username ||
    userData?.spotifyDisplayName ||
    userData?.name ||
    userData?.display_name ||
    "Unknown User";

  const avatar = getProfileImage(userData);

  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [likeBusy, setLikeBusy] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [showForkModal, setShowForkModal] = useState(false);
  const navigate = useNavigate();

  const isDraft = post.status === "draft";

  useEffect(() => {
    setIsLiked(Boolean(post.isLiked));
    setLikesCount(Number(post.likesCount) || 0);
  }, [post.isLiked, post.likesCount]);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser) return;
    if (likeBusy) return;
    setLikeBusy(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/posts/${post.id}/like`,
        {},
        { withCredentials: true }
      );
      const data = response.data || {};
      if (typeof data.isLiked === "boolean") setIsLiked(data.isLiked);
      if (typeof data.likesCount === "number") setLikesCount(data.likesCount);
      if (data.isLiked === undefined && data.likesCount === undefined) {
        setIsLiked((v) => !v);
        setLikesCount((c) => (isLiked ? Math.max(0, c - 1) : c + 1));
      }
      if (onPostUpdate) {
        onPostUpdate(post.id, {
          isLiked: data.isLiked,
          likesCount: data.likesCount,
        });
      }
    } catch (error) {
      console.error("Error liking post:", error);
    } finally {
      setLikeBusy(false);
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    setShowShareModal(true);
  };

  const handleCopyLink = () => {
    const postUrl = `${window.location.origin}/post/${post.id}`;
    navigator.clipboard.writeText(postUrl).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    });
  };

  // --- Repost functionality ---
const handleRepost = async () => {
  setShowShareModal(false);
  try {
    const res = await axios.post(
      `${API_URL}/api/posts/${post.id}/repost`,
      {},
      { withCredentials: true }
    );
    if (onPostUpdate) onPostUpdate();

    if (
      currentUser &&
      post.userId &&
      currentUser.id !== post.userId
    ) {
      socket.emit("send_repost_notification", {
        postOwnerId: post.userId,
        reposterId: currentUser.id,
        postId: post.id,
      });
    }
  } catch (e) {
    alert("Failed to repost.");
  }
};

  const handleEdit = () => {
    setShowEditModal(true);
    setShowPostModal(false);
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    if (onPostUpdate) onPostUpdate();
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`${API_URL}/api/posts/${post.id}`, {
          withCredentials: true,
        });
        if (onPostUpdate) {
          onPostUpdate();
        }
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  const handleFork = (e) => {
    e.stopPropagation();
    if (!currentUser) {
      return;
    }
    setShowForkModal(true);
  };

  const handleForkSuccess = (forkedData) => {
    if (onPostUpdate) {
      onPostUpdate();
    }
  };

  const isSpotifyPlaylist = () => {
    const isPlaylist =
      (post.spotifyType && post.spotifyType.toLowerCase() === "playlist") ||
      (post.spotifyEmbedUrl && post.spotifyEmbedUrl.includes("/playlist/"));
    return isPlaylist;
  };

  const getDefaultAvatar = (username) => {
    return username ? username.charAt(0).toUpperCase() : "?";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleComment = (e) => {
    e.stopPropagation();
    navigate(`/post/${post.id}?commentsOpen=1`);
  };

  const getSpotifyEmbedUrl = () => {
    if (post.spotifyEmbedUrl) {
      return post.spotifyEmbedUrl;
    }

    if (post.spotifyId && post.spotifyType) {
      return `https://open.spotify.com/embed/${post.spotifyType}/${post.spotifyId}?utm_source=generator&theme=0`;
    }

    return null;
  };

  const handleGoToPost = () => {
    navigate(`/post/${post.id}`);
    setShowPostModal(false);
  };

  const handleUnfollow = () => {
    setShowPostModal(false);
  };

  const isOwner = currentUser && post.userId === currentUser.id;
  const spotifyEmbedUrl = getSpotifyEmbedUrl();

  // Share modal URLs
  const postUrl = `${window.location.origin}/post/${post.id}`;
  const shareText = encodeURIComponent(
    `${post.title ? post.title + " - " : ""}Check out this post on Capstone-2!`
  );
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
    postUrl
  )}&text=${shareText}`;

  // --- Repost tag logic ---
  const repostUsername =
    post.originalPosterUsername || post.originalPoster || "original";
  const handleRepostUserClick = (e) => {
    e.stopPropagation();
    if (repostUsername) {
      navigate(`/profile/${repostUsername}`);
    }
  };

  const handleAuthorClick = (e) => {
    e.stopPropagation();
    if (userData?.username) {
      navigate(`/profile/${userData.username}`);
    }
  };

  // Card click navigation (ignoring buttons/links)
  const handleCardClick = (e) => {
    if (
      e.target.closest("button") ||
      e.target.closest("a") ||
      e.target.closest(".concept-action-btn")
    ) {
      return;
    }
    navigate(`/post/${post.id}`);
  };

  return (
    <div
      className={`concept-post-card ${isDraft ? "post-draft" : ""}`}
      style={{ cursor: "pointer" }}
      onClick={handleCardClick}
    >
      <div className="concept-post-header">
        <div className="header-left">
          <div
            className="author-avatar"
            style={{ cursor: "pointer" }}
            onClick={handleAuthorClick}
          >
            {avatar ? (
              <img src={avatar} alt={username} />
            ) : (
              <div className="default-avatar">{getDefaultAvatar(username)}</div>
            )}
          </div>
          <div
            className="author-name"
            style={{ cursor: "pointer" }}
            onClick={handleAuthorClick}
          >
            {username}
          </div>
        </div>

        <div className="header-center">
          <h2 className="post-title">{post.title}</h2>
        </div>

        <div className="header-right">
          {isDraft && <div className="draft-badge">DRAFT</div>}
          <button
            className="post-menu-button"
            onClick={(e) => {
              e.stopPropagation();
              setShowPostModal(true);
            }}
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
            {post.originalPostId && repostUsername && (
              <div className="repost-tag">
                <span
                  style={{ color: "#1db954", cursor: "pointer" }}
                  onClick={handleRepostUserClick}
                ></span>
              </div>
            )}
          </div>
        </div>

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
              className={`concept-action-btn like-btn${
                isLiked ? " liked" : ""
              }`}
              onClick={handleLike}
              disabled={likeBusy}
              aria-pressed={isLiked}
              aria-label={isLiked ? "Unlike" : "Like"}
              title={isLiked ? "Unlike" : "Like"}
              style={{
                background: isLiked ? "rgba(225,48,108,0.13)" : "#23232a",
                borderColor: "#e1306c",
              }}
            >
              <svg
                className="like-heart"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{ transition: "color 0.2s" }}
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span className="action-label" style={{ color: "#fff" }}>
                Like
              </span>
              <span className="like-count">{likesCount}</span>
            </button>

            {isSpotifyPlaylist() && currentUser && (
              <button
                className="concept-action-btn fork-btn"
                onClick={handleFork}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 5C7 3.89543 7.89543 3 9 3C10.1046 3 11 3.89543 11 5C11 5.74028 10.5978 6.38663 10 6.73244V14.0396H11.7915C12.8961 14.0396 13.7915 13.1441 13.7915 12.0396V10.7838C13.1823 10.4411 12.7708 9.78837 12.7708 9.03955C12.7708 7.93498 13.6662 7.03955 14.7708 7.03955C15.8753 7.03955 16.7708 7.93498 16.7708 9.03955C16.7708 9.77123 16.3778 10.4111 15.7915 10.7598V12.0396C15.7915 14.2487 14.0006 16.0396 11.7915 16.0396H10V17.2676C10.5978 17.6134 11 18.2597 11 19C11 20.1046 10.1046 21 9 21C7.89543 21 7 20.1046 7 19C7 18.2597 7.4022 17.6134 8 17.2676V6.73244C7.4022 6.38663 7 5.74028 7 5Z"
                    fill="currentColor"
                  />
                </svg>
                <span className="action-label">Fork</span>
              </button>
            )}

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
      <ShareModal
        open={showShareModal}
        onClose={() => setShowShareModal(false)}
        onCopyLink={handleCopyLink}
        linkCopied={linkCopied}
        twitterUrl={twitterUrl}
        onRepost={handleRepost}
        repostDisabled={false}
      />

      {/* Post Options Modal */}
      <PostOptionsModal
        open={showPostModal}
        onClose={() => setShowPostModal(false)}
        onGoToPost={handleGoToPost}
        isOwner={isOwner}
        isDraft={post.status === "draft"}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onUnfollow={handleUnfollow}
      />

      {/* Edit Post Modal */}
      {showEditModal && (
        <EditPostModal
          post={post}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleEditSuccess}
        />
      )}

      {showForkModal && (
        <ForkPlaylistModal
          post={post}
          onClose={() => setShowForkModal(false)}
          onSuccess={handleForkSuccess}
        />
      )}
    </div>
  );
};
export default PostCard;