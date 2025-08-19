import React from "react";

const FriendNavbar = ({ activeTab, onTabChange, textColor = "#fff" }) => {
  const tabs = ["friends", "followers", "following"];

  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        borderBottom: "1px solid #333",
        paddingBottom: "8px",
        marginBottom: "20px",
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          style={{
            background: "none",
            border: "none",
            fontSize: "16px",
            cursor: "pointer",
            fontWeight: activeTab === tab ? "bold" : "normal",
            borderBottom: activeTab === tab ? "2px solid #27c93f" : "none",
            color: textColor,
            opacity: activeTab === tab ? 1 : 0.8,
            paddingBottom: 2,
            transition: "border 0.2s, color 0.2s, opacity 0.2s",
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default FriendNavbar;