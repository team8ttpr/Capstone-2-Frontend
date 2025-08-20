import React, { useState } from "react";
import ChatComponent from "../components/ai-playlist";

const AI = () => {
  const [loading, setLoading] = useState(false);

  const handleSendMessage = (message, callback) => {
    setLoading(true);
    setTimeout(() => {
      callback("AI response to: " + message);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="ai-page-container">
      <ChatComponent onSendMessage={handleSendMessage} isLoading={loading} />
    </div>
  );
};

export default AI;
