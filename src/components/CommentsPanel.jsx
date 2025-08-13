import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { API_URL } from "../shared";
import "../style/CommentsPanel.css";

export default function CommentsPanel({ postId, open, onClose, currentUser }) {
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  const fetchComments = useCallback(async () => {
    if (!postId) return;
    try {
      setLoading(true);
      setError("");
      // Adjust to your API when ready: GET /api/posts/:id/comments
      const res = await axios.get(`${API_URL}/api/posts/${postId}/comments`, {
        withCredentials: true,
      });
      setComments(res.data || []);
    } catch (e) {
      // Graceful fallback if endpoint not ready
      setComments([]);
      if (e.response?.status !== 404) setError("Failed to load comments");
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    if (open) fetchComments();
  }, [open, fetchComments]);

  // Lock background scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !postId) return;
    try {
      setPosting(true);
      setError("");
      // Adjust to your API when ready: POST /api/posts/:id/comments
      const res = await axios.post(
        `${API_URL}/api/posts/${postId}/comments`,
        { content: input.trim() },
        { withCredentials: true }
      );
      const newComment = res.data || {
        id: Date.now(),
        authorName: currentUser?.name || "You",
        content: input.trim(),
        createdAt: new Date().toISOString(),
      };
      setComments((prev) => [newComment, ...prev]);
      setInput("");
    } catch (e) {
      setError("Failed to post comment");
    } finally {
      setPosting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="comments-panel-overlay" role="dialog" aria-modal="true">
      <div
        className="comments-panel"
        role="region"
        aria-label="Comments panel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="comments-panel-header">
          <h3 className="comments-panel-title">Comments</h3>
          <button
            className="comments-panel-close"
            aria-label="Close comments"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="comments-panel-body">
          {error && <div className="comments-panel-error">{error}</div>}
          {loading ? (
            <div className="comments-panel-empty">Loading comments…</div>
          ) : comments.length === 0 ? (
            <div className="comments-panel-empty">No comments yet.</div>
          ) : (
            <ul className="comments-list">
              {comments.map((c) => (
                <li key={c.id || c._id} className="comment-item">
                  <div className="comment-avatar">
                    {(c.authorName || "U").slice(0, 1).toUpperCase()}
                  </div>
                  <div className="comment-main">
                    <div className="comment-meta">
                      <span className="comment-author">
                        {c.authorName || "User"}
                      </span>
                      <span className="comment-dot">•</span>
                      <span className="comment-date">
                        {new Date(c.createdAt || Date.now()).toLocaleString()}
                      </span>
                    </div>
                    <p className="comment-content">{c.content}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <form className="comments-panel-composer" onSubmit={handleSubmit}>
          <input
            className="comments-input"
            type="text"
            placeholder="Write a comment…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={posting}
          />
          <button
            className="comments-send"
            type="submit"
            disabled={posting || !input.trim()}
          >
            {posting ? "Sending…" : "Send"}
          </button>
        </form>
      </div>

      {/* Click outside to close */}
      <button className="comments-panel-backdrop" onClick={onClose} aria-label="Close" />
    </div>
  );
}