import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../shared';
import '../style/EditProfileModal.css';
import { Person, Close } from '@mui/icons-material';

const EditProfileModal = ({ profile, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    bio: profile?.bio || '',
    profileImage: profile?.profileImage || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.patch(`${API_URL}/api/profile/me`, formData, {
        withCredentials: true
      });

      onUpdate(response.data);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const getProfileImage = () => {
    return formData.profileImage || profile?.spotifyProfileImage || null;
  };

  return (
    <div className="modal-overlay">
      <div className="edit-profile-modal">
        <div className="modal-header">
          <h2>Edit Profile</h2>
          <button className="close-btn" onClick={onClose}>
            <Close />
          </button>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="edit-profile-form">
          {/* Profile Image Section */}
          <div className="form-section">
            <label>Profile Picture</label>
            <div className="profile-image-section">
              <div className="current-image">
                {getProfileImage() ? (
                  <img src={getProfileImage()} alt="Profile" />
                ) : (
                  <Person className="default-image-icon" />
                )}
              </div>
              <div className="image-input-section">
                <input
                  type="url"
                  name="profileImage"
                  value={formData.profileImage}
                  onChange={handleChange}
                  placeholder="Enter image URL"
                  className="image-url-input"
                />
                <p className="image-help">Enter a URL for your profile picture</p>
              </div>
            </div>
          </div>

          {/* Name Section */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Your first name"
                maxLength={50}
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Your last name"
                maxLength={50}
              />
            </div>
          </div>

          {/* Bio Section */}
          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell people about yourself and your music taste..."
              rows={4}
              maxLength={500}
            />
            <div className="char-count">
              {formData.bio.length}/500
            </div>
          </div>

          {/* Username Info */}
          <div className="form-group">
            <label>Username</label>
            <div className="username-display">
              <span>@{profile?.username}</span>
              <p className="username-help">Username cannot be changed</p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="save-btn"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;