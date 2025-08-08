import React from "react";
import PostCard from "./PostCard";
import ColorThemeSelector from "./ColorThemeSelector";
import '../style/Profile.css';
import { colorThemes, getTheme } from '../utils/themeManager';
import { 
  Person, 
  CalendarToday,
  MusicNote,
  Edit,
  Visibility,
  Palette,
  Star
} from '@mui/icons-material';

const ProfileComponent = ({ 
  profile, 
  posts, 
  postsLoading, 
  isOwnProfile = false, 
  onNavigateToCreatePost,
  profileTheme = 'default',
  onEditProfile,
  onShareProfile,
  onToggleTheme,
  onToggleStickers,
  showThemeSelector,
  onThemeChange
}) => {
  
  const currentTheme = getTheme(profileTheme);

  const getDisplayName = () => {
    if (profile?.firstName && profile?.lastName) {
      return `${profile.firstName} ${profile.lastName}`;
    }
    return profile?.spotifyDisplayName || profile?.username || 'Unknown User';
  };

  const getProfileImage = () => {
    return profile?.profileImage || profile?.spotifyProfileImage || null;
  };

  const formatJoinDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  return (
    <div 
      className="profile-container"
      style={{
        background: currentTheme.cardBg,
        border: `1px solid ${currentTheme.border}`
      }}
    >
      {/* Profile Header */}
      <div className="profile-header">
        {/* Circular Action Buttons - Only for own profile */}
        {isOwnProfile && (
          <div className="profile-action-buttons">
            <button 
              className="circular-action-btn edit-btn"
              onClick={onEditProfile}
              data-tooltip="Edit Profile"
            >
              <Edit />
              <span className="btn-tooltip">Edit Profile</span>
            </button>
            <button 
              className="circular-action-btn share-btn"
              onClick={onShareProfile}
              data-tooltip="View Public Profile"
            >
              <Visibility />
              <span className="btn-tooltip">View Public Profile</span>
            </button>
            <button 
              className="circular-action-btn theme-btn"
              onClick={onToggleTheme}
              data-tooltip="Change Theme"
            >
              <Palette />
              <span className="btn-tooltip">Change Theme</span>
            </button>
            <button 
              className="circular-action-btn sticker-btn"
              onClick={onToggleStickers}
              data-tooltip="Add Stickers"
            >
              <Star />
              <span className="btn-tooltip">Add Stickers</span>
            </button>
          </div>
        )}

        <div 
          className="profile-cover"
          style={{
            background: currentTheme.gradient
          }}
        >
          <div className="profile-avatar-section">
            <div 
              className="profile-avatar"
              style={{
                border: `4px solid ${currentTheme.primary}`
              }}
            >
              {getProfileImage() ? (
                <img src={getProfileImage()} alt={getDisplayName()} />
              ) : (
                <Person 
                  className="default-avatar-icon"
                  style={{ color: currentTheme.primary }}
                />
              )}
            </div>
          </div>
        </div>

        <div 
          className="profile-info"
          style={{
            background: currentTheme.infoBg,
            color: currentTheme.textPrimary
          }}
        >
          <div className="profile-names">
            <h1 
              className="display-name"
              style={{ color: currentTheme.textPrimary }}
            >
              {getDisplayName()}
            </h1>
            <p 
              className="username"
              style={{ color: currentTheme.textSecondary }}
            >
              @{profile?.username}
            </p>
          </div>

          {profile?.bio && (
            <p 
              className="profile-bio"
              style={{ 
                color: currentTheme.textSecondary,
                background: currentTheme.statsBg,
                borderLeft: `4px solid ${currentTheme.primary}`
              }}
            >
              {profile.bio}
            </p>
          )}

          <div className="profile-meta">
            <div className="meta-item">
              <CalendarToday 
                className="meta-icon"
                style={{ color: currentTheme.primary }}
              />
              <span style={{ color: currentTheme.textSecondary }}>
                Joined {formatJoinDate(profile?.createdAt)}
              </span>
            </div>
            {profile?.spotifyDisplayName && (
              <div className="meta-item">
                <MusicNote 
                  className="meta-icon"
                  style={{ color: currentTheme.primary }}
                />
                <span style={{ color: currentTheme.textSecondary }}>
                  Connected to Spotify
                </span>
              </div>
            )}
          </div>

          {/* Stats */}
          <div 
            className="profile-stats"
            style={{
              background: currentTheme.statsBg,
              border: `1px solid ${currentTheme.border}`
            }}
          >
            <div className="stat-item">
              <span 
                className="stat-number"
                style={{ color: currentTheme.statsColor }}
              >
                {profile?.stats?.posts || 0}
              </span>
              <span 
                className="stat-label"
                style={{ color: currentTheme.textSecondary }}
              >
                Posts
              </span>
            </div>
            <div className="stat-item">
              <span 
                className="stat-number"
                style={{ color: currentTheme.statsColor }}
              >
                {profile?.stats?.following || 0}
              </span>
              <span 
                className="stat-label"
                style={{ color: currentTheme.textSecondary }}
              >
                Following
              </span>
            </div>
            <div className="stat-item">
              <span 
                className="stat-number"
                style={{ color: currentTheme.statsColor }}
              >
                {profile?.stats?.followers || 0}
              </span>
              <span 
                className="stat-label"
                style={{ color: currentTheme.textSecondary }}
              >
                Followers
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div 
        className="profile-posts"
        style={{
          background: currentTheme.postsBg,
          border: `1px solid ${currentTheme.border}`
        }}
      >
        <div className="posts-header">
          <h2 style={{ color: currentTheme.textPrimary }}>
            {isOwnProfile ? 'Your Posts' : `${getDisplayName()}'s Posts`}
          </h2>
          <p style={{ color: currentTheme.textSecondary }}>
            {posts?.length || 0} {posts?.length === 1 ? 'post' : 'posts'}
          </p>
        </div>

        {postsLoading ? (
          <div 
            className="posts-loading"
            style={{ color: currentTheme.textSecondary }}
          >
            Loading posts...
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="posts-grid">
            {posts.map(post => (
              <PostCard 
                key={post.id} 
                post={post}
                theme={currentTheme}
              />
            ))}
          </div>
        ) : (
          <div className="no-posts">
            <div className="no-posts-content">
              <MusicNote 
                className="no-posts-icon"
                style={{ color: currentTheme.primary }}
              />
              <h3 style={{ color: currentTheme.textPrimary }}>No posts yet</h3>
              <p style={{ color: currentTheme.textSecondary }}>
                {isOwnProfile 
                  ? "Share your first musical discovery with the world!" 
                  : "This user hasn't shared any posts yet."
                }
              </p>
              {isOwnProfile && (
                <button 
                  className="create-first-post-btn"
                  onClick={onNavigateToCreatePost}
                  style={{
                    background: currentTheme.buttonBg,
                    color: currentTheme.textPrimary,
                    border: `1px solid ${currentTheme.primary}`
                  }}
                  onMouseEnter={(e) => e.target.style.background = currentTheme.buttonHover}
                  onMouseLeave={(e) => e.target.style.background = currentTheme.buttonBg}
                >
                  Create Your First Post
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Theme Selector - Only for own profile */}
      {isOwnProfile && showThemeSelector && (
        <ColorThemeSelector
          currentTheme={profileTheme}
          onThemeChange={onThemeChange}
          isOpen={showThemeSelector}
          onToggle={onToggleTheme}
          hideToggleButton={true}
        />
      )}
    </div>
  );
};

export default ProfileComponent;
