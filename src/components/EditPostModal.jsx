import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../shared';
import SpotifyEmbed from './SpotifyEmbed';
import SearchComponent from './SearchComponent';
import '../style/EditPostModal.css';

const EditPostModal = ({ post, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: post.title || '',
    description: post.description || ''
  });
  const [selectedEmbed, setSelectedEmbed] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    if (post.spotifyId && post.spotifyType) {
      setSelectedEmbed({
        id: post.spotifyId,
        type: post.spotifyType,
        name: post.title,
        author: post.spotifyArtist || '',
        spotify_url: `https://open.spotify.com/${post.spotifyType}/${post.spotifyId}`
      });
    }
  }, [post]);

  const getSpotifyId = (item) => {
    if (item?.spotify_url) {
      const match = item.spotify_url.match(/\/(track|artist|album|playlist)\/([a-zA-Z0-9]+)/);
      return match ? match[2] : null;
    }
    return item?.id;
  };

  const getSpotifyEmbedUrl = (item) => {
    const spotifyId = getSpotifyId(item);
    if (!spotifyId || !item.type) return null;
    return `https://open.spotify.com/embed/${item.type}/${spotifyId}?utm_source=generator&theme=0`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearchResultSelect = (result) => {
    console.log('Selected search result:', result);
    setSelectedEmbed(result);
    setShowSearch(false);
  };

  const removeSelectedEmbed = () => {
    setSelectedEmbed(null);
  };

  const handleSubmit = async (e, shouldPublish = false) => {
    e.preventDefault();
    
    if (shouldPublish) {
      setIsPublishing(true);
    } else {
      setIsSubmitting(true);
    }

    const updateData = {
      ...formData,
      status: shouldPublish ? 'published' : 'draft',
      spotifyId: selectedEmbed ? getSpotifyId(selectedEmbed) : null,
      spotifyType: selectedEmbed ? selectedEmbed.type : null,
      spotifyEmbedUrl: selectedEmbed ? getSpotifyEmbedUrl(selectedEmbed) : null,
    };

    console.log('Updating post with data:', updateData);

    try {
      const endpoint = shouldPublish 
        ? `/api/posts/${post.id}/publish` 
        : `/api/posts/draft/${post.id}`;
        
      const response = await axios.patch(`${API_URL}${endpoint}`, updateData, {
        withCredentials: true,
      });
      
      const message = shouldPublish ? 'Draft published successfully!' : 'Draft updated successfully!';
      alert(message);
      onSuccess();
      
    } catch (error) {
      console.error("Error updating draft:", error);
      alert(error.response?.data?.error || 'Failed to update draft. Please try again.');
    } finally {
      setIsSubmitting(false);
      setIsPublishing(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting && !isPublishing) {
      onClose();
    }
  };

  const isLoading = isSubmitting || isPublishing;

  return (
    <div className="edit-post-modal-overlay" onClick={handleClose}>
      <div className="edit-post-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h2>Edit Draft</h2>
          <button className="close-btn" onClick={handleClose} disabled={isLoading}>
            <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
            </svg>
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={(e) => handleSubmit(e, false)} className="edit-post-form">
          {/* Title Input */}
          <div className="form-group">
            <label htmlFor="title">Post Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="What's your post about?"
              required
              disabled={isLoading}
              maxLength={200}
            />
            <div className="char-count">{formData.title.length}/200</div>
          </div>

          {/* Description Input */}
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Share your thoughts about this music..."
              rows="4"
              required
              disabled={isLoading}
              maxLength={1000}
            />
            <div className="char-count">{formData.description.length}/1000</div>
          </div>

          {/* Music Search Section */}
          <div className="music-search-section">
            <div className="search-header">
              <label>Update Music (Optional)</label>
              <button
                type="button"
                onClick={() => setShowSearch(!showSearch)}
                className="toggle-search-btn"
                disabled={isLoading}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path fillRule="evenodd" d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
                {showSearch ? "Hide Search" : "Search Music"}
              </button>
            </div>

            {showSearch && (
              <div className="search-container">
                <SearchComponent 
                  onResultSelect={handleSearchResultSelect}
                  placeholder="Search for songs, artists, albums, or playlists..."
                />
              </div>
            )}

            {/* Selected Embed Preview */}
            {selectedEmbed && (
              <div className="selected-embed-section">
                <div className="embed-header">
                  <div className="embed-title">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                      <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                    </svg>
                    Selected Music:
                  </div>
                  <button
                    type="button"
                    onClick={removeSelectedEmbed}
                    className="remove-embed-btn"
                    disabled={isLoading}
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                    </svg>
                    Remove
                  </button>
                </div>

                <div className="embed-preview">
                  <div className="embed-info">
                    <div className="embed-details">
                      <h4>{selectedEmbed.name}</h4>
                      <p className="embed-author">{selectedEmbed.author || selectedEmbed.type}</p>
                      <p className="embed-type">
                        {selectedEmbed.type.charAt(0).toUpperCase() + selectedEmbed.type.slice(1)}
                      </p>
                    </div>
                  </div>

                  {getSpotifyId(selectedEmbed) && (
                    <div className="spotify-embed-preview">
                      <SpotifyEmbed
                        type={selectedEmbed.type}
                        id={getSpotifyId(selectedEmbed)}
                        width="100%"
                        height={selectedEmbed.type === "track" ? 152 : 352}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn" 
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            
            <button 
              type="submit" 
              className="save-btn"
              disabled={isLoading || !formData.title.trim() || !formData.description.trim()}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner"></div>
                  Updating...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
                  </svg>
                  Update Draft
                </>
              )}
            </button>

            <button 
              type="button" 
              className="publish-btn"
              onClick={(e) => handleSubmit(e, true)}
              disabled={isLoading || !formData.title.trim() || !formData.description.trim()}
            >
              {isPublishing ? (
                <>
                  <div className="spinner"></div>
                  Publishing...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"/>
                  </svg>
                  Publish Now
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostModal;