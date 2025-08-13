import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../shared';
import '../style/ForkPlaylistModal.css';

const ForkPlaylistModal = ({ post, onClose, onSuccess }) => {
  const [playlistName, setPlaylistName] = useState(`${post.title} - Fork`);
  const [isPublic, setIsPublic] = useState(true);
  const [isCollaborative, setIsCollaborative] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFork = async () => {
    if (!playlistName.trim()) {
      setError('Playlist name is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/api/posts/${post.id}/fork-playlist`, {
        playlistName: playlistName.trim(),
        isPublic: isPublic,
        isCollaborative: isCollaborative
      }, {
        withCredentials: true,
      });

      if (response.status === 200) {
        onSuccess(response.data);
        onClose();
      }
    } catch (error) {
      console.error('Error forking playlist:', error);
      setError(error.response?.data?.error || 'Failed to fork playlist');
    } finally {
      setIsLoading(false);
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

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isCollaborative}
                onChange={(e) => setIsCollaborative(e.target.checked)}
              />
              <span className="checkmark" />
              <div className="checkbox-text">
                <strong>Make playlist collaborative</strong>
                <p className="help-text">
                  {isCollaborative ? 'Others can add tracks to this playlist' : 'Only you can modify this playlist'}
                </p>
              </div>
            </label>
          </div>
        </div>
  
        <div className="fork-actions">
          <button className="btn btn-cancel" onClick={onClose} disabled={isLoading}>Cancel</button>
          <button className="btn btn-primary" onClick={handleFork} disabled={isLoading}>Fork Playlist</button>
        </div>
      </div>
    </div>
  );
};

export default ForkPlaylistModal;