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
  const [isTyping, setIsTyping] = useState(false);

  const socketRef = useRef();
  const selectedFriendRef = useRef(selectedFriend);

  useEffect(() => {
    selectedFriendRef.current = selectedFriend;
  }, [selectedFriend]);

  useEffect(() => {
    socketRef.current = io(API_URL, {
      withCredentials: true,
      auth: { token: localStorage.getItem("token") },
    });

    socketRef.current.on("connect", () => {
      if (user && user.id) {
        socketRef.current.emit("register", user.id);
      }
      socketRef.current.emit("test_event", { hello: "world" });
    });

    socketRef.current.on("receive_message", (msg) => {
      const friend = selectedFriendRef.current;
      if (
        friend &&
        (msg.senderId === friend.id || msg.receiverId === friend.id)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

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
    socketRef.current.on("typing", handleTyping);
    socketRef.current.on("stop_typing", handleStopTyping);

    const handleMessagesRead = ({ by }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.receiverId === by ? { ...msg, read: true } : msg
        )
      );
    };
    socketRef.current.on("messages_read", handleMessagesRead);

    socketRef.current.on("test_event", () => {});

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socketRef.current && socketRef.current.connected && user && user.id) {
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

  useEffect(() => {
    if (socketRef.current && selectedFriend && messages.length > 0) {
      socketRef.current.emit("read_messages", { from: selectedFriend.id });
    }
  }, [selectedFriend, messages.length]);

  const handleSendMessage = async ({ content, file, fileType }) => {
    if (!selectedFriend) return;

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
        socketRef.current.emit("send_message", {
          to: selectedFriend.id,
          content: content || "",
          type: type.startsWith("image/") ? "image" : "file",
          fileUrl: url,
        });
      } catch (err) {}
    } else {
      socketRef.current.emit("send_message", {
        to: selectedFriend.id,
        content,
        type: "text",
      });
    }
  };

  const handleTyping = () => {
    if (socketRef.current && selectedFriend)
      socketRef.current.emit("typing", { to: selectedFriend.id });
  };
  const handleStopTyping = () => {
    if (socketRef.current && selectedFriend)
      socketRef.current.emit("stop_typing", { to: selectedFriend.id });
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