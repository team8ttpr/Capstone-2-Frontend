
import React, { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "../components/PostCard";
import style from "../style/PostCard.css";
import MiniDrawer from '../components/MiniDrawer';


const Feed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/posts", { withCredentials: true })
      .then((res) => {
        const publicPosts = res.data.filter((post) => post.status !== "draft");
        setPosts(publicPosts);
      })
      .catch((err) => console.error("Failed to fetch posts:", err));
  }, []);

  return (

    <div className="dashboard-summary">
      <h1 style={{ textAlign: "center" }}>Feed</h1>
      {posts.length === 0 ? (
        <p style={{ textAlign: "center" }}>No public posts yet.</p>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    <div className="dashboard-layout">
      <MiniDrawer menuType="social" />
      <div className="dashboard-main-content">
        <div className="dashboard-summary">
          <h1>Social Feed</h1>
          <p>This is the page for user's feed.</p>
        </div>
      </div>
    </div>
  );
};

export default Feed;
