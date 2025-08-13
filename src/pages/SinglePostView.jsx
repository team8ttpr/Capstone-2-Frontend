// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { API_URL } from "../shared";
// import { useNavigate, useParams } from "react-router-dom";

// const SinglePostView = ({ user }) => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [post, setPost] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [linkCopied, setLinkCopied] = useState(false);

//   useEffect(() => {
//     if (id) {
//       fetchPost();
//     }
//   }, [id]);

//   const fetchPost = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${API_URL}/api/posts/${id}`, {
//         withCredentials: true,
//       });
//       setPost(response.data);
//     } catch (error) {
//       setError("Failed to load post.");
//     } finally {
//       setLoading(false);
//     }
//   };

  
//   const handleShare = () => {
//     const postUrl = `${window.location.origin}/post/${id}`;
//     navigator.clipboard.writeText(postUrl)
//       .then(() => {
//         setLinkCopied(true);
//         setTimeout(() => setLinkCopied(false), 2000);
//       })
//       .catch(err => {
//         console.error('Failed to copy:', err);
//       });
//   };

//   if (loading) {
//     return <div>Loading post...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   if (!post) {
//     return <div>Post not found</div>;
//   }

//   return (
//     <div>
//       <h1>{post.author.username}</h1>

//       <div className="Profilepicture">
//         <img
//           src={post.author.spotifyProfileImage}
//           alt="User Avatar"
//           style={{ width: "50px", height: "50px", borderRadius: "50%" }}
//         />
//       </div>

//       <h2>{post.title}</h2>
//       <h3>{post.description}</h3>

//       <div className="musicEmbd">
//         <iframe
//           src={post.spotifyEmbedUrl}
//           width="100%"
//           allowtransparency="true"
//           allow="encrypted-media"
//           title={`Spotify ${post.spotifyType}: ${post.title}`}
//           style={{ border: "none" }}
//         />
//       </div>

//       <h4>{post.status}</h4>
//       <div className="singleViewButtons">
//         <button className="Comment-btn">Comments</button>
//         <button className="Like-btn">Like</button>
//         <button 
//           className="Share-btn" 
//           onClick={handleShare}
//         >
//           {linkCopied ? "Link Copied!" : "Share"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default SinglePostView;




import "../style/SinglePostView.css"
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../shared";
import { useNavigate, useParams } from "react-router-dom";

const SinglePostView = ({ user }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/posts/${id}`, {
        withCredentials: true,
      });
      setPost(response.data);
    } catch (error) {
      setError("Failed to load post.");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    const postUrl = `${window.location.origin}/post/${id}`;
    navigator.clipboard.writeText(postUrl)
      .then(() => {
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy:', err);
      });
  };

  if (loading) return <div className="loading-screen">Loading post...</div>;
  if (error) return <div className="error-screen">Error: {error}</div>;
  if (!post) return <div className="not-found-screen">Post not found</div>;

  return (
    <div className="fullscreen-post">
      {/* Header Section */}
      <header className="post-header">
        <div className="user-info">
          <img 
            src={post.author.spotifyProfileImage} 
            alt="Profile" 
            className="profile-image"
          />
          <div className="user-meta">
            <span className="username">{post.author.username}</span>
            <span className="post-date">{new Date(post.createdAt).toLocaleString()}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="post-content">
        <div className="title-section">
          <h1 className="post-title">{post.title}</h1>
          <span className="post-status">{post.status}</span>
        </div>

        <div className="content-row">
          <div className="description-section">
            <p className="post-description">{post.description}</p>
            <div className="track-info">
              <span className="views">4K</span>
              <p className="artists">{post.artists}</p>
              <p className="duration">{post.duration}</p>
            </div>
          </div>

          <div className="spotify-embed">
            <iframe
              src={post.spotifyEmbedUrl}
              width="100%"
              height="80"
              allowtransparency="true"
              allow="encrypted-media"
              title={`Spotify ${post.spotifyType}: ${post.title}`}
            />
          </div>
        </div>
      </main>

      {/* Footer Actions */}
      <footer className="post-actions">
        <button className="action-btn">
          <span className="action-icon">💬</span> Comment
        </button>
        <button className="action-btn">
          <span className="action-icon">❤️</span> Like
        </button>
        <button className="action-btn" onClick={handleShare}>
          <span className="action-icon">↗️</span> {linkCopied ? "Copied!" : "Share"}
        </button>
      </footer>
    </div>
  );
};

export default SinglePostView;






