import React, { useEffect, useState } from "react";
import axios from "axios";

const MyPost = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/posts/mine", { withCredentials: true })
      .then((res) => setPosts(res.data))
      .catch((err) => console.error("Failed to fetch my posts:", err));
  }, []);

  return (
    <div className="dashboard-summary">
      <h1>My Posts</h1>
      {posts.length === 0 ? (
        <p>You haven't created any posts yet.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="post-card">
            <h3>{post.title}</h3>
            <p>{post.description}</p>
            <p>Status: {post.status}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default MyPost;
