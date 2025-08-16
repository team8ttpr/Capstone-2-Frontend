import React, { useState } from "react";

const MessageInput = ({ onSend }) => {
  const [value, setValue] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onSend(value);
      setValue("");
    }
  };

  return (
    <form className="message-input" onSubmit={handleSend}>
      <input
        type="text"
        placeholder="Type a message..."
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default MessageInput;