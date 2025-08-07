import React, { useState } from "react";
import SearchComponent from "./SearchComponent";
import SpotifyEmbed from "./SpotifyEmbed";
import "../style/PostForm.css";
import axios from "axios";
import { API_URL } from "../shared";

export default function Modal({ toggleModal }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [selectedEmbed, setSelectedEmbed] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  // Move these functions to the top, before they're used
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

    return `https://open.spotify.com/embed/${item.type}/${spotifyId}?utm_source=generator`;
  };

  const toggleModalInternal = () => {
    setIsOpen(!isOpen);
    if (toggleModal) toggleModal();

    if (isOpen) {
      setFormData({ title: "", description: "" });
      setSelectedEmbed(null);
      setShowSearch(false);
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Selected embed:", selectedEmbed);
    console.log("Spotify ID:", selectedEmbed ? getSpotifyId(selectedEmbed) : null);
    console.log("Spotify Embed URL:", selectedEmbed ? getSpotifyEmbedUrl(selectedEmbed) : null);

    const postData = {
      ...formData,
      spotifyId: selectedEmbed ? getSpotifyId(selectedEmbed) : null,
      spotifyType: selectedEmbed ? selectedEmbed.type : null,
      spotifyEmbedUrl: selectedEmbed ? getSpotifyEmbedUrl(selectedEmbed) : null,
    };

    console.log("Post data being sent:", postData);

    try {
      const response = await axios.post(`${API_URL}/api/posts`, postData, {
        withCredentials: true,
      });
      
      console.log("Response from backend:", response.data);

      setFormData({ title: "", description: "" });
      setSelectedEmbed(null);
      setShowSearch(false);
      setIsOpen(false);
    } catch (error) {
      console.error("Error creating post:", error);
      console.error("Error response:", error.response?.data);
    }
  };

  return (
    <div>
      <button onClick={toggleModalInternal} className="create-post-btn">
        Create Post
      </button>

      {isOpen && (
        <div className="modal">
          <div className="overlay" onClick={toggleModalInternal}></div>
          <div className="modal-content">
            <div className="modal-header">
              <h2>Create New Post</h2>
              <button className="close-btn" onClick={toggleModalInternal}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="post-form">
              <div className="form-group">
                <label htmlFor="title">Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Give your post a title..."
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="What do you want to share about this music?"
                  rows="4"
                  required
                />
              </div>

              {/* Music Search Section */}
              <div className="music-search-section">
                <div className="search-header">
                  <label>Add Music (Optional)</label>
                  <button
                    type="button"
                    onClick={() => setShowSearch(!showSearch)}
                    className="toggle-search-btn"
                  >
                    {showSearch ? "Hide Search" : "Search Music"}
                  </button>
                </div>

                {showSearch && (
                  <div className="search-container">
                    <SearchComponent
                      onResultSelect={handleSearchResultSelect}
                      placeholder="Search for a song, artist, album, or playlist..."
                    />
                  </div>
                )}

                {/* Selected Embed Preview */}
                {selectedEmbed && (
                  <div className="selected-embed-section">
                    <div className="selected-embed-header">
                      <span>Selected Music:</span>
                      <button
                        type="button"
                        onClick={removeSelectedEmbed}
                        className="remove-embed-btn"
                      >
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
                          <h5>{selectedEmbed.name}</h5>
                          {selectedEmbed.author && (
                            <p>{selectedEmbed.author}</p>
                          )}
                          <span className="embed-type">
                            {selectedEmbed.type}
                          </span>
                        </div>
                      </div>

                      {/* Spotify Embed Preview */}
                      {getSpotifyId(selectedEmbed) && (
                        <div className="spotify-embed-preview">
                          <SpotifyEmbed
                            type={selectedEmbed.type}
                            id={getSpotifyId(selectedEmbed)}
                            width="100%"
                            height={selectedEmbed.type === "track" ? 152 : 280}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button type="submit" className="publish-btn">
                  Publish Post
                </button>
                <button type="button" className="draft-btn">
                  Save as Draft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}