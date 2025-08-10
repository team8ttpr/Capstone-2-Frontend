import React, { useState, useEffect } from 'react';
import { X, Upload, Star, Image, Scissors, Trash2 } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../shared';
import '../style/StickerSelector.css';

const StickerSelector = ({ 
  isOpen, 
  onClose, 
  onStickerSelect 
}) => {
  const [presetStickers, setPresetStickers] = useState([]);
  const [customStickers, setCustomStickers] = useState([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [presetsLoading, setPresetsLoading] = useState(false);
  const [customLoading, setCustomLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('preset');
  const [bgRemoval, setBgRemoval] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchPresetStickers();
      fetchCustomStickers();
    }
  }, [isOpen]);

  const fetchPresetStickers = async () => {
    try {
      setPresetsLoading(true);
      const response = await axios.get(`${API_URL}/api/stickers/presets`, {
        withCredentials: true
      });
      setPresetStickers(response.data);
    } catch (error) {
      console.error('Failed to load preset stickers:', error.message);
      setPresetStickers([]);
    } finally {
      setPresetsLoading(false);
    }
  };

  const fetchCustomStickers = async () => {
    try {
      setCustomLoading(true);
      const response = await axios.get(`${API_URL}/api/stickers/custom`, {
        withCredentials: true
      });
      setCustomStickers(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        // Custom stickers endpoint not available - using empty array
      } else {
        console.error('Error fetching custom stickers:', error.message);
      }
      setCustomStickers([]);
    } finally {
      setCustomLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Updated file type validation for more formats
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 
      'image/webp', 'image/svg+xml', 'image/x-icon', 
      'image/vnd.microsoft.icon'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, JPG, PNG, GIF, WEBP, SVG, ICO)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }

    setUploadLoading(true);

    try {
      const formData = new FormData();
      formData.append('sticker', file);

      // choose endpoint based on background removal toggle (bgRemoval vs normal)
      const endpoint = bgRemoval ? 
        `${API_URL}/api/stickers/upload-with-bg-removal` : 
        `${API_URL}/api/stickers/upload`;

      const response = await axios.post(endpoint, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Wait 4 seconds before refreshing to allow Cloudinary to finish background removal (bug fix)
      setTimeout(() => {
        fetchCustomStickers();
        setActiveTab('custom');
      }, 4000);
    } catch (error) {
      console.error('Error uploading sticker:', error);
      console.error('Response data:', error.response?.data);
      console.error('Status code:', error.response?.status);
      
      const mockResponse = {
        id: `custom_${Date.now()}`,
        imageUrl: URL.createObjectURL(file),
        name: file.name.replace(/\.[^/.]+$/, "")
      };
      
      setCustomStickers(prev => [...prev, mockResponse]);
      setActiveTab('custom');
      
      // Show more specific error message
      const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
      alert(`Upload failed: ${errorMsg}\nShowing local preview only.`);
    } finally {
      setUploadLoading(false);
      event.target.value = '';
    }
  };

  const handleStickerClick = (sticker) => {
    onStickerSelect(sticker);
    onClose();
  };

  const handleDeleteSticker = async (sticker, event) => {
    event.stopPropagation(); // prevent sticker selection when clicking delete
    
    if (!confirm(`Delete "${sticker.name || 'this sticker'}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/stickers/${sticker.id}`, {
        withCredentials: true
      });
      
      // Remove from local state immediately for better UX
      setCustomStickers(prev => prev.filter(s => s.id !== sticker.id));
      
    } catch (error) {
      console.error('Error deleting sticker:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Delete failed';
      alert(`Delete error: ${errorMsg}`);
      
      // Refresh to ensure state consistency if delete failed
      await fetchCustomStickers();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="sticker-selector">
      <div className="sticker-dropdown">
          <div className="sticker-dropdown-header">
            <h3>Add Stickers</h3>
            <button className="close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <div className="sticker-tabs">
            <button
              className={`tab-btn ${activeTab === 'preset' ? 'active' : ''}`}
              onClick={() => setActiveTab('preset')}
            >
              <Star size={16} />
              Preset Stickers
            </button>
            <button
              className={`tab-btn ${activeTab === 'custom' ? 'active' : ''}`}
              onClick={() => setActiveTab('custom')}
            >
              <Image size={16} />
              Custom ({customStickers.length})
            </button>
          </div>

          <div className="sticker-content">
            {activeTab === 'preset' && (
              <div>
                {presetsLoading ? (
                  <div className="loading-state">
                    <Star size={48} />
                    <p>Loading preset stickers...</p>
                  </div>
                ) : presetStickers.length > 0 ? (
                  <div className="sticker-grid">
                    {presetStickers.map(sticker => (
                      <div
                        key={sticker.id}
                        className="sticker-item"
                        onClick={() => handleStickerClick(sticker)}
                      >
                        <img 
                          src={(sticker.url || sticker.imageUrl) + `?v=${sticker.updatedAt || Date.now()}`}
                          alt="Sticker"
                          style={{ 
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                            borderRadius: '8px'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <Star size={48} />
                    <p>No preset stickers available</p>
                    <p>Check back later for new stickers!</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'custom' && (
              <div>
                {customLoading ? (
                  <div className="loading-state">
                    <Image size={48} />
                    <p>Loading custom stickers...</p>
                  </div>
                ) : (
                  <>
                    <div className="upload-options">
                      <div className="bg-removal-toggle">
                        <label className="toggle-label">
                          <input
                            type="checkbox"
                            checked={bgRemoval}
                            onChange={(e) => setBgRemoval(e.target.checked)}
                            className="toggle-checkbox"
                          />
                          <span className="toggle-slider"></span>
                          <span className="toggle-text">
                            <Scissors size={16} />
                            AI Background Removal
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="upload-zone">
                      <input
                        type="file"
                        id="sticker-upload"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml,image/x-icon,image/vnd.microsoft.icon"
                        onChange={handleFileUpload}
                        disabled={uploadLoading}
                        style={{ display: 'none' }}
                      />
                      <label 
                        htmlFor="sticker-upload"
                        className={`upload-label ${uploadLoading ? 'disabled' : ''}`}
                      >
                        <Upload size={32} />
                        <span>
                          {uploadLoading ? 'Uploading...' : 'Click to upload a custom sticker'}
                        </span>
                        <small>JPEG, JPG, PNG, GIF, WEBP, SVG, ICO (Max 2MB)</small>
                        {bgRemoval && (
                          <small className="bg-removal-note">
                            ✨ AI will automatically remove the background
                          </small>
                        )}
                      </label>
                    </div>

                    {customStickers.length > 0 && (
                      <div className="sticker-grid">
                        {customStickers.map(sticker => (
                          <div
                            key={sticker.id}
                            className="sticker-item"
                            onClick={() => handleStickerClick(sticker)}
                          >
                            <button
                              className="delete-btn"
                              onClick={(e) => handleDeleteSticker(sticker, e)}
                              title="Delete sticker"
                            >
                              <Trash2 size={12} />
                            </button>
                            <img 
                              src={(sticker.url || sticker.imageUrl) + `?v=${sticker.updatedAt || Date.now()}`}
                              alt="Custom sticker"
                              style={{ 
                                width: '60px',
                                height: '60px',
                                objectFit: 'cover',
                                borderRadius: '8px'
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {customStickers.length === 0 && !uploadLoading && !customLoading && (
                      <div className="empty-state">
                        <Image size={48} />
                        <p>No custom stickers available yet</p>
                        <p>Upload your first custom sticker to get started!</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
      </div>
    </div>
  );
};

export default StickerSelector;
