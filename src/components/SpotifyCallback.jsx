import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../shared";
import "../style/SpotifyCallback.css";

const ManualOnboardForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    spotifyEmail: "",
    notes: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.spotifyEmail.match(/^[^@]+@[^@]+\.[^@]+$/)) {
      setError("Please enter a valid Spotify email.");
      return;
    }
    setError("");
    onSubmit(form);
  };

  return (
    <div className="manual-onboard-card">
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <svg
          height="48"
          viewBox="0 0 24 24"
          fill="#1db954"
          style={{ marginBottom: 8 }}
        >
          <circle cx="12" cy="12" r="12" fill="#000000ff" />
          <path
            d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"
            fill="#1db954"
          />
        </svg>
        <h2 className="manual-onboard-title">Request Access</h2>
        <p className="manual-onboard-desc">
          Sorry, we couldn't log you in with Spotify automatically.
          <br />
          Please fill out this form and our team will add you as soon as
          possible.
        </p>
      </div>
      <form className="manual-onboard-form" onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label>Your Name</label>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Contact Email</label>
          <input
            type="email"
            name="email"
            placeholder="Your Contact Email"
            value={form.email}
            onChange={handleChange}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>
            Spotify Account Email
            <span className="required">(required)</span>
          </label>
          <input
            type="email"
            name="spotifyEmail"
            placeholder="Your Spotify Account Email"
            value={form.spotifyEmail}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label>Anything else?</label>
          <textarea
            name="notes"
            placeholder="Anything else you'd like us to know?"
            value={form.notes}
            onChange={handleChange}
            rows={3}
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
};

const SpotifyCallback = ({ setUser }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");
  const [showManualForm, setShowManualForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      setError("Access denied by Spotify.");
      setShowManualForm(true);
      return;
    }

    if (!code) {
      setError("No authorization code returned from Spotify.");
      setShowManualForm(true);
      return;
    }

    const trySpotifyLogin = async () => {
      try {
        const response = await axios.post(
          `${API_URL}/auth/spotify/login`,
          { code, state },
          { withCredentials: true }
        );
        if (response.data.token) {
          localStorage.setItem("authToken", response.data.token);
        }
        setUser(response.data.user);
        navigate("/dashboard/analytics");
      } catch (err) {
        setError(
          err.response?.data?.error ||
            "Spotify login failed. You may not be a registered test user."
        );
        setShowManualForm(true);
      }
    };

    trySpotifyLogin();
    // eslint-disable-next-line
  }, [searchParams, navigate, setUser]);

  const handleManualSubmit = async (form) => {
    await axios.post(`${API_URL}/auth/spotify/manual-onboard`, form);
    setSubmitted(true);
  };

  return (
    <div className="spotify-callback-bg">
      {showManualForm ? (
        submitted ? (
          <div className="manual-onboard-thankyou">
            <h3>Thank you!</h3>
            <p>
              Your request has been received.
              <br />
              Our team will review your info and add you as soon as possible.
              <br />
              In the meantime, feel free to create an account without connecting
              to spotify.
            </p>
          </div>
        ) : (
          <>
            <div className="manual-onboard-error">{error}</div>
            <ManualOnboardForm onSubmit={handleManualSubmit} />
          </>
        )
      ) : (
        <div className="spotify-callback-center">
          <h2>Connecting to Spotify...</h2>
          <p>Please wait while we complete the connection.</p>
        </div>
      )}
    </div>
  );
};

export default SpotifyCallback;
