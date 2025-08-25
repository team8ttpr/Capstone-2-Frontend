import React, { useState } from "react";

export default function EmailPrompt({ onSubmit }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.match(/^[^@]+@[^@]+\.[^@]+$/)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    onSubmit(email);
  };

  return (
    <form className="email-prompt-form" onSubmit={handleSubmit}>
      <label>
        Please enter your email address.<br />
        <span style={{ color: "#1db954", fontWeight: 600 }}>
          Use the exact same email as your Spotify account.
        </span>
      </label>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        style={{ marginTop: 12, marginBottom: 8, width: "100%" }}
      />
      {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
      <button type="submit" className="btn-primary">
        Continue with Spotify
      </button>
    </form>
  );
}