import React, { useState, useRef } from "react";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SearchComponent from "./SearchComponent";
import SpotifyEmbed from "./SpotifyEmbed";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";

const MessageInput = ({ onSend, onTyping, onStopTyping }) => {
  const [value, setValue] = useState("");
  const [file, setFile] = useState(null);
  const [showEmbedSearch, setShowEmbedSearch] = useState(false);
  const [embedPreview, setEmbedPreview] = useState(null);
  const fileInputRef = useRef();
  const typingTimeout = useRef();

  const handleChange = (e) => {
    setValue(e.target.value);
    if (onTyping) onTyping();
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      if (onStopTyping) onStopTyping();
    }, 1500);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleEmbedSelect = (item) => {
    setEmbedPreview(item);
    setShowEmbedSearch(false);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (embedPreview) {
      onSend({
        content: "",
        spotifyEmbedUrl: embedPreview.spotify_url,
        // Optionally, send other embed info for frontend rendering
        embedType: embedPreview.type,
        embedId: embedPreview.id,
        embedName: embedPreview.name,
        embedImage: embedPreview.image,
      });
      setEmbedPreview(null);
      setValue("");
      if (onStopTyping) onStopTyping();
      return;
    }
    if (file) {
      onSend({ content: value, file, fileType: file.type });
      setValue("");
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      if (onStopTyping) onStopTyping();
    } else if (value.trim()) {
      onSend({ content: value });
      setValue("");
      if (onStopTyping) onStopTyping();
    }
  };

  const handleAttachClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <form className="message-input" onSubmit={handleSend}>
      {/* Input field: only show if no embedPreview */}
      <input
        type="text"
        placeholder="Type a message..."
        value={value}
        onChange={handleChange}
        onBlur={() => onStopTyping && onStopTyping()}
        disabled={!!embedPreview}
      />
      <button
        type="button"
        onClick={handleAttachClick}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          marginLeft: 8,
          display: "flex",
          alignItems: "center",
        }}
        aria-label="Attach file"
        title="Attach file"
      >
        <AttachFileIcon style={{ color: "#1db954" }} />
      </button>
      <button
        type="button"
        onClick={() => setShowEmbedSearch(true)}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          marginLeft: 8,
          display: "flex",
          alignItems: "center",
        }}
        aria-label="Send Spotify Embed"
        title="Send Spotify Embed"
      >
        <QueueMusicIcon style={{ color: "#1db954" }} />
      </button>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      {file && (
        <span style={{ marginLeft: 8, display: "inline-flex", alignItems: "center" }}>
          {file.name}
          <button
            type="button"
            onClick={handleRemoveFile}
            style={{
              marginLeft: 4,
              background: "transparent",
              border: "none",
              color: "#d00",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "1.1em",
            }}
            aria-label="Remove file"
            title="Remove file"
          >
            ×
          </button>
        </span>
      )}
      {/* Embed preview: only show if embedPreview is set */}
      {embedPreview && (
        <span className="embed-preview">
          <SpotifyEmbed type={embedPreview.type} id={embedPreview.id} width={320} height={80} />
          <button
            type="button"
            className="remove-embed-btn"
            onClick={() => setEmbedPreview(null)}
            aria-label="Remove embed"
            title="Remove embed"
          >
            ×
          </button>
        </span>
      )}
      <button type="submit">Send</button>
      {showEmbedSearch && (
        <div className="embed-search-modal">
          <div className="embed-search-container">
            <SearchComponent
              onResultSelect={handleEmbedSelect}
              placeholder="Search Spotify to send..."
            />
            <button
              type="button"
              className="close-btn"
              onClick={() => setShowEmbedSearch(false)}
              style={{ position: "absolute", top: 24, right: 24, fontSize: 32, background: "none", border: "none", color: "#fff", cursor: "pointer" }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default MessageInput;