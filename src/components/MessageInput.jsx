import React, { useState, useRef } from "react";

const MessageInput = ({ onSend, onTyping, onStopTyping }) => {
  const [value, setValue] = useState("");
  const [file, setFile] = useState(null);
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

  const handleSend = (e) => {
    e.preventDefault();
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

  return (
    <form className="message-input" onSubmit={handleSend}>
      <input
        type="text"
        placeholder="Type a message..."
        value={value}
        onChange={handleChange}
        onBlur={() => onStopTyping && onStopTyping()}
      />
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleFileChange}
        style={{ marginLeft: 8 }}
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
      <button type="submit">Send</button>
    </form>
  );
};

export default MessageInput;