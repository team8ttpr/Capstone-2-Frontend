import React, { useState } from "react";
import SearchComponent from "./SearchComponent";
import SpotifyEmbed from "./SpotifyEmbed";
import "../style/PostForm.css";
import axios from "axios";
import { API_URL } from "../shared";

export default function PostForm({ isOpen, onClose, onPostCreated }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [selectedEmbed, setSelectedEmbed] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraft, setIsDraft] = useState(false);

  const getSpotifyId = (item) => {
    if (item?.spotify_url) {
      const match = item.spotify_url.match(
        /\/(track|artist|album|playlist)\/([a-zA-Z0-9]+)/
      );
      return match ? match[2] : null;
    }
    return item?.id;
  };

  const getSpotifyEmbedUrl = (item) => {
    const spotifyId = getSpotifyId(item);
    if (!spotifyId || !item.type) return null;

    return `https://open.spotify.com/embed/${item.type}/${spotifyId}?utm_source=generator&theme=0`;
  };

  const handleClose = () => {
    setFormData({ title: "", description: "" });
    setSelectedEmbed(null);
    setShowSearch(false);
    setIsSubmitting(false);
    setIsDraft(false);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearchResultSelect = (result) => {
    setSelectedEmbed(result);
    setShowSearch(false);
  };

  const removeSelectedEmbed = () => {
    setSelectedEmbed(null);
  };

  const handleSubmit = async (e, saveAsDraft = false) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsDraft(saveAsDraft);

    const postData = {
      ...formData,
      status: saveAsDraft ? 'draft' : 'published',
      spotifyId: selectedEmbed ? getSpotifyId(selectedEmbed) : null,
      spotifyType: selectedEmbed ? selectedEmbed.type : null,
      spotifyEmbedUrl: selectedEmbed ? getSpotifyEmbedUrl(selectedEmbed) : null,
    };

    try {
      const endpoint = saveAsDraft ? '/api/posts' : '/api/posts';
      const response = await axios.post(`${API_URL}${endpoint}`, postData, {
        withCredentials: true,
      });
      
      if (onPostCreated) onPostCreated(response.data);
      handleClose();
      
      const message = saveAsDraft ? 'Draft saved successfully!' : 'Post published successfully!';
      alert(message);
      
    } catch (error) {
      console.error("Error creating post:", error);
      alert(error.response?.data?.error || 'Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
      setIsDraft(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="post-form-modal-overlay" onClick={handleClose}>
      <div className="post-form-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h2>Create New Post</h2>
          <button className="close-btn" onClick={handleClose} disabled={isSubmitting}>
            <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
            </svg>
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={(e) => handleSubmit(e, false)} className="post-form">
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
              maxLength={1000}
            />
            <div className="char-count">{formData.description.length}/1000</div>
          </div>

          {/* Music Search Section */}
          <div className="music-search-section">
            <div className="search-header">
              <label>Add Music (Optional)</label>
              <button
                type="button"
                onClick={() => setShowSearch(!showSearch)}
                className="toggle-search-btn"
                disabled={isSubmitting}
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
                <div className="selected-embed-header">
                  <div className="embed-label">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                      <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
                    </svg>
                    Selected Music:
                  </div>
                  <button
                    type="button"
                    onClick={removeSelectedEmbed}
                    className="remove-embed-btn"
                    disabled={isSubmitting}
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                    </svg>
                    Remove
                  </button>
                </div>

                <div className="selected-embed-preview">
                  <div className="embed-info">
                    <div className="embed-image">
                      {selectedEmbed.image ? (
                        <img
                          src={selectedEmbed.image}
                          alt={selectedEmbed.name}
                        />
                      ) : (
                        <div className="placeholder-image">
                          {selectedEmbed.type === "artist"
                            ? "👤"
                            : selectedEmbed.type === "album"
                            ? "💿"
                            : selectedEmbed.type === "playlist"
                            ? "📋"
                            : "🎵"}
                        </div>
                      )}
                    </div>

                    <div className="embed-details">
                      <h4>{selectedEmbed.name}</h4>
                      {selectedEmbed.author && (
                        <p className="embed-author">{selectedEmbed.author}</p>
                      )}
                      <span className="embed-type">{selectedEmbed.type}</span>
                    </div>
                  </div>

                  {/* Spotify Embed Preview */}
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
              disabled={isSubmitting}
            >
              Cancel
            </button>
            
            <button 
              type="button" 
              className="draft-btn"
              onClick={(e) => handleSubmit(e, true)}
              disabled={isSubmitting || !formData.title.trim()}
            >
              {isDraft && isSubmitting ? (
                <>
                  <div className="spinner"></div>
                  Saving...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8.5 1.5A1.5 1.5 0 0 0 7 0H3.5A1.5 1.5 0 0 0 2 1.5v13A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5V6.621a1.5 1.5 0 0 0-.44-1.06L9.94 1.439A1.5 1.5 0 0 0 8.878 1H8.5zM7 2v4.5A1.5 1.5 0 0 0 8.5 8h5V14.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 .5-.5H7z"/>
                  </svg>
                  Save Draft
                </>
              )}
            </button>
            
            <button 
              type="submit" 
              className="publish-btn"
              disabled={isSubmitting || !formData.title.trim() || !formData.description.trim()}
            >
              {!isDraft && isSubmitting ? (
                <>
                  <div className="spinner"></div>
                  Publishing...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"/>
                  </svg>
                  Publish Post
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}