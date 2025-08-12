import React from 'react';
import PostCard from './PostCard';
import '../style/EditProfileModal.css'; 

const UserPostsModal = ({ open, onClose, posts, theme }) => {
  if (!open) return null;
  return (
    <div className="modal-overlay" style={{ zIndex: 2000, background: theme.overlayBg || 'rgba(0,0,0,0.8)' }}>
      <div 
        className="user-posts-modal"
        style={{
          background: theme.cardBg,
          color: theme.textPrimary,
          border: `1px solid ${theme.border}`,
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
        }}
      >
        <div className="modal-header" style={{ background: theme.cardBg, borderBottom: `1px solid ${theme.border}` }}>
          <h2 style={{ color: theme.textPrimary }}>All Posts</h2>
          <button className="close-btn" onClick={onClose} style={{ color: theme.textSecondary }}>×</button>
        </div>
        <div className="user-posts-list" style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '2rem 0' }}>
          {posts && posts.length > 0 ? (
            posts.map(post => (
              <div
                key={post.id}
                style={{
                  background: theme.cardBg,
                  borderRadius: 16,
                  width: '100%',
                  maxWidth: 600,
                  margin: '0 auto',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
                  border: `1px solid ${theme.border}`
                }}
              >
                <PostCard post={post} theme={theme} fullWidth />
              </div>
            ))
          ) : (
            <div style={{ color: theme.textSecondary, textAlign: 'center', marginTop: 40 }}>No posts found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPostsModal;
