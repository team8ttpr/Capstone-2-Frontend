import React, { useRef, useEffect } from "react";

const MessageThread = ({ messages, currentUserId }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="message-thread">
      {messages.map(msg => (
        <div
          key={msg.id}
          className={`message-bubble${msg.senderId === currentUserId ? " sent" : " received"}`}
        >
          <span>{msg.content}</span>
          <div className="message-meta">{new Date(msg.createdAt).toLocaleTimeString()}</div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageThread;