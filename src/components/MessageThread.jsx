import React, { useEffect, useRef } from "react";
import SpotifyEmbed from "./SpotifyEmbed";

const MessageThread = ({ messages, currentUserId, isTyping }) => {
  const bottomRef = useRef();

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  return (
    <div className="message-thread">
      {messages.map((msg) => (
        <div
          key={msg.id || `${msg.senderId}-${msg.createdAt}-${msg.fileUrl || ""}`}
          className={`message-bubble${msg.senderId === currentUserId ? " sent" : " received"}`}
        >
          {msg.type === "image" && msg.fileUrl ? (
            <img
              src={msg.fileUrl}
              alt="sent file"
              style={{ maxWidth: 200, maxHeight: 200, display: "block", marginBottom: 4 }}
            />
          ) : msg.type === "file" && msg.fileUrl ? (
            <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">
              Download file
            </a>
          ) : msg.spotifyEmbedUrl ? (
            <SpotifyEmbed
              type={(() => {
                const m = msg.spotifyEmbedUrl.match(/spotify\.com\/(track|album|artist|playlist)\//);
                return m ? m[1] : msg.embedType || "track";
              })()}
              id={(() => {
                const m = msg.spotifyEmbedUrl.match(/spotify\.com\/(?:track|album|artist|playlist)\/([a-zA-Z0-9]+)/);
                return m ? m[1] : msg.embedId || "";
              })()}
              width={320}
              height={80}
              theme="dark"
            />
          ) : null}
          {msg.content && <span>{msg.content}</span>}
          <div className="message-meta">
            {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            {msg.senderId === currentUserId && msg.read && (
              <span className="read-receipt" title="Read">✔️</span>
            )}
          </div>
        </div>
      ))}
      {isTyping && (
        <div className="message-bubble typing-indicator">
          <span>Typing...</span>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageThread;