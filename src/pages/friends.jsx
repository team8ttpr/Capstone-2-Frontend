import React, { useEffect, useState } from "react";
import MiniDrawer from "../components/MiniDrawer.jsx";
import FriendCard from "../components/FriendCard";
import FriendNavbar from "../components/FriendNavbar";
import axios from "axios";

const Friends = () => {
  const [me, setMe] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [busy, setBusy] = useState({});
  const [activeTab, onTabChange] = useState("friends");

  useEffect(() => {
    const loadFriends = async () => {
      try {
        const meRes = await axios.get("http://localhost:8080/auth/me", {
          withCredentials: true,
        });
        const { user } = meRes.data;
        setMe(user);

        const username = user.username;

        const [followersRes, followingRes] = await Promise.all([
          fetch(`http://localhost:8080/api/follow/${username}/followers`, {
            credentials: "include",
          }),
          fetch(`http://localhost:8080/api/follow/${username}/following`, {
            credentials: "include",
          }),
        ]);

        setFollowers(await followersRes.json());
        setFollowing(await followingRes.json());
      } catch (err) {
        console.error(err);
      }
    };
    loadFriends();
  }, []);

  const toggleFollow = async (username) => {
    setBusy((prev) => ({ ...prev, [username]: true }));
    try {
      const res = await axios.post(
        `http://localhost:8080/api/profile/${username}/follow`,
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
    if (activeTab === "friends") {
      const mutuals = followers.filter((f) =>
        following.some((fl) => fl.username === f.username)
      );
      return mutuals.map((u) => (
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
      return followers.map((u) => (
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
      return following.map((u) => (
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
          <h1>Friends</h1>
          <FriendNavbar activeTab={activeTab} onTabChange={onTabChange} />
          {renderList()}
        </div>
      </div>
    </div>
  );
};

export default Friends;
