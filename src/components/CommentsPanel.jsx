import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { API_URL } from "../shared";
import "../style/CommentsPanel.css";
import { socket } from "../ws";

function buildTree(list) {
  const byId = new Map();
  list.forEach((c) =>
    byId.set(c.id, {
      ...c,
      children: [],
      parentId: c.parent_id,
    })
  );

  const roots = [];
  byId.forEach((c) => {
    if (c.parentId) {
      const p = byId.get(c.parentId);
      if (p) p.children.push(c);
      else roots.push(c);
    } else {
      roots.push(c);
    }
  });

  const sortDesc = (a, b) =>
    new Date(b.created_at || b.createdAt) -
    new Date(a.created_at || a.createdAt);
  const sortDeep = (arr) =>
    arr.sort(sortDesc).forEach((n) => sortDeep(n.children));
  sortDeep(roots);
  return roots;
}

export default function CommentsPanel({
  postId,
  open,
  onClose,
  currentUser,
  postOwnerId,
}) {
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [expandedReplies, setExpandedReplies] = useState({});

  const fetchComments = useCallback(async () => {
    if (!postId) return;
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${API_URL}/api/posts/${postId}/comments`, {
        withCredentials: true,
      });
      setComments(res.data || []);
    } catch (e) {
      setComments([]);
      if (e.response?.status !== 404) setError("Failed to load comments");
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    if (open) fetchComments();
  }, [open, fetchComments]);

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
    const text = input.trim();
    if (!text) return;

    try {
      setPosting(true);
      setError("");

      const payload = {
        content: text,
        parentId: replyTo || null,
      };

      const res = await axios.post(
        `${API_URL}/api/posts/${postId}/comments`,
        payload,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const created = res.data;

      setComments((prev) => [created, ...prev]);
      setInput("");
      setReplyTo(null);

      // Emit live comment notification if not self-comment
      const ownerId = created.postOwnerId || postOwnerId;
      if (
        currentUser &&
        created &&
        created.author &&
        ownerId &&
        created.author.id !== ownerId
      ) {
        socket.emit("send_comment_notification", {
          postOwnerId: ownerId,
          commenterId: created.author.id,
          postId,
          commentText: created.content,
        });
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setError("You must be logged in to comment");
      } else {
        setError("Failed to post comment");
      }
    } finally {
      setPosting(false);
    }
  };

  const toggleReplies = (id) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (!open) return null;

  const tree = buildTree(comments);

  const CommentNode = ({ node, depth = 0 }) => {
    const hasReplies = node.children && node.children.length > 0;
    const expanded = expandedReplies[node.id] || false;

    return (
      <li className="comment-item" style={{ marginLeft: 0 }}>
        <div className="comment-avatar">
          {(node.author?.username || node.author?.spotifyDisplayName || "U")
            .slice(0, 1)
            .toUpperCase()}
        </div>
        <div className="comment-main">
          <div className="comment-meta">
            <span className="comment-author">
              {node.author?.username ||
                node.author?.spotifyDisplayName ||
                "User"}
            </span>
            <span className="comment-dot">•</span>
            <span className="comment-date">
              {new Date(node.created_at || node.createdAt).toLocaleString()}
            </span>
          </div>
          <p className="comment-content">{node.content}</p>
          <div className="comment-actions">
            <button
              className="comment-reply-btn"
              onClick={() => setReplyTo(node.id)}
            >
              Reply
            </button>
          </div>
          {hasReplies && (
            <button
              className="comment-toggle-replies-btn"
              onClick={() => toggleReplies(node.id)}
              aria-expanded={expanded}
              aria-controls={`replies-${node.id}`}
            >
              {expanded ? (
                <>
                  {/* Up chevron */}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    style={{ verticalAlign: "middle" }}
                  >
                    <path d="M7.41 15.41 12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
                  </svg>
                  Hide Replies ({node.children.length})
                </>
              ) : (
                <>
                  {/* Down chevron */}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    style={{ verticalAlign: "middle" }}
                  >
                    <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                  </svg>
                  View Replies ({node.children.length})
                </>
              )}
            </button>
          )}
          {hasReplies && expanded && (
            <ul className="comments-list" id={`replies-${node.id}`}>
              {node.children.map((child) => (
                <CommentNode key={child.id} node={child} depth={depth + 1} />
              ))}
            </ul>
          )}
        </div>
      </li>
    );
  };

  return (
    <div className="comments-panel-overlay" role="dialog" aria-modal="true">
      <div className="comments-panel" role="region" aria-label="Comments panel">
        <div className="comments-panel-header">
          <h3 className="comments-panel-title">Comments</h3>
          <button
            className="comments-panel-close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="comments-panel-body">
          {error && <div className="comments-panel-error">{error}</div>}
          {loading ? (
            <div className="comments-panel-empty">Loading comments…</div>
          ) : tree.length === 0 ? (
            <div className="comments-panel-empty">No comments yet.</div>
          ) : (
            <ul className="comments-list">
              {tree.map((node) => (
                <CommentNode key={node.id} node={node} />
              ))}
            </ul>
          )}
        </div>

        <form className="comments-panel-composer" onSubmit={handleSubmit}>
          {replyTo && (
            <div className="replying-indicator">
              Replying to&nbsp;
              <strong>
                {(() => {
                  const replyComment = comments.find((c) => c.id === replyTo);
                  return (
                    replyComment?.author?.username ||
                    replyComment?.author?.spotifyDisplayName ||
                    "User"
                  );
                })()}
              </strong>
              <button
                type="button"
                className="clear-reply"
                onClick={() => setReplyTo(null)}
              >
                Cancel
              </button>
            </div>
          )}
          <input
            className="comments-input"
            type="text"
            placeholder={replyTo ? "Write a reply…" : "Write a comment…"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={posting}
            autoFocus={open}
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
    </div>
  );
}
