import React from "react";

const getProfileImage = (profile) => {
  return (
    profile?.profileImage ||
    profile?.spotifyProfileImage ||
    profile?.avatarURL ||
    "/default-avatar.png"
  );
};

const FriendList = ({ friends, selectedFriendId, onSelect }) => (
  <div className="friend-list">
    {friends.map(friend => (
      <div
        key={friend.id}
        className={`friend-list-item${selectedFriendId === friend.id ? " selected" : ""}`}
        onClick={() => onSelect(friend)}
      >
        <img
          src={getProfileImage(friend)}
          alt={friend.username}
          className="friend-avatar"
        />
        <span>{friend.username}</span>
      </div>
    ))}
  </div>
);

export default FriendList;