import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import './Front_Page.css';
import { API_BASE_URL } from '../apiConfig.js';

const FriendsPage = ({ userId }) => {
  const [posts, setPosts] = useState([]);
  const hasMorePostsRef = useRef(true); // tracks if there are more posts to load
  const loadingRef = useRef(false); // tracks if data is being fetched
  const placeholderImage =
    'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png';

  const fetchPosts = async () => {
    if (loadingRef.current || !hasMorePostsRef.current) return; // prevents if already loading or no more posts

    loadingRef.current = true; // mark as loading

    try {
      const response = await axios.get(
        //'http://localhost:8000/feed',
        'https://cocoloco-api-gud7c3e9gzbrcpaf.westus3-01.azurewebsites.net/feed',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );

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

  return (
    <div className="front-page">
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
                  <button>
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

      {/* Right Column: Other content like leaderboard */}
      <div className="right-column">
        <span>Most Followed People</span>
        <div className="profile-image">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
            alt="profile"
          />
        </div>
        <div className="profile-info">
          <div className="display-name">UserName</div>
          <div className="followers">500</div>
          <span>Followers</span>
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;
