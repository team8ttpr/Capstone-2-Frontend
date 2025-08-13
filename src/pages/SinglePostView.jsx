import "../style/SinglePostView.css";
import "../style/PostCard.css"; 
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../shared";
import { useNavigate, useParams } from "react-router-dom";
import CommentsPanel from "../components/CommentsPanel";

const SinglePostView = ({ user }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeBusy, setLikeBusy] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const postUrl = `${window.location.origin}/post/${id}`;

  useEffect(() => {
    if (id) fetchPost();
  }, [id]);

const fetchPost = async () => {
  try {
    setLoading(true);
    setError(null);
    const res = await axios.get(`${API_URL}/api/posts/${id}`, {
      withCredentials: true,
    });
    const p = res.data;
    setPost(p);
    setLikes(Number(p?.likesCount ?? 0));
    setLiked(Boolean(p?.isLiked ?? false));
  } catch (error) {
    console.error('Error fetching post:', error);
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
      if (typeof data.isLiked === "boolean") setLiked(data.isLiked);
      if (typeof data.likesCount === "number") setLikes(data.likesCount);
      if (data.isLiked === undefined && data.likesCount === undefined) {
        setLiked((v) => !v);
        setLikes((c) => (liked ? Math.max(0, c - 1) : c + 1));
      }
    } catch (e) {
      console.error("Failed to toggle like", e);
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
  const handleRepost = () => {
    setShareOpen(false);
  };

  if (loading) return <div className="loading-screen">Loading post...</div>;
  if (error) return <div className="error-screen">Error: {error}</div>;
  if (!post) return <div className="not-found-screen">Post not found</div>;

  return (
    <>
      <div className="fullscreen-post">
        {/* Header */}
        <header className="post-header">
          <div className="user-info">
            <img
              src={post.author?.spotifyProfileImage}
              alt="Profile"
              className="profile-image"
              onClick={() =>
                navigate(`/profile/${post.author?.id || post.author?._id}`)
              }
            />
            <div className="user-meta">
              <span className="username">{post.author?.username}</span>
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
              <div className="track-info">
                <span className="views">4K</span>
                <p className="artists">{post.artists}</p>
                <p className="duration">{post.duration}</p>
              </div>
            </div>

            <div className="spotify-embed">
              <iframe
                src={post.spotifyEmbedUrl}
                width="100%"
                height="80"
                allowtransparency="true"
                allow="encrypted-media"
                title={`Spotify ${post.spotifyType}: ${post.title}`}
              />
            </div>
          </div>
        </main>

        {/* Footer Actions */}
        <footer className="post-actions">
          <button
            className="action-btn"
            onClick={() => setCommentsOpen(true)}
            aria-label="Open comments"
          >
            <span className="action-icon">💬</span> Comment
          </button>

          <button
            className="action-btn"
            onClick={toggleLike}
            disabled={likeBusy}
            aria-pressed={liked}
            aria-label={liked ? "Unlike" : "Like"}
            title={liked ? "Unlike" : "Like"}
          >
            <span className="action-icon" aria-hidden="true">
              {liked ? "❤️" : "🤍"}
            </span>
            {likes} {likes === 1 ? "Like" : "Likes"}
          </button>

          <button
            className="action-btn"
            onClick={openShare}
            aria-label="Share"
            title="Share"
          >
            <span className="action-icon">↗️</span> Share
          </button>
        </footer>
      </div>

      {/* Slide-in Comments Panel */}
      <CommentsPanel
        postId={post?.id || post?._id}
        open={commentsOpen}
        onClose={() => setCommentsOpen(false)}
        currentUser={user}
      />

      {/* Share modal (identical structure/styles to PostCard) */}
      {shareOpen && (
        <div
          className="modal-overlay"
          onClick={() => setShareOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
            role="region"
            aria-label="Share post"
          >
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
    </>
  );
};

export default SinglePostView;