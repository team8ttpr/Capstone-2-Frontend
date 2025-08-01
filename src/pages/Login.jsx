import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, ChevronLeft, ChevronRight, Users, Zap, Shield, Globe, Smartphone, Music } from 'lucide-react';
import axios from "axios";
import '../style/Login.css';
import { API_URL } from '../shared';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";

const Login = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: false
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginWithRedirect, isLoading: auth0Loading } = useAuth0();

  const carouselData = [
    {
      icon: <Music className="carousel-icon" />,
      title: "Your music, everywhere.",
      subtitle: "Stream millions of songs and discover new favorites across all your devices.",
      gradient: "gradient-1"
    },
    {
      icon: <Zap className="carousel-icon" />,
      title: "Lightning fast streaming.",
      subtitle: "Experience instant playback with our high-quality audio streaming technology.",
      gradient: "gradient-2"
    },
    {
      icon: <Shield className="carousel-icon" />,
      title: "Premium security.",
      subtitle: "Your listening data and personal information are always protected.",
      gradient: "gradient-3"
    },
    {
      icon: <Globe className="carousel-icon" />,
      title: "Global music library.",
      subtitle: "Access artists and playlists from around the world, anytime.",
      gradient: "gradient-4"
    },
    {
      icon: <Smartphone className="carousel-icon" />,
      title: "Mobile-first experience.",
      subtitle: "Seamlessly sync your music between phone, tablet, and desktop.",
      gradient: "gradient-5"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselData.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const identifier = formData.email.trim();
      if (!identifier) throw new Error("Email or username is required");
      
      if (isLogin) {
        // Login
        const response = await axios.post(`${API_URL}/auth/login`, {
          username: identifier,
          password: formData.password,
        }, { withCredentials: true });
        
        if (response.data.token) {
          localStorage.setItem('authToken', response.data.token);
        }
        
        setUser(response.data.user);
        navigate('/top-tracks');
      } else {
        // Signup
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match");
        }
        
        const response = await axios.post(`${API_URL}/auth/signup`, {
          username: identifier,
          password: formData.password,
        }, { withCredentials: true });
        
        if (response.data.token) {
          localStorage.setItem('authToken', response.data.token);
        }
        
        setUser(response.data.user);
        navigate('/top-tracks');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselData.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselData.length) % carouselData.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleAuth0Login = () => {
    loginWithRedirect({
      authorizationParams: {
        connection: 'Username-Password-Authentication',
      },
    });
  };

  const handleSpotifyLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/auth/spotify/login-url`);
      window.location.href = response.data.authUrl;
    } catch (error) {
      setError("Failed to connect to Spotify");
      setLoading(false);
    }
  };

  if (auth0Loading) {
    return (
      <div className="auth-container">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="login-container">
      {/* Left Panel - Auth Form */}
      <div className="auth-panel">
        <div className="auth-form-wrapper">
          {/* Logo */}
          <div className="logo">
            <div className="logo-icon">
              <Music className="logo-music-icon" />
            </div>
            <span className="logo-text">capstone-2</span>
          </div>

          {/* Title */}
          <h1 className="auth-title">
            {isLogin ? 'Log in ' : 'Sign Up'}
          </h1>
          <p className="auth-subtitle">
            {isLogin ? 'Welcome back! Select method to log in:' : 'Join us today! Select method to sign up:'}
          </p>

          {/* Note about Spotify access */}
          <div className="spotify-note">
            <p className="spotify-note-text">
              For full access to all features, connect with Spotify
            </p>
          </div>

          {/* OAuth Buttons */}
          <div className="oauth-section">
            <button className="spotify-btn" onClick={handleSpotifyLogin} disabled={loading}>
              <svg className="spotify-icon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              <span className="spotify-btn-text">Continue with Spotify</span>
            </button>
          </div>

          <div className="form-divider">
            <div className="divider-line"></div>
            <span className="divider-text">or continue with email</span>
            <div className="divider-line"></div>
          </div>

          {/* Form */}
          <form className="form-section" onSubmit={handleAuth}>
            <div className="input-group">
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Email or username"
                required
              />
            </div>
            <div className="input-group">
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="password-icon" />
                  ) : (
                    <Eye className="password-icon" />
                  )}
                </button>
              </div>
            </div>
            {!isLogin && (
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Confirm password"
                  required
                />
              </div>
            )}
            {error && <div className="error-message">{error}</div>}
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? (isLogin ? "Logging in..." : "Signing up...") : (isLogin ? "Log In" : "Sign Up Free")}
            </button>
          </form>

          {/* Switch between login/signup */}
          <div className="auth-switch">
            <span className="auth-switch-text">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="auth-switch-btn"
            >
              {isLogin ? 'Sign up for Capstone-2' : 'Log in here'}
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel - Carousel */}
      <div className="carousel-panel">
        <div className="carousel-container">
          {carouselData.map((slide, index) => (
            <div
              key={index}
              className={`carousel-slide ${slide.gradient}`}
              style={{
                transform: `translateX(${(index - currentSlide) * 100}%)`,
                opacity: index === currentSlide ? 1 : 0.8
              }}
            >
              <div className="carousel-content">
                {/* Navigation Arrows */}
                <button
                  onClick={prevSlide}
                  className="carousel-nav carousel-nav-left"
                >
                  <ChevronLeft className="nav-icon" />
                </button>
                <button
                  onClick={nextSlide}
                  className="carousel-nav carousel-nav-right"
                >
                  <ChevronRight className="nav-icon" />
                </button>

                {/* Content */}
                <div className="carousel-icon-wrapper">
                  {slide.icon}
                </div>
                
                <h2 className="carousel-title">
                  {slide.title}
                </h2>
                
                <p className="carousel-subtitle">
                  {slide.subtitle}
                </p>

                {/* Spotify-style Music Player Mockup */}
                <div className="player-mockup">
                  <div className="player-inner">
                    {/* Now Playing */}
                    <div className="now-playing">
                      <div className="album-cover">
                        <Music className="album-icon" />
                      </div>
                      <div className="song-info">
                        <div className="song-title"></div>
                        <div className="artist-name"></div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="progress-section">
                      <div className="progress-bar">
                        <div className="progress-fill"></div>
                      </div>
                    </div>
                    
                    {/* Controls */}
                    <div className="player-controls">
                      <div className="control-btn control-btn-small"></div>
                      <div className="control-btn control-btn-large"></div>
                      <div className="control-btn control-btn-small"></div>
                    </div>
                  </div>
                </div>

                {/* Floating Music Notes Animation */}
                <div className="floating-note note-1"></div>
                <div className="floating-note note-2"></div>
                <div className="floating-note note-3"></div>
              </div>
            </div>
          ))}

          {/* Dots Indicator */}
          <div className="carousel-dots">
            {carouselData.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`dot ${index === currentSlide ? 'dot-active' : ''}`}
              />
            ))}
          </div>

          {/* Background Pattern */}
          <div className="background-pattern">
            <div className="pattern-circle circle-1"></div>
            <div className="pattern-circle circle-2"></div>
            <div className="pattern-circle circle-3"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;