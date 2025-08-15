import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../shared";
import { useNavigate, useParams } from "react-router-dom";
import MiniDrawer from "../components/MiniDrawer";
import ProfileComponent from "../components/ProfileComponent";
import { loadUserTheme } from "../utils/themeManager";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const PublicProfile = ({ user }) => {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [error, setError] = useState("");
  const [profileTheme, setProfileTheme] = useState("default");
  const { username } = useParams();
  const navigate = useNavigate();
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (username) {
      fetchPublicProfile();
      fetchUserPosts();
    }
  }, [user, username, navigate]);

  const fetchPublicProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${API_URL}/api/profile/${username}`, {
        withCredentials: true,
      });

      setProfile(response.data);

      const userTheme = await loadUserTheme(username);
      setProfileTheme(userTheme);
    } catch (error) {
      console.error("Error fetching public profile:", error);
      if (error.response?.status === 401) {
        navigate("/auth");
        return;
      }
      if (error.response?.status === 404) {
        setError("User not found");
      } else {
        setError("Failed to load profile");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      setPostsLoading(true);

      const response = await axios.get(
        `${API_URL}/api/profile/${username}/posts`,
        {
          withCredentials: true,
        }
      );

      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching user posts:", error);
    } finally {
      setPostsLoading(false);
    }
  };

  const handleBackToProfile = () => {
    navigate("/profile");
  };

const fetchFollowersAndFollowing = async () => {
  try {
    const [followersRes, followingRes] = await Promise.all([
      axios.get(`${API_URL}/api/follow/${username}/followers`, { withCredentials: true }),
      axios.get(`${API_URL}/api/follow/${username}/following`, { withCredentials: true }),
    ]);
    setFollowers(followersRes.data.map(u => ({
      ...u,
      isFollowing: followingRes.data.some(f => f.username === u.username)
    })));
    setFollowing(followingRes.data.map(u => ({
      ...u,
      isFollowing: true
    })));
    setProfile(prev =>
      prev
        ? {
            ...prev,
            stats: {
              ...prev.stats,
              followers: followersRes.data.length,
              following: followingRes.data.length,
            },
          }
        : prev
    );
  } catch (error) {
    console.error("Error fetching followers/following:", error);
  }
};

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (username) {
      fetchPublicProfile();
      fetchUserPosts();
      fetchFollowersAndFollowing();
    }
  }, [user, username, navigate]);

  if (loading) {
    return (
      <div className="dashboard-layout">
        <MiniDrawer />
        <div className="dashboard-main-content">
          <div className="profile-container">
            <div className="loading">Loading profile...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-layout">
        <MiniDrawer />
        <div className="dashboard-main-content">
          <div className="profile-container">
            <div className="error-message">
              <p>{error}</p>
              <button onClick={fetchPublicProfile} className="retry-btn">
                Try Again
              </button>
              <button onClick={() => navigate("/")} className="back-btn">
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <MiniDrawer />
      <div className="dashboard-main-content">
        {/* Profile Action Button ,which will lead back to My Profile */}
        <div className="profile-actions-header">
          <button className="back-to-profile-btn" onClick={handleBackToProfile}>
            <AccountCircleIcon />
            Go to My Profile
          </button>
        </div>

        <ProfileComponent
          profile={profile}
          posts={posts}
          postsLoading={postsLoading}
          isOwnProfile={false}
          profileTheme={profileTheme}
          followers={followers}
          following={following}
          onFollowChange={fetchFollowersAndFollowing}
        />
      </div>
    </div>
  );
};

export default PublicProfile;
