import React, { useState, useEffect } from 'react';
import { X, Upload, Star, Image } from 'lucide-react';
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

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
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

      const response = await axios.post(`${API_URL}/api/stickers/upload`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setCustomStickers(prev => [...prev, response.data]);
      setActiveTab('custom');
    } catch (error) {
      console.error('Error uploading sticker:', error);
      
      const mockResponse = {
        id: `custom_${Date.now()}`,
        imageUrl: URL.createObjectURL(file),
        name: file.name.replace(/\.[^/.]+$/, "")
      };
      
      setCustomStickers(prev => [...prev, mockResponse]);
      setActiveTab('custom');
      
      alert('Upload failed, showing local preview only.');
    } finally {
      setUploadLoading(false);
      event.target.value = '';
    }
  };

  const handleStickerClick = (sticker) => {
    onStickerSelect(sticker);
    onClose();
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
                          src={sticker.url || sticker.imageUrl} 
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
                    <div className="upload-zone">
                      <input
                        type="file"
                        id="sticker-upload"
                        accept="image/*"
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
                        <small>PNG, JPG, GIF, WebP (Max 2MB)</small>
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
                            <img 
                              src={sticker.url || sticker.imageUrl} 
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
