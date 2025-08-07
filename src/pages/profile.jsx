import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../shared.js";
import "../style/Profile.css";

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/user/profile`, {
        withCredentials: true
      });
      setUserProfile(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setError("Failed to load user profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-summary">
        <div className="profile-loading">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-summary">
        <div className="profile-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-summary">
      <div className="profile-container">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {userProfile?.profilePicture ? (
                <img src={userProfile.profilePicture} alt="Profile" />
              ) : (
                <div className="avatar-placeholder">
                  {userProfile?.username?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <div className="profile-info">
              <h2>{userProfile?.spotifyUsername || userProfile?.username || 'Unknown User'}</h2>
              <p className="profile-email">{userProfile?.email}</p>
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-value">{userProfile?.postsCount || 0}</span>
              <span className="stat-label">Posts</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{userProfile?.followingCount || 0}</span>
              <span className="stat-label">Following</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{userProfile?.followersCount || 0}</span>
              <span className="stat-label">Followers</span>
            </div>
          </div>

          <div className="profile-bio">
            <h3>Bio</h3>
            <p>{userProfile?.bio || 'No bio available'}</p>
          </div>

          <div className="profile-actions">
            <button className="edit-profile-btn">Edit Profile</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;