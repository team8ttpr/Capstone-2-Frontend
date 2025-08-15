import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../shared";
import { useParams, useNavigate } from "react-router-dom";
import ProfileComponent from "../components/ProfileComponent";
import { loadUserTheme, getTheme } from "../utils/themeManager";
import '../style/ShareProfile.css';

const ShareProfile = () => {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profileThemeId, setProfileThemeId] = useState("default");
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const { username } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (username) {
      fetchPublicProfile();
      fetchUserPosts();
      fetchFollowersAndFollowing();
    }
  }, [username]);

  const fetchPublicProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${API_URL}/api/profile/${username}`);
      setProfile(response.data);
      const userThemeId = response.data.profileTheme || (await loadUserTheme(username));
      setProfileThemeId(userThemeId);
    } catch (error) {
      setError("Profile not found");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/profile/${username}/posts`);
      setPosts(response.data);
    } catch (error) {
    }
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

  const handleLogoClick = () => {
    navigate("/dashboard");
  };

  const theme = getTheme(profileThemeId);

  if (loading) {
    return (
      <div className="shareprofile-root" style={{ minHeight: '100vh', background: theme.cardBg }}>
        <nav className="shareprofile-navbar" style={{ background: theme.cardBg, color: theme.primary, borderBottom: `1px solid ${theme.border}` }} onClick={handleLogoClick}>
          Spotter
        </nav>
        <div className="shareprofile-loading" style={{ color: theme.textPrimary }}>Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shareprofile-root" style={{ minHeight: '100vh', background: theme.cardBg }}>
        <nav className="shareprofile-navbar" style={{ background: theme.cardBg, color: theme.primary, borderBottom: `1px solid ${theme.border}` }} onClick={handleLogoClick}>
          Spotter
        </nav>
        <div className="shareprofile-error" style={{ color: theme.textPrimary }}>{error}</div>
      </div>
    );
  }

  return (
    <div className="shareprofile-root" style={{ minHeight: '100vh', background: theme.cardBg }}>
      <nav className="shareprofile-navbar" style={{ background: theme.cardBg, color: theme.primary, borderBottom: `1px solid ${theme.border}` }} onClick={handleLogoClick}>
        Spotter
      </nav>
      <div className="shareprofile-content">
        <ProfileComponent
          profile={profile}
          posts={posts}
          postsLoading={false}
          isOwnProfile={false}
          profileTheme={profileThemeId}
          followers={followers}
          following={following}
          onFollowChange={fetchFollowersAndFollowing}
        />
      </div>
    </div>
  );
};

export default ShareProfile;