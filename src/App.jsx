import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import "./AppStyles.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";
import { API_URL } from "./shared";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { auth0Config } from "./auth0-config";
import Auth from "./pages/auth";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import SpotifyCallback from "./components/SpotifyCallback";
import Analytics from "./pages/Analytics";
import TopArtist from "./pages/topArtist";
import TopTracks from "./pages/topTracks";
import Feed from "./pages/feed";
import Messages from "./pages/Messages";
import Friends from "./pages/Friends";
import Notifications from "./pages/Notifications";
import MyPlaylist from "./pages/myPlaylist";
import MyPost from "./pages/myPost";
import Profile from "./pages/profile";
import PublicProfile from "./pages/publicprofile";
import ShareProfile from "./pages/shareProfile";
import SinglePostView from "./pages/SinglePostView";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const hideNavBar = location.pathname.startsWith("/share/");

  const {
    isAuthenticated,
    isLoading: auth0Loading,
    user: auth0User,
    logout: auth0Logout,
  } = useAuth0();

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("authToken");
        if (token && !config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("authToken");
          setUser(null);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        withCredentials: true,
      });
      if (response.data.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      setUser(null);
    }
  };

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
      if (!auth0User) {
        return;
      }

      const response = await axios.post(
        `${API_URL}/auth/auth0`,
        {
          auth0Id: auth0User.sub,
          email: auth0User.email,
          username: auth0User.nickname || auth0User.name,
        },
        { withCredentials: true }
      );

      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
      }

      setUser(response.data.user);
    } catch (error) {
      console.error("Auth0 login error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${API_URL}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("authToken");
      setUser(null);

      if (isAuthenticated) {
        auth0Logout({
          logoutParams: {
            returnTo: window.location.origin,
          },
        });
      } else {
        navigate("/auth");
      }
    }
  };

  if (loading || auth0Loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {!hideNavBar && <NavBar user={user} onLogout={handleLogout} />}
      <div className="app">
        <Routes>
          {/* Auth Routes */}
          <Route path="/auth" element={<Auth setUser={setUser} />} />

          {/* Main Routes */}
          <Route path="/" element={<Home />} />
          <Route
            path="/callback/spotify"
            element={<SpotifyCallback setUser={setUser} />}
          />

          {/* Dashboard Routes */}
          <Route
            path="/dashboard"
            element={<Navigate to="/dashboard/analytics" replace />}
          />
          <Route
            path="/dashboard/analytics"
            element={<Analytics user={user} />}
          />
          <Route
            path="/dashboard/topartist"
            element={<TopArtist user={user} />}
          />
          <Route
            path="/dashboard/toptracks"
            element={<TopTracks user={user} />}
          />
          <Route
            path="/dashboard/myplaylist"
            element={<MyPlaylist user={user} />}
          />
          <Route
            path="/dashboard/toptracks"
            element={<TopTracks user={user} />}
          />

          {/* Social Routes */}
          <Route
            path="/social"
            element={<Navigate to="/social/feed" replace />}
          />
          <Route path="/social/feed" element={<Feed user={user} />} />
          <Route path="/social/messages" element={<Messages user={user} />} />
          <Route path="/social/mypost" element={<MyPost user={user} />} />
          <Route path="/social/friends" element={<Friends user={user} />} />
          <Route
            path="/social/notifications"
            element={<Notifications user={user} />}
          />

          {/* Profile Route */}
          <Route path="/profile" element={<Profile user={user} />} />
          <Route path="/profile/:username" element={<PublicProfile user={user} />} />
          <Route path="/share/:username" element={<ShareProfile />} />
          <Route path="/post/:id" element={<SinglePostView user={user} />} />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

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
