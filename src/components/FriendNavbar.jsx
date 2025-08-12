import React from "react";

const FriendNavbar = ({ activeTab, onTabChange }) => {
  const tabs = ["friends", "followers", "following"];

  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        borderBottom: "1px solid #ccc",
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
            borderBottom: activeTab === tab ? "2px solid black" : "none",
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default FriendNavbar;
