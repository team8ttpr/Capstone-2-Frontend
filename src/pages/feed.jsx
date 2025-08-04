import React, { useEffect, useState } from "react";
import axios from "axios";

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
      <h1>Feed</h1>
      {posts.length === 0 ? (
        <p>No public posts yet.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="post-card">
            <h3>{post.title}</h3>
            <p>{post.description}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Feed;
