import React, { useEffect, useState, useRef } from "react";
import MiniDrawer from "../components/MiniDrawer";
import FriendList from "../components/FriendList";
import MessageThread from "../components/MessageThread";
import MessageInput from "../components/MessageInput";
import "../style/messages.css";
import axios from "axios";
import { API_URL } from "../shared";
import { socket } from "../ws"; // <-- Use the shared socket instance

const Messages = ({ user }) => {
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const selectedFriendRef = useRef(selectedFriend);

  useEffect(() => {
  const logAny = (event, ...args) => {
    console.log("SOCKET EVENT:", event, ...args);
  };
  socket.onAny(logAny);
  return () => socket.offAny(logAny);
}, []);

  useEffect(() => {
    selectedFriendRef.current = selectedFriend;
  }, [selectedFriend]);

  // Register user with socket after login
  useEffect(() => {
    if (user && user.id) {
      socket.emit("register", user.id);
    }
  }, [user]);

  // Socket event listeners
  useEffect(() => {
    const handleReceiveMessage = (msg) => {
  console.log("handleReceiveMessage called with:", msg);
  const friend = selectedFriendRef.current;
  if (
    friend &&
    (msg.senderId === friend.id || msg.receiverId === friend.id)
  ) {
    setMessages((prev) => [...prev, msg]);
  }
};

    const handleTyping = ({ from }) => {
      if (selectedFriendRef.current && from === selectedFriendRef.current.id) {
        setIsTyping(true);
      }
    };
    const handleStopTyping = ({ from }) => {
      if (selectedFriendRef.current && from === selectedFriendRef.current.id) {
        setIsTyping(false);
      }
    };

    const handleMessagesRead = ({ by }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.receiverId === by ? { ...msg, read: true } : msg
        )
      );
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("typing", handleTyping);
    socket.on("stop_typing", handleStopTyping);
    socket.on("messages_read", handleMessagesRead);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("typing", handleTyping);
      socket.off("stop_typing", handleStopTyping);
      socket.off("messages_read", handleMessagesRead);
    };
  }, [user]);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/messages/friends`, { withCredentials: true })
      .then((res) => setFriends(res.data))
      .catch(() => setFriends([]));
  }, []);

  useEffect(() => {
    if (!selectedFriend) return;
    setLoadingMessages(true);
    axios
      .get(`${API_URL}/api/messages/${selectedFriend.id}`, {
        withCredentials: true,
      })
      .then((res) => setMessages(res.data))
      .catch(() => setMessages([]))
      .finally(() => setLoadingMessages(false));
  }, [selectedFriend]);

  useEffect(() => {
    if (socket && selectedFriend && messages.length > 0) {
      socket.emit("read_messages", { from: selectedFriend.id });
    }
  }, [selectedFriend, messages.length]);

  const handleSendMessage = async ({ content, file, fileType, spotifyEmbedUrl }) => {
    if (!selectedFriend) return;

    if (spotifyEmbedUrl) {
      socket.emit("send_message", {
        to: selectedFriend.id,
        content: "", // No text content for embed
        type: "spotify_embed",
        spotifyEmbedUrl,
      });
      return;
    }

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await axios.post(
          `${API_URL}/api/uploads/upload`,
          formData,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        const { url, type } = res.data;
        socket.emit("send_message", {
          to: selectedFriend.id,
          content: content || "",
          type: type.startsWith("image/") ? "image" : "file",
          fileUrl: url,
        });
      } catch (err) {}
    } else {
      socket.emit("send_message", {
        to: selectedFriend.id,
        content,
        type: "text",
      });
    }
  };

  const handleTyping = () => {
    if (socket && selectedFriend)
      socket.emit("typing", { to: selectedFriend.id });
  };
  const handleStopTyping = () => {
    if (socket && selectedFriend)
      socket.emit("stop_typing", { to: selectedFriend.id });
  };

  return (
    <div className="messages-theme">
      <div className="dashboard-layout">
        <MiniDrawer menuType="social" />
        <div
          className="dashboard-main-content"
          style={{ display: "flex", height: "80vh" }}
        >
          <div
            style={{
              width: 280,
              borderRight: "1px solid #eee",
              overflowY: "auto",
            }}
          >
            <FriendList
              friends={friends}
              selectedFriendId={selectedFriend?.id}
              onSelect={setSelectedFriend}
            />
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {selectedFriend ? (
              <>
                <div
                  style={{ padding: "16px", borderBottom: "1px solid #eee" }}
                >
                  <strong>{selectedFriend.username}</strong>
                </div>
                <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
                  {loadingMessages ? (
                    <div>Loading messages...</div>
                  ) : (
                    <MessageThread
                      messages={messages}
                      currentUserId={user?.id}
                      isTyping={isTyping}
                    />
                  )}
                </div>
                <div
                  style={{ borderTop: "1px solid #eee", padding: "8px 16px" }}
                >
                  <MessageInput
                    onSend={handleSendMessage}
                    onTyping={handleTyping}
                    onStopTyping={handleStopTyping}
                  />
                </div>
              </>
            ) : (
              <div style={{ padding: "32px", color: "#888" }}>
                Select a friend to start messaging.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;