import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../shared";
import { useNavigate } from "react-router-dom";
import MiniDrawer from "../components/MiniDrawer";
import ProfileComponent from "../components/ProfileComponent";
import EditProfileModal from "../components/EditProfileModal";
import ColorThemeSelector from "../components/ColorThemeSelector";
import { saveTheme, loadTheme } from "../utils/themeManager";
import { Edit, Visibility } from '@mui/icons-material';

const Profile = ({ user }) => {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [profileTheme, setProfileTheme] = useState('default');
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchProfile();
    fetchUserPosts();
    loadUserTheme(); 
  }, [user, navigate]);

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

  // Close theme selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showThemeSelector && !event.target.closest('.color-theme-selector')) {
        setShowThemeSelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showThemeSelector]);

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
    // Navigate to public profile page
    navigate(`/profile/${profile.username}`);
  };

  const handleThemeChange = async (newTheme) => {
    try {
      setProfileTheme(newTheme);
      setShowThemeSelector(false);
      
      // save theme to backend
      const saveResult = await saveTheme(newTheme);
      
      if (!saveResult.success) {
        console.error('Failed to save theme to server:', saveResult.serverError);
      } else {
        console.log('Theme saved successfully:', saveResult.serverMessage);
        // You could show a success toast here
      }
    } catch (error) {
      console.error('Failed to save theme:', error);
      // Optionally revert UI or show error message
    }
  };

  const toggleThemeSelector = () => {
    setShowThemeSelector(!showThemeSelector);
  };

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
        {/* Profile Action Buttons - Outside of ProfileComponent */}
        <div className="profile-actions-header">
          <button 
            className="edit-profile-btn"
            onClick={() => setShowEditModal(true)}
          >
            <Edit />
            Edit Profile
          </button>
          <button 
            className="share-profile-btn"
            onClick={handleShareProfile}
          >
            <Visibility />
            View Public Profile
          </button>
          <ColorThemeSelector
            currentTheme={profileTheme}
            onThemeChange={handleThemeChange}
            isOpen={showThemeSelector}
            onToggle={toggleThemeSelector}
          />
        </div>

        <ProfileComponent
          profile={profile}
          posts={posts}
          postsLoading={postsLoading}
          isOwnProfile={true}
          onNavigateToCreatePost={handleNavigateToCreatePost}
          profileTheme={profileTheme}
        />

        {/* Edit Profile Modal */}
        {showEditModal && (
          <EditProfileModal
            profile={profile}
            onClose={() => setShowEditModal(false)}
            onUpdate={handleProfileUpdate}
          />
        )}

        {/* Theme Selectorconditionally rendered */}
        {showThemeSelector && (
          <ColorThemeSelector
            currentTheme={profileTheme}
            onThemeChange={handleThemeChange}
            onClose={() => setShowThemeSelector(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;