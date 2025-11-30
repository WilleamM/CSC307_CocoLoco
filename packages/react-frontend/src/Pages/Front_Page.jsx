import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faComment,
  faShare,
  faThumbsUp,
} from '@fortawesome/free-solid-svg-icons';
import './front_page.css';

const FrontPage = () => {
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]); // Store suggested users
  const hasMorePostsRef = useRef(true); // Track if there are more posts to load
  const loadingRef = useRef(false); // Track if data is being fetched

  const fetchPosts = async () => {
    if (loadingRef.current || !hasMorePostsRef.current) return; // Prevent if already loading or no more posts

    loadingRef.current = true; // Mark as loading

    try {
      const response = await axios.get('http://localhost:8000/posts', {
        params: { userId },
      });

      const newPosts = response.data.posts || [];
      if (newPosts.length === 0) {
        hasMorePostsRef.current = false; // No more posts to load
      }

      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      loadingRef.current = false; // Reset loading state
    }
  };

  // Fetch posts for the user
  useEffect(() => {
    setPosts([]);
    hasMorePostsRef.current = true;
    fetchPosts(); // Initial fetch when component mounts
  }, [userId]); // Fetch posts when `userId` changes

  // Fetch suggested users
  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8000/suggested-users',
          {
            params: { userId },
          }
        );
        setSuggestedUsers(response.data.suggestedUsers);
      } catch (error) {
        console.error('Error fetching suggested users:', error);
      }
    };

    fetchSuggestedUsers();
  }, [userId]); // Fetch suggested users when `userId` changes

  // Handle infinite scroll
  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight;
    if (bottom && hasMorePostsRef.current) {
      // If the bottom of the page is reached, fetch more posts
      fetchPosts();
    }
  };

  return (
    <div className="front-page" onScroll={handleScroll}>
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
                    user.avatarUrl ||
                    'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
                  }
                  alt="profile"
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
                  <div className="display-name">{post.author.userName}</div>
                  <div className="post-date">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </div>
                  <div className="post-cap">{post.body}</div>
                </div>
              </div>
            </div>

            <div className="mid-of-rec">
              <img
                src={
                  post.media[0] ||
                  'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
                }
                alt="post"
                loading="lazy"
              />
            </div>

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
                <div className="share">
                  <button>
                    <FontAwesomeIcon icon={faShare} />
                    <span>Share</span>
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

export default FrontPage;
