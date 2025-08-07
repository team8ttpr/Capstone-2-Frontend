import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../shared";
import { useNavigate } from "react-router-dom";
import MiniDrawer from "../components/MiniDrawer";
import PostCard from "../components/PostCard";
import EditProfileModal from "../components/EditProfileModal";
import '../style/Profile.css';
import { 
  Person, 
  Edit, 
  LocationOn, 
  CalendarToday,
  MusicNote
} from '@mui/icons-material';

const Profile = ({ user }) => {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchProfile();
    fetchUserPosts();
  }, [user, navigate]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get(`${API_URL}/api/profile/me`, {
        withCredentials: true
      });

      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response?.status === 401) {
        navigate('/auth');
        return;
      }
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      setPostsLoading(true);
      
      const response = await axios.get(`${API_URL}/api/profile/me/posts`, {
        withCredentials: true
      });

      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    } finally {
      setPostsLoading(false);
    }
  };

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(prev => ({ ...prev, ...updatedProfile }));
    setShowEditModal(false);
  };

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

  if (loading) {
    return (
      <div className="dashboard-layout">
        <MiniDrawer />
        <div className="dashboard-main-content">
          <div className="profile-container">
            <div className="loading">Loading your profile...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-layout">
        <MiniDrawer />
        <div className="dashboard-main-content">
          <div className="profile-container">
            <div className="error-message">
              <p>{error}</p>
              <button onClick={fetchProfile} className="retry-btn">
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <MiniDrawer />
      <div className="dashboard-main-content">
        <div className="profile-container">
          {/* Profile Header */}
          <div className="profile-header">
            <div className="profile-cover">
              <div className="profile-avatar-section">
                <div className="profile-avatar">
                  {getProfileImage() ? (
                    <img src={getProfileImage()} alt={getDisplayName()} />
                  ) : (
                    <Person className="default-avatar-icon" />
                  )}
                </div>
                <button 
                  className="edit-profile-btn"
                  onClick={() => setShowEditModal(true)}
                >
                  <Edit />
                  Edit Profile
                </button>
              </div>
            </div>

            <div className="profile-info">
              <div className="profile-names">
                <h1 className="display-name">{getDisplayName()}</h1>
                <p className="username">@{profile?.username}</p>
              </div>

              {profile?.bio && (
                <p className="profile-bio">{profile.bio}</p>
              )}

              <div className="profile-meta">
                <div className="meta-item">
                  <CalendarToday className="meta-icon" />
                  <span>Joined {formatJoinDate(profile?.createdAt)}</span>
                </div>
                {profile?.spotifyDisplayName && (
                  <div className="meta-item">
                    <MusicNote className="meta-icon" />
                    <span>Connected to Spotify</span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-number">{profile?.stats?.posts || 0}</span>
                  <span className="stat-label">Posts</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{profile?.stats?.following || 0}</span>
                  <span className="stat-label">Following</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{profile?.stats?.followers || 0}</span>
                  <span className="stat-label">Followers</span>
                </div>
              </div>
            </div>
          </div>

          {/* Posts Section */}
          <div className="profile-posts">
            <div className="posts-header">
              <h2>Your Posts</h2>
              <p>{posts.length} {posts.length === 1 ? 'post' : 'posts'}</p>
            </div>

            {postsLoading ? (
              <div className="posts-loading">Loading posts...</div>
            ) : posts.length > 0 ? (
              <div className="posts-grid">
                {posts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="no-posts">
                <div className="no-posts-content">
                  <MusicNote className="no-posts-icon" />
                  <h3>No posts yet</h3>
                  <p>Share your first musical discovery with the world!</p>
                  <button 
                    className="create-first-post-btn"
                    onClick={() => navigate('/social/mypost')}
                  >
                    Create Your First Post
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Edit Profile Modal */}
          {showEditModal && (
            <EditProfileModal
              profile={profile}
              onClose={() => setShowEditModal(false)}
              onUpdate={handleProfileUpdate}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;