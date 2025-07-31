import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import "./AppStyles.css";
import NavBar from "./components/NavBar";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import { API_URL } from "./shared";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { auth0Config } from "./auth0-config";

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
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
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