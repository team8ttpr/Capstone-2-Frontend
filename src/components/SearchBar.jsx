import React, { useState } from "react";
import "../style/SearchBar.css";

const SearchBar = ({ onSearch, placeholder = "Search..." }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <form
      className="search-input"
      onSubmit={(e) => e.preventDefault()}
      style={{
        width: "100%",
        marginBottom: 12,
      }}
    >
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        style={{
          width: "100%",
          padding: "10px 14px",
          borderRadius: "8px",
          border: "1px solid #333",
          outline: "none",
          background: "#23232a",
          color: "#fff",
          fontSize: "1rem",
          boxShadow: "0 1px 4px rgba(0,0,0,0.10)",
          transition: "border 0.2s, box-shadow 0.2s",
        }}
      />
    </form>
  );
};

export default SearchBar;