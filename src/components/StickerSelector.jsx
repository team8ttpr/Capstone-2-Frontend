import React, { useState, useEffect } from 'react';
import { X, Upload, Star, Image } from 'lucide-react';
import '../style/StickerSelector.css';

const StickerSelector = ({ 
  isOpen, 
  onClose, 
  onStickerSelect 
}) => {
  const [presetStickers, setPresetStickers] = useState([]);
  const [userStickers, setUserStickers] = useState([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('preset');

  useEffect(() => {
    if (isOpen) {
      fetchPresetStickers();
      fetchUserStickers();
    }
  }, [isOpen]);

  const fetchPresetStickers = async () => {
    try {
      const mockPresetStickers = [
        // Mock data for preset stickers
        { id: 'preset_1', imageUrl: '/stickers/star.png', name: 'Star' },
        { id: 'preset_2', imageUrl: '/stickers/heart.png', name: 'Heart' },
        { id: 'preset_3', imageUrl: '/stickers/thumbsup.png', name: 'Thumbs Up' },
        { id: 'preset_4', imageUrl: '/stickers/fire.png', name: 'Fire' },
        { id: 'preset_5', imageUrl: '/stickers/smile.png', name: 'Smile' },
      ];
      setPresetStickers(mockPresetStickers);
    } catch (error) {
      console.error('Error fetching preset stickers:', error);
    }
  };

  const fetchUserStickers = async () => {
    try {
      setUserStickers([]);
    } catch (error) {
      console.error('Error fetching user stickers:', error);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (PNG, JPG, JPEG, GIF, WebP)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }

    setUploadLoading(true);

    try {
      const mockResponse = {
        id: `custom_${Date.now()}`,
        imageUrl: URL.createObjectURL(file),
        name: file.name
      };

      setUserStickers(prev => [...prev, mockResponse]);
      setActiveTab('uploads');
    } catch (error) {
      console.error('Error uploading sticker:', error);
      alert('Failed to upload sticker. Please try again.');
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
    <div className="sticker-selector">        <div className="sticker-dropdown">
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
              className={`tab-btn ${activeTab === 'uploads' ? 'active' : ''}`}
              onClick={() => setActiveTab('uploads')}
            >
              <Image size={16} />
              My Uploads ({userStickers.length})
            </button>
          </div>

          <div className="sticker-content">
            {activeTab === 'preset' && (
              <div className="sticker-grid">
                {presetStickers.map(sticker => (
                  <div
                    key={sticker.id}
                    className="sticker-item"
                    onClick={() => handleStickerClick(sticker)}
                  >
                    <img src={sticker.imageUrl} alt={sticker.name} />
                    <span>{sticker.name}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'uploads' && (
              <div>
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
                    <small>PNG, JPG, GIF, SVG (Max 2MB)</small>
                  </label>
                </div>

                {userStickers.length > 0 && (
                  <div className="sticker-grid">
                    {userStickers.map(sticker => (
                      <div
                        key={sticker.id}
                        className="sticker-item"
                        onClick={() => handleStickerClick(sticker)}
                      >
                        <img src={sticker.imageUrl} alt={sticker.name} />
                        <span>{sticker.name}</span>
                      </div>
                    ))}
                  </div>
                )}

                {userStickers.length === 0 && !uploadLoading && (
                  <div className="empty-state">
                    <Image size={48} />
                    <p>No custom stickers uploaded yet</p>
                    <p>Upload your first sticker to get started!</p>
                  </div>
                )}
              </div>
            )}
          </div>
      </div>
    </div>
  );
};

export default StickerSelector;
