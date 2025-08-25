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
    profileImage: profile?.profileImage || '',
    wallpaperURL: profile?.wallpaperURL || '',
    showPosts: profile?.showPosts !== false, 
    showUsername: profile?.showUsername !== false, 
    showDateJoined: profile?.showDateJoined !== false, 
    showSpotifyStatus: profile?.showSpotifyStatus !== false 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingWallpaper, setUploadingWallpaper] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // drag drop state
  const [dragActiveProfile, setDragActiveProfile] = useState(false);
  const [dragActiveWallpaper, setDragActiveWallpaper] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
// allow drag drop files
  const handleImageUpload = async (file, type) => {
    if (!file) return;
    if (type === 'profile') setUploadingProfile(true);
    if (type === 'wallpaper') setUploadingWallpaper(true);
    setUploadProgress(0);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('type', type);
    try {
      const res = await axios.post(`${API_URL}/api/profile/upload`, formDataUpload, {
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        }
      });
      if (type === 'profile') {
        setFormData(prev => ({ ...prev, profileImage: res.data.url }));
      }
      if (type === 'wallpaper') {
        setFormData(prev => ({ ...prev, wallpaperURL: res.data.url }));
      }
    } catch (err) {
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingProfile(false);
      setUploadingWallpaper(false);
      setUploadProgress(0);
    }
  };

  const handleToggle = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.patch(`${API_URL}/api/profile/me`, {
        ...formData
      }, {
        withCredentials: true
      });
      onUpdate(response.data);
      window.location.reload(); 
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

  // Drag handlers for profile image
  const handleProfileDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActiveProfile(true);
    else if (e.type === 'dragleave') setDragActiveProfile(false);
  };
  const handleProfileDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveProfile(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0], 'profile');
    }
  };

  // Drag handlers for wallpaper image
  const handleWallpaperDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActiveWallpaper(true);
    else if (e.type === 'dragleave') setDragActiveWallpaper(false);
  };
  const handleWallpaperDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveWallpaper(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0], 'wallpaper');
    }
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
            <div 
              className={`profile-image-section${dragActiveProfile ? ' drag-active' : ''}`}
              onDragEnter={handleProfileDrag}
              onDragOver={handleProfileDrag}
              onDragLeave={handleProfileDrag}
              onDrop={handleProfileDrop}
            >
              <div className="current-image">
                {formData.profileImage ? (
                  <img src={formData.profileImage} alt="Profile" />
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
                  disabled={uploadingProfile}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => handleImageUpload(e.target.files[0], 'profile')}
                  disabled={uploadingProfile}
                  style={{ marginTop: 8 }}
                />
                {uploadingProfile && (
                  <div style={{ color: '#1db954', marginTop: 4 }}>Uploading... {uploadProgress}%</div>
                )}
                <p className="image-help">
                  Enter a URL, upload, or drag & drop an image for your profile picture.
                </p>
                {dragActiveProfile && (
                  <div className="drag-overlay">Drop image here</div>
                )}
              </div>
            </div>
          </div>

          {/* Wallpaper Section */}
          <div className="form-section">
            <label>Profile Cover Wallpaper</label>
            <div 
              className={`profile-image-section${dragActiveWallpaper ? ' drag-active' : ''}`}
              onDragEnter={handleWallpaperDrag}
              onDragOver={handleWallpaperDrag}
              onDragLeave={handleWallpaperDrag}
              onDrop={handleWallpaperDrop}
            >
              <div className="current-image">
                {formData.wallpaperURL ? (
                  <img src={formData.wallpaperURL} alt="Wallpaper Preview" style={{ borderRadius: 8, width: 80, height: 40, objectFit: 'cover' }} />
                ) : (
                  <span style={{ color: '#888', fontSize: 12 }}>No wallpaper</span>
                )}
              </div>
              <div className="image-input-section">
                <input
                  type="url"
                  name="wallpaperURL"
                  value={formData.wallpaperURL}
                  onChange={handleChange}
                  placeholder="Enter wallpaper image URL (optional)"
                  className="image-url-input"
                  disabled={uploadingWallpaper}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => handleImageUpload(e.target.files[0], 'wallpaper')}
                  disabled={uploadingWallpaper}
                  style={{ marginTop: 8 }}
                />
                {uploadingWallpaper && (
                  <div style={{ color: '#1db954', marginTop: 4 }}>Uploading... {uploadProgress}%</div>
                )}
                <p className="image-help">
                  Enter a URL, upload, or drag & drop an image for your profile cover wallpaper.
                </p>
                {dragActiveWallpaper && (
                  <div className="drag-overlay">Drop image here</div>
                )}
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

          {/* Visibility Settings Section */}
          <div className="form-section">
            <label>Profile Display Settings</label>
            <div className="visibility-options">
              <div className="visibility-option-container">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    id="showPosts"
                    name="showPosts"
                    checked={formData.showPosts}
                    onChange={handleToggle}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <label htmlFor="showPosts" className="toggle-label">Show Posts on Profile</label>
              </div>
              <div className="visibility-option-container">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    id="showUsername"
                    name="showUsername"
                    checked={formData.showUsername}
                    onChange={handleToggle}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <label htmlFor="showUsername" className="toggle-label">Show Username</label>
              </div>
              <div className="visibility-option-container">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    id="showDateJoined"
                    name="showDateJoined"
                    checked={formData.showDateJoined}
                    onChange={handleToggle}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <label htmlFor="showDateJoined" className="toggle-label">Show Date Joined</label>
              </div>
              <div className="visibility-option-container">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    id="showSpotifyStatus"
                    name="showSpotifyStatus"
                    checked={formData.showSpotifyStatus}
                    onChange={handleToggle}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <label htmlFor="showSpotifyStatus" className="toggle-label">Show Spotify Status</label>
              </div>
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