import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../shared';
import '../style/ForkPlaylistModal.css';

const ForkPlaylistModal = ({ post, onClose, onSuccess }) => {
  const [playlistName, setPlaylistName] = useState(`${post.title} - Fork`);
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFork = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        `${API_URL}/api/posts/${post.id}/fork-playlist`,
        {},
        { withCredentials: true }
      );
      const data = res.data;
      setDone(data);
      onSuccess?.(data);
    } catch (e) {
      const msg =
        e.response?.data?.error ||
        (e.response?.status === 401
          ? "Please connect Spotify and try again."
          : "Failed to fork playlist");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="fork-modal">
        <div className="fork-header">
          <h3 className="fork-title">Fork Playlist</h3>
          <button className="fork-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
  
        <div className="fork-content">
          {error && <div className="fork-error">{error}</div>}
  
          <div className="fork-info">
            <h4>Forking: "{post.title}"</h4>
            <p>This will create a copy of this playlist in your Spotify account</p>
          </div>
  
          <div className="form-group">
            <label className="form-label">Playlist Name</label>
            <input
              className="text-input"
              type="text"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
            />
          </div>
  
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
              <span className="checkmark" />
              <div className="checkbox-text">
                <strong>Make playlist public on Spotify</strong>
                <p className="help-text">
                  {isPublic ? 'Others can see this playlist on your Spotify profile' : 'Only you can see this playlist'}
                </p>
              </div>
            </label>
          </div>
        </div>
  
        <div className="fork-actions">
          <button className="btn btn-cancel" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="btn btn-primary" onClick={handleFork} disabled={loading}>Fork Playlist</button>
        </div>
      </div>
    </div>
  );
};

export default ForkPlaylistModal;