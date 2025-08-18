import React, { useEffect, useState, useRef } from "react";
import MiniDrawer from "../components/MiniDrawer";
import FriendList from "../components/FriendList";
import MessageThread from "../components/MessageThread";
import MessageInput from "../components/MessageInput";
import "../style/messages.css";
import axios from "axios";
import { API_URL } from "../shared";
import { io } from "socket.io-client";

const Messages = ({ user }) => {
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const socketRef = useRef();
  const selectedFriendRef = useRef(selectedFriend);

  useEffect(() => {
    selectedFriendRef.current = selectedFriend;
  }, [selectedFriend]);

  useEffect(() => {
    console.log("Connecting to Socket.IO server at", API_URL);
    socketRef.current = io(API_URL, {
      withCredentials: true,
      auth: { token: localStorage.getItem("token") },
    });

    socketRef.current.on("connect", () => {
      console.log("Socket connected", socketRef.current.id);
      if (user && user.id) {
        console.log("Registering user on connect", user.id);
        socketRef.current.emit("register", user.id);
      }
      socketRef.current.emit("test_event", { hello: "world" });
    });

    socketRef.current.on("receive_message", (msg) => {
      console.log("Received message via socket:", msg);
      const friend = selectedFriendRef.current;
      if (
        friend &&
        (msg.senderId === friend.id || msg.receiverId === friend.id)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    socketRef.current.on("test_event", (data) => {
      console.log("Test event echo from server:", data);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socketRef.current && socketRef.current.connected && user && user.id) {
      console.log("Registering user (user changed)", user.id);
      socketRef.current.emit("register", user.id);
    }
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

  const handleSendMessage = async (content) => {
    if (!selectedFriend) return;
  socketRef.current.emit("send_message", {
    to: selectedFriend.id,
    content,
  });
    try {
      await axios.post(
        `${API_URL}/api/messages/${selectedFriend.id}`,
        { content },
        { withCredentials: true }
      );
    } catch (err) {}
  };

  return (
    <div className="messages-theme">
      <div className="dashboard-layout">
        <MiniDrawer menuType="social" />
        <div
          className="dashboard-main-content"
          style={{ display: "flex", height: "80vh" }}
        >
          {/* Left: Friend List */}
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
          {/* Right: Messages */}
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
                    />
                  )}
                </div>
                <div
                  style={{ borderTop: "1px solid #eee", padding: "8px 16px" }}
                >
                  <MessageInput onSend={handleSendMessage} />
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
