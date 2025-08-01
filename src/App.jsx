import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import "./AppStyles.css";
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { API_URL } from "./shared";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { auth0Config } from "./auth0-config";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import AuthPage from "./pages/auth";
import SpotifyConnect from "./components/SpotifyConnect";
import SpotifyCallback from "./components/SpotifyCallback"; 
import Analytics from "./pages/Analytics";
import TopArtist from "./pages/topArtist";
import TopTracks from "./pages/topTracks";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const {
    isAuthenticated,
    isLoading: auth0Loading,
    user: auth0User,
    logout: auth0Logout,
  } = useAuth0();

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        withCredentials: true,
      });
      if (response.data.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.log("Not authenticated");
      setUser(null);
    }
  };

  // Check authentication status on app load
  useEffect(() => {
    const initAuth = async () => {
      if (!auth0Loading) {
        if (isAuthenticated && auth0User) {
          await handleAuth0Login();
        } else {
          await checkAuth();
        }
        setLoading(false);
      }
    };
    initAuth();
  }, [isAuthenticated, auth0User, auth0Loading]);

  const handleAuth0Login = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/auth/auth0`,
        {
          auth0Id: auth0User.sub,
          email: auth0User.email,
          username: auth0User.nickname || auth0User.email?.split("@")[0],
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }

      setUser(response.data.user);
      navigate("/");
    } catch (error) {
      console.error("Auth0 login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      
      if (isAuthenticated) {
        auth0Logout({
          logoutParams: {
            returnTo: window.location.origin,
          },
        });
      } else {
        navigate("/");
      }
    }
  };

  if (loading || auth0Loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavBar user={user} onLogout={handleLogout} />
      <div className="app">
        <Routes>
          <Route path="/auth" element={<AuthPage setUser={setUser} />} />
          <Route path="/" element={<Home />} />
          <Route path="/spotify" element={<SpotifyConnect />} />
          <Route path="/callback/spotify" element={<SpotifyCallback />} /> 
          <Route path="*" element={<NotFound />} />
          <Route path="/dashboard" element={<Navigate to="/dashboard/analytics" replace />} />
          <Route path="/dashboard/analytics" element={<Analytics />} />
          <Route path="/dashboard/topartist" element={<TopArtist />} />
          <Route path="/dashboard/toptracks" element={<TopTracks />} />
          <Route path="/dashboard/myplaylist" element={<myPlaylist />} />
        </Routes>
      </div>
    </div>
  );
};

const Root = () => {
  return (
    <Auth0Provider {...auth0Config}>
      <Router>
        <App />
      </Router>
    </Auth0Provider>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<Root />);