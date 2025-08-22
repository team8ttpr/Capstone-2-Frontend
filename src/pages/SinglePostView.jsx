import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/SinglePostView.css";
import { API_URL } from "../shared";
import CommentsPanel from "../components/CommentsPanel";
import MiniDrawer from "../components/MiniDrawer";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import ForkPlaylistModal from "../components/ForkPlaylistModal";

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

const SinglePostView = ({ user }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [likeBusy, setLikeBusy] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [forkBusy, setForkBusy] = useState(false);
  const [originalPosterUsername, setOriginalPosterUsername] = useState(null);
  const [showForkModal, setShowForkModal] = useState(false);

  const postUrl = `${window.location.origin}/post/${id}`;

  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("commentsOpen") === "1") {
      setCommentsOpen(true);
    }
  }, [location.search]);
  
  useEffect(() => {
    if (id) fetchPost();
  }, [id]);

  useEffect(() => {
    if (post?.original_post_id) {
      axios
        .get(`${API_URL}/api/posts/${post.original_post_id}`, {
          withCredentials: true,
        })
        .then((res) => {
          setOriginalPosterUsername(res.data?.author?.username || null);
        })
        .catch(() => setOriginalPosterUsername(null));
    }
  }, [post, API_URL]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${API_URL}/api/posts/${id}`, {
        withCredentials: true,
      });
      const p = res.data;
      console.log("Fetched post:", p);
      setPost(p);
      setLikesCount(Number(p?.likesCount ?? 0));
      setIsLiked(Boolean(p?.isLiked));
    } catch (error) {
      setError("Failed to load post.");
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (likeBusy) return;
    setLikeBusy(true);
    try {
      const res = await axios.post(
        `${API_URL}/api/posts/${id}/like`,
        {},
        { withCredentials: true }
      );
      const data = res.data || {};
      if (typeof data.isLiked === "boolean") setIsLiked(data.isLiked);
      if (typeof data.likesCount === "number") setLikesCount(data.likesCount);
      if (data.isLiked === undefined && data.likesCount === undefined) {
        setIsLiked((v) => !v);
        setLikesCount((c) => (isLiked ? Math.max(0, c - 1) : c + 1));
      }
    } catch (e) {
      // ignore
    } finally {
      setLikeBusy(false);
    }
  };

  const openShare = () => setShareOpen(true);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(postUrl).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    });
  };

  const handleRepost = async () => {
    if (!user) return;
    setForkBusy(true);
    try {
      await axios.post(
        `${API_URL}/api/posts/${post.id}/repost`,
        {},
        { withCredentials: true }
      );
      setShareOpen(false);
      fetchPost();
    } catch (e) {
      alert("Failed to repost.");
    } finally {
      setForkBusy(false);
    }
  };

  const handleFork = async () => {
    if (!user) return;
    setForkBusy(true);
    try {
      await axios.post(
        `${API_URL}/api/posts/${post.id}/fork`,
        {},
        { withCredentials: true }
      );
      fetchPost();
    } catch (e) {
      alert("Failed to fork playlist.");
    } finally {
      setForkBusy(false);
    }
  };

  if (loading) return <div className="loading-screen">Loading post...</div>;
  if (error) return <div className="error-screen">Error: {error}</div>;
  if (!post) return <div className="not-found-screen">Post not found</div>;

  const handleAuthorClick = () => {
    if (post.author?.username) {
      navigate(`/profile/${post.author.username}`);
    }
  };

  const isSpotifyPlaylist = () => {
    const isPlaylist =
      (post.spotifyType && post.spotifyType.toLowerCase() === "playlist") ||
      (post.spotifyEmbedUrl && post.spotifyEmbedUrl.includes("/playlist/"));
    return isPlaylist;
  };

  const shareText = encodeURIComponent(
    `${post.title ? post.title + " - " : ""}Check out this post on Capstone-2!`
  );
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
    postUrl
  )}&text=${shareText}`;

  return (
    <div className="single-post-root">
      <MiniDrawer menuType="social" />
      {/* Comments Panel */}
      <div
        className={
          commentsOpen ? "comments-panel-animate" : "comments-panel-hidden"
        }
      >
        <CommentsPanel
          postId={post?.id || post?._id}
          open={commentsOpen}
          onClose={() => setCommentsOpen(false)}
          currentUser={user}
        />
      </div>
      <div className={`fullscreen-post${commentsOpen ? " comments-open" : ""}`}>
        {/* Header */}
        <header className="post-header">
          <div className="user-info">
            <img
              src={getProfileImage(post.author)}
              alt="Profile"
              className="profile-image"
              onClick={handleAuthorClick}
            />
            <div className="user-meta">
              <span className="username" onClick={handleAuthorClick}>
                {post.author?.username}
              </span>
              <span className="post-date">
                {new Date(post.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="post-content">
          <div className="title-section">
            <h1 className="post-title">{post.title}</h1>
            <span className="post-status">{post.status}</span>
          </div>

          <div className="content-row">
            <div className="description-section">
              <p className="post-description">{post.description}</p>
              {post.original_post_id && originalPosterUsername && (
                <button
                  className="original-poster-btn"
                  onClick={() => navigate(`/profile/${originalPosterUsername}`)}
                >
                  View Original Poster: @{originalPosterUsername}
                </button>
              )}
              <div className="track-info">
                {post.artists && (
                  <span className="artists">{post.artists}</span>
                )}
                {post.duration && (
                  <span className="duration">{post.duration}</span>
                )}
              </div>
            </div>

            {post.spotifyEmbedUrl && (
              <div className="spotify-embed-large">
                <iframe
                  src={post.spotifyEmbedUrl.replace("embed/", "embed/")}
                  width="100%"
                  height="152"
                  allowtransparency="true"
                  allow="encrypted-media"
                  title={`Spotify ${post.spotifyType}: ${post.title}`}
                  style={{
                    border: "none",
                    borderRadius: "16px",
                    background: "#23232a",
                  }}
                />
              </div>
            )}
          </div>
        </main>

        {/* Footer Actions */}
        <footer className="post-actions">
          <button
            className="concept-action-btn comment-btn"
            onClick={() => setCommentsOpen(true)}
            aria-label="Open comments"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h11c.55 0 1-.45 1-1z" />
            </svg>
            <span className="action-label" style={{ color: "#fff" }}>
              Comment
            </span>
          </button>

          <button
            className={`concept-action-btn like-btn${isLiked ? " liked" : ""}`}
            onClick={toggleLike}
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
              style={{ transition: "fill 0.2s" }}
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span className="action-label" style={{ color: "#fff" }}>
              Like
            </span>
            <span className="like-count">{likesCount}</span>
          </button>

          {isSpotifyPlaylist() && user && (
            <button
              className="concept-action-btn fork-btn"
              onClick={() => setShowForkModal(true)}
              aria-label="Fork playlist"
              title="Fork playlist"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
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
            onClick={openShare}
            aria-label="Share"
            title="Share"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z" />
            </svg>
            <span className="action-label" style={{ color: "#fff" }}>
              Share
            </span>
          </button>
        </footer>
      </div>

      {/* Share/Repost Modal */}
      {shareOpen && (
        <div className="modal-overlay" onClick={() => setShareOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Share Post</h3>
              <button
                className="close-modal-btn"
                onClick={() => setShareOpen(false)}
                aria-label="Close"
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

              <a
                className="modal-option"
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div
                  className="option-icon"
                  style={{ color: "#1da1f2", borderColor: "#1da1f2" }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22.46 5.924c-.793.352-1.646.59-2.542.697a4.48 4.48 0 0 0 1.964-2.475 8.94 8.94 0 0 1-2.828 1.082A4.48 4.48 0 0 0 16.11 4c-2.488 0-4.505 2.017-4.505 4.505 0 .353.04.698.117 1.028C7.728 9.37 4.1 7.548 1.671 4.905a4.48 4.48 0 0 0-.609 2.267c0 1.563.796 2.942 2.008 3.753a4.48 4.48 0 0 1-2.04-.564v.057c0 2.184 1.553 4.006 3.617 4.422a4.48 4.48 0 0 1-2.035.077c.574 1.793 2.24 3.098 4.215 3.133A8.99 8.99 0 0 1 2 19.54a12.7 12.7 0 0 0 6.88 2.017c8.26 0 12.785-6.842 12.785-12.785 0-.195-.004-.39-.013-.583A9.13 9.13 0 0 0 24 4.59a8.97 8.97 0 0 1-2.54.697z" />
                  </svg>
                </div>
                <div className="option-details">
                  <h4>Share to Twitter</h4>
                  <p>Open Twitter to share this post</p>
                </div>
              </a>
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
                  <p>Repost to your account</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
      {showForkModal && (
        <ForkPlaylistModal
          post={post}
          onClose={() => setShowForkModal(false)}
          onSuccess={() => {
            setShowForkModal(false);
            fetchPost();
          }}
        />
      )}
    </div>
  );
};

export default SinglePostView;
