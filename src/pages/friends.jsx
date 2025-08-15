import React, { useEffect, useState, useCallback } from "react";
import MiniDrawer from "../components/MiniDrawer.jsx";
import FriendCard from "../components/FriendCard";
import FriendNavbar from "../components/FriendNavbar";
import SearchBar from "../components/SearchBar";
import axios from "axios";
import AddFriendForm from "../components/AddFriendFrom.jsx";
import { API_URL } from "../shared.js";

const Friends = () => {
  const [me, setMe] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [busy, setBusy] = useState({});
  const [activeTab, onTabChange] = useState("friends");
  const [query, setQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const loadFriends = useCallback(async () => {
    try {
      const meRes = await axios.get(`${API_URL}/auth/me`, {
        withCredentials: true,
      });
      const { user } = meRes.data;
      setMe(user);

      const username = user.username;

      const [followersRes, followingRes] = await Promise.all([
        fetch(`${API_URL}/api/follow/${username}/followers`, {
          credentials: "include",
        }),
        fetch(`${API_URL}/api/follow/${username}/following`, {
          credentials: "include",
        }),
      ]);

      setFollowers(await followersRes.json());
      setFollowing(await followingRes.json());
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    loadFriends();
  }, [loadFriends]);

  const toggleFollow = async (username) => {
    setBusy((prev) => ({ ...prev, [username]: true }));
    try {
      const res = await axios.post(
        `${API_URL}/api/profile/${username}/follow`,
        {},
        { withCredentials: true }
      );

      const json = res.data;

      if (json.message?.includes("Followed")) {
        if (!following.find((u) => u.username === username)) {
          setFollowing((prev) => [...prev, { username }]);
        }
      } else if (json.message?.includes("Unfollowed")) {
        setFollowing((prev) => prev.filter((u) => u.username !== username));
      }
    } finally {
      setBusy((prev) => ({ ...prev, [username]: false }));
    }
  };

  const handleToggleFollow = (username, currentlyFollowing) => {
    const action = currentlyFollowing ? "unfollow" : "follow";
    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${username}?`
    );
    if (confirmed) {
      toggleFollow(username);
    }
  };

  const renderList = () => {
    const lowerQuery = query.trim().toLowerCase();
    const filterUsers = (users) => {
      if (!lowerQuery) return users;
      return users.filter(
        (u) =>
          (u.username || "").toLowerCase().includes(lowerQuery) ||
          (u.name || "").toLowerCase().includes(lowerQuery)
      );
    };

    if (activeTab === "friends") {
      const mutuals = followers.filter((f) =>
        following.some((fl) => fl.username === f.username)
      );
      return filterUsers(mutuals).map((u) => (
        <FriendCard
          key={u.id}
          user={u}
          isFollowing
          isMe={me?.username === u.username}
          busy={!!busy[u.username]}
          onToggleFollow={() => handleToggleFollow(u.username, true)}
        />
      ));
    }

    if (activeTab === "followers") {
      return filterUsers(followers).map((u) => (
        <FriendCard
          key={u.id}
          user={u}
          isFollowing={following.some((f) => f.username === u.username)}
          isMe={me?.username === u.username}
          busy={!!busy[u.username]}
          onToggleFollow={() =>
            handleToggleFollow(
              u.username,
              following.some((f) => f.username === u.username)
            )
          }
        />
      ));
    }

    if (activeTab === "following") {
      return filterUsers(following).map((u) => (
        <FriendCard
          key={u.id}
          user={u}
          isFollowing
          isMe={me?.username === u.username}
          busy={!!busy[u.username]}
          onToggleFollow={() => handleToggleFollow(u.username, true)}
        />
      ));
    }
  };

  return (
    <div className="dashboard-layout">
      <MiniDrawer menuType="social" />
      <div className="dashboard-main-content">
        <div className="dashboard-summary">
          <h1
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Friends
            <button onClick={() => setShowSearch(true)}>+ Add Friend</button>
          </h1>
          <FriendNavbar activeTab={activeTab} onTabChange={onTabChange} />
          <SearchBar
            onSearch={setQuery}
            placeholder={
              activeTab === "friends"
                ? "Search friends..."
                : activeTab === "followers"
                ? "Search followers..."
                : "Search following..."
            }
          />
          {showSearch && (
            <AddFriendForm
          onClose={() => setShowSearch(false)}
          onFollowChange={loadFriends} 
        />
          )}
          {renderList()}
        </div>
      </div>
    </div>
  );
};

export default Friends;
