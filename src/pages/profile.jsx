import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../shared";
import { useNavigate } from "react-router-dom";
import MiniDrawer from "../components/MiniDrawer";
import ProfileComponent from "../components/ProfileComponent";
import EditProfileModal from "../components/EditProfileModal";
import { saveTheme, loadTheme } from "../utils/themeManager";

const Profile = ({ user }) => {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [profileTheme, setProfileTheme] = useState('default');
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showStickerSelector, setShowStickerSelector] = useState(false);
  const [showMusicSelector, setShowMusicSelector] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchProfile();
    fetchUserPosts();
    fetchFollowersAndFollowing();
    loadUserTheme(); 
  }, [user, navigate]);

const fetchFollowersAndFollowing = async () => {
  try {
    const [followersRes, followingRes] = await Promise.all([
      axios.get(`${API_URL}/api/follow/me/followers`, { withCredentials: true }),
      axios.get(`${API_URL}/api/follow/me/following`, { withCredentials: true }),
    ]);
    setFollowers(followersRes.data.map(u => ({
      ...u,
      isFollowing: followingRes.data.some(f => f.username === u.username)
    })));
    setFollowing(followingRes.data.map(u => ({
      ...u,
      isFollowing: true
    })));
    setProfile(prev =>
      prev
        ? {
            ...prev,
            stats: {
              ...prev.stats,
              followers: followersRes.data.length,
              following: followingRes.data.length,
            },
          }
        : prev
    );
  } catch (error) {
    console.error("Error fetching followers/following:", error);
  }
};

  const loadUserTheme = async () => {
    if (!user) return;
    
    try {
      const savedTheme = await loadTheme();
      setProfileTheme(savedTheme);
    } catch (error) {
      console.error('Failed to load theme:', error);
      setProfileTheme('default');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showThemeSelector && !event.target.closest('.color-theme-selector')) {
        setShowThemeSelector(false);
      }
      if (showStickerSelector && !event.target.closest('.sticker-selector')) {
        setShowStickerSelector(false);
      }
      if (showMusicSelector && !event.target.closest('.music-selector-modal')) {
        setShowMusicSelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showThemeSelector, showStickerSelector, showMusicSelector]);

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

  const handleNavigateToCreatePost = () => {
    navigate('/social/mypost');
  };

  const handleShareProfile = () => {
    navigate(`/profile/${profile.username}`);
  };

  const handleThemeChange = async (newTheme) => {
    try {
      setProfileTheme(newTheme);
      setShowThemeSelector(false);
      
      const saveResult = await saveTheme(newTheme);
      
      if (!saveResult.success) {
        console.error('Failed to save theme to server:', saveResult.serverError);
      } else {
        console.log('Theme saved successfully:', saveResult.serverMessage);
      }
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  const toggleThemeSelector = () => {
    setShowThemeSelector(!showThemeSelector);
  };

  const toggleStickerSelector = () => {
    setShowStickerSelector(!showStickerSelector);
  };

  const handleStickerSelect = (sticker) => {
    console.log('Sticker selected:', sticker);
    // TODO: Add sticker to profile canvas
    setShowStickerSelector(false);
  };

  const handleSaveSpotifyItems = async (items) => {
    try {
      const response = await axios.patch(
        `${API_URL}/api/profile/spotify-items`,
        items,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      if (response.data && response.data.user) {
        setProfile(prev => ({ ...prev, spotifyItems: response.data.user.spotifyItems }));
      }
      setShowMusicSelector(false);
    } catch (error) {
      alert('Failed to save Spotify items.');
      console.error(error);
    }
  };
  const handleToggleMusicSelector = () => setShowMusicSelector(v => !v);

  if (loading) {
    return (
      <div className="dashboard-layout">
        <MiniDrawer />
        <div className="dashboard-main-content">
          <div className="profile-container">
            <div className="loading">
              Loading your profile...
            </div>
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
        <ProfileComponent
          profile={profile}
          posts={posts}
          postsLoading={postsLoading}
          isOwnProfile={true}
          onNavigateToCreatePost={handleNavigateToCreatePost}
          profileTheme={profileTheme}
          onEditProfile={() => setShowEditModal(true)}
          onShareProfile={handleShareProfile}
          onToggleTheme={toggleThemeSelector}
          onToggleStickers={toggleStickerSelector}
          showThemeSelector={showThemeSelector}
          showStickerSelector={showStickerSelector}
          onThemeChange={handleThemeChange}
          onStickerSelect={handleStickerSelect}
          showMusicSelector={showMusicSelector}
          onToggleMusicSelector={handleToggleMusicSelector}
          onSaveSpotifyItems={handleSaveSpotifyItems}
          followers={followers}
          following={following}
          onFollowChange={fetchFollowersAndFollowing}
        />

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
  );
};

export default Profile;