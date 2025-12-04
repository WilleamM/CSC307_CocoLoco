import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { API_BASE_URL } from '../apiConfig.js';
import { useNavigate } from 'react-router-dom';
import './Front_Page.css';

const FrontPage = () => {
  const [posts, setPosts] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]); // store suggested users
  const hasMorePostsRef = useRef(true); // tracks if there are more posts to load
  const loadingRef = useRef(false); // tracks if data is being fetched
  const navigate = useNavigate();
  const placeholderImage =
    'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png';

  const fetchPosts = async () => {
    if (loadingRef.current || !hasMorePostsRef.current) return; // prevents if already loading or no more posts

    loadingRef.current = true; // mark as loading

    try {
      const response = await axios.get(`${API_BASE_URL}/posts`);

      const newPosts = response.data.posts_list || [];

      // full list of posts from the backend
      setPosts(newPosts);
      hasMorePostsRef.current = false;
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      loadingRef.current = false; // resets loading state
    }
  };

  // fetches posts for the user
  useEffect(() => {
    setPosts([]);
    hasMorePostsRef.current = true;
    fetchPosts();
  }, []);

  // Fetch suggested users
  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      const storedId = localStorage.getItem('userId');
      if (!storedId) {
        setSuggestedUsers([]);
        return;
      }
      try {
        const response = await axios.get(`${API_BASE_URL}/suggested-users`, {
          params: { id: storedId },
        });
        setSuggestedUsers(response.data.suggestedUsers || []);
      } catch (error) {
        console.error('Error fetching suggested users:', error);
        setSuggestedUsers([]);
      }
    };

    fetchSuggestedUsers();
  }, []); // Fetch suggested users once on mount

  return (
    <div className="front-page">
      {/* Left Column: Suggested Users */}
      <div className="left-column">
        <span className="left-text">Suggested For You</span>
        <div>
          {suggestedUsers.length === 0 && <div>Loading suggested users...</div>}
          {suggestedUsers.map((user, index) => (
            <div key={index} className="profile-info">
              <div className="profile-image">
                <img
                  src={
                    user.avatarUrl
                      ? `${API_BASE_URL}${user.avatarUrl}`
                      : placeholderImage
                  }
                  alt="profile"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = placeholderImage;
                  }}
                />
              </div>
              <div className="display-name">{user.displayName}</div>
              <button>Add</button>
            </div>
          ))}
        </div>
      </div>

      {/* Middle Column: Posts from the user */}
      <div className="middle-column">
        {posts.length === 0 && <div>Loading posts...</div>}
        {posts.map((post, index) => (
          <div key={index} className="post-rec">
            <div className="top-of-rec">
              <div className="post-header">
                <div className="profile-info">
                  <div className="display-name">{post.author}</div>
                  <div className="post-date">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </div>
                  {post.title && <div className="post-title">{post.title}</div>}
                  <div className="post-cap">{post.body}</div>
                </div>
              </div>
            </div>

            {post.image && (
              <div className="mid-of-rec">
                <img
                  src={`${API_BASE_URL}/posts/${post._id}/image`}
                  alt="post"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = placeholderImage;
                  }}
                />
              </div>
            )}

            <div className="bottom-of-rec">
              <div className="actions-bot-header">
                <div className="like">
                  <button>
                    <FontAwesomeIcon icon={faThumbsUp} />
                    <span>{post.likes.length} Likes</span>
                  </button>
                </div>
                <div className="comment">
                  <button
                    onClick={() =>
                      navigate(
                        `/users/${post.authorId}/posts/${post._id}/comments`
                      )
                    }
                  >
                    <FontAwesomeIcon icon={faComment} />
                    <span>{post.comments.length} Comments</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {hasMorePostsRef.current === false && <div>No more posts to load.</div>}
      </div>

    </div>
  );
};

export default FrontPage;
