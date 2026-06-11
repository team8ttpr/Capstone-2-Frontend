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
import Messages from "./pages/messages";
import Friends from "./pages/friends";
import Notifications from "./pages/notifications";
import MyPlaylist from "./pages/myPlaylist";
import MyPost from "./pages/myPost";
import Profile from "./pages/profile";
import PublicProfile from "./pages/publicprofile";
import ShareProfile from "./pages/shareProfile";
import SinglePostView from "./pages/SinglePostView";
import AI from "./pages/AI";
import { socket, PresenceContext } from "./ws";
import RedirectSpotify from "./pages/RedirectSpotify";
import SpotifyGuard from "./utils/SpotifyGuard";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState(new Set());
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  const [spotifyCheckDone, setSpotifyCheckDone] = useState(false);

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
    let alive = true;

    const run = async () => {
      if (!user) {
        if (alive) {
          setSpotifyConnected(false);
          setSpotifyCheckDone(true);
        }
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/auth/spotify/profile`, {
          withCredentials: true,
        });
        console.log("[spotify/profile] status:", res.status, res.data);
        if (!alive) return;
        setSpotifyConnected(!!res.data?.connected);
      } catch (e) {
        console.log(
          "[spotify/profile] ERROR:",
          e?.response?.status,
          e?.response?.data || e?.message
        );
        if (!alive) return;
        setSpotifyConnected(false);
      } finally {
        if (alive) setSpotifyCheckDone(true);
      }
    };

    setSpotifyCheckDone(false);
    run();
    return () => {
      alive = false;
    };
  }, [user]);

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

  const checkAuth = async (attempt = 0) => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        withCredentials: true,
      });
      // A definitive answer from the server: trust it (user object or null).
      setUser(response.data.user || null);
    } catch (error) {
      const status = error.response?.status;
      // 401/403 mean the token is genuinely invalid/expired -> log out.
      if (status === 401 || status === 403) {
        setUser(null);
        return;
      }
      // No status (network error/timeout) or a 5xx usually means the backend
      // is cold-starting, not that the session is gone. Retry with backoff so
      // a refresh during a cold start doesn't kick the user out.
      if (attempt < 4) {
        const delay = 1000 * Math.pow(2, attempt); // 1s, 2s, 4s, 8s
        await new Promise((r) => setTimeout(r, delay));
        return checkAuth(attempt + 1);
      }
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

  // --- Presence logic ---
  useEffect(() => {
    const onSnapshot = (ids) => {
      setOnline(new Set(ids.map(String)));
    };
    const onUpdate = (p) => {
      setOnline((prev) => {
        const next = new Set(prev);
        p.online ? next.add(String(p.userId)) : next.delete(String(p.userId));
        return next;
      });
    };
    socket.on("presence:snapshot", onSnapshot);
    socket.on("presence:update", onUpdate);
    return () => {
      socket.off("presence:snapshot", onSnapshot);
      socket.off("presence:update", onUpdate);
    };
  }, []);

  useEffect(() => {
    if (user?.id) {
      socket.emit("register", user.id);
    }
  }, [user]);

  // Dashboard pages are reachable without Spotify: connected users see their
  // real data, everyone else gets clearly-labeled demo data via the `demo` flag.
  const renderDashboard = (Component) => {
    if (!user) return <Navigate to="/auth" replace />;
    if (!spotifyCheckDone) return <div className="app">Loading…</div>;
    return <Component user={user} demo={!spotifyConnected} />;
  };

  if (loading || auth0Loading) {
    return <div>Loading...</div>;
  }

  return (
    <PresenceContext.Provider value={{ online, setOnline, socket }}>
      {!hideNavBar && <NavBar user={user} onLogout={handleLogout} />}
      <div className="app">
        <ErrorBoundary routeKey={location.pathname}>
        <Routes>
          <Route path="/auth" element={<Auth setUser={setUser} />} />
          <Route path="/" element={<Home />} />
          <Route
            path="/callback/spotify"
            element={<SpotifyCallback setUser={setUser} />}
          />
          {/* dashboard index -> analytics */}
          <Route
            path="/dashboard"
            element={
              user ? (
                <Navigate to="/dashboard/analytics" replace />
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />

          <Route
            path="/dashboard/analytics"
            element={renderDashboard(Analytics)}
          />

          <Route
            path="/dashboard/topartist"
            element={renderDashboard(TopArtist)}
          />

          <Route
            path="/dashboard/toptracks"
            element={renderDashboard(TopTracks)}
          />

          <Route
            path="/dashboard/myplaylist"
            element={renderDashboard(MyPlaylist)}
          />
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
          <Route path="/profile" element={<Profile user={user} />} />
          <Route
            path="/profile/:username"
            element={<PublicProfile user={user} />}
          />
          <Route path="/share/:username" element={<ShareProfile />} />
          <Route path="/post/:id" element={<SinglePostView user={user} />} />

          <Route
            path="/ai"
            element={
              <SpotifyGuard
                user={user}
                spotifyConnected={spotifyConnected}
                spotifyCheckDone={spotifyCheckDone}
              >
                <AI />
              </SpotifyGuard>
            }
          />
          <Route path="/redirect-spotify" element={<RedirectSpotify />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
        </ErrorBoundary>
      </div>
    </PresenceContext.Provider>
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
