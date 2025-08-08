import React, { useState } from "react";
import "../style/SearchBar.css";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <form className="search-input" onSubmit={(e) => e.preventDefault()}>
      <input
        type="text"
        placeholder="Search for a post..."
        value={query}
        onChange={handleChange}
      />
    </form>
  );
};

export default SearchBar;
