import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import './Front_Page.css';
import { API_BASE_URL } from '../apiConfig.js';

const FriendsPage = ({ userId }) => {
  const [posts, setPosts] = useState([]);
  const [followingUsers, setFollowingUsers] = useState([]);
  const hasMorePostsRef = useRef(true); // tracks if there are more posts to load
  const loadingRef = useRef(false); // tracks if data is being fetched
  const placeholderImage =
    'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png';
  const currentUserId = userId || localStorage.getItem('userId');
  const token = localStorage.getItem('authToken');

  const fetchPosts = async () => {
    if (loadingRef.current || !hasMorePostsRef.current) return; // prevents if already loading or no more posts

    loadingRef.current = true; // mark as loading

    try {
      const response = await axios.get(`${API_BASE_URL}/feed`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const newPosts = (response.data.posts_list || []).map((p) => ({
        ...p,
        likesCount: Array.isArray(p.likes) ? p.likes.length : 0,
        liked:
          currentUserId &&
          Array.isArray(p.likes) &&
          p.likes.some((id) => String(id) === String(currentUserId)),
      }));

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
  }, [currentUserId, token]);

  useEffect(() => {
    if (!currentUserId || !token) return;
    axios
      .get(`${API_BASE_URL}/users/${currentUserId}/following`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setFollowingUsers(res.data.following || []);
      })
      .catch((err) => {
        console.error('Error fetching following list', err);
        setFollowingUsers([]);
      });
  }, [currentUserId, token]);

  const handleToggleLike = async (postId) => {
    if (!currentUserId || !token) {
      console.warn('Must be logged in to like');
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { likes, liked } = response.data;
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? {
                ...p,
                likesCount: typeof likes === 'number' ? likes : p.likesCount,
                liked,
              }
            : p
        )
      );
    } catch (error) {
      console.error('Error toggling like', error);
    }
  };

  return (
    <div className="front-page">
      {/* Left spacer (optional content) */}
      <div className="left-column"></div>

      {/* Middle Column: Posts from followed users */}
      <div className="middle-column">
        {posts.length === 0 && <div>Loading posts...</div>}
        {posts.map((post, index) => (
          <div key={index} className="post-rec">
            <div className="top-of-rec">
              <div className="post-meta">
                <div className="meta-left">
                  <div className="display-name">{post.author}</div>
                  {post.title && <div className="post-title">{post.title}</div>}
                </div>
                <div className="post-date">
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString()
                    : ''}
                </div>
              </div>
              <div className="post-cap">{post.body}</div>
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
                  <button
                    className={post.liked ? 'liked' : ''}
                    onClick={() => handleToggleLike(post._id)}
                  >
                    <FontAwesomeIcon icon={faThumbsUp} />
                    <span>
                      {post.likesCount ?? (post.likes || []).length} Likes
                    </span>
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

      {/* Right Column: people you follow */}
      <div className="right-column">
        <span>Following</span>
        {followingUsers.length === 0 && <div>No follows yet.</div>}
        {followingUsers.map((u) => (
          <div key={u._id} className="profile-info">
            <div className="profile-image">
              <img
                src={
                  u.avatarUrl
                    ? `${API_BASE_URL}${u.avatarUrl}`
                    : 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
                }
                alt="profile"
              />
            </div>
            <div className="display-name">{u.displayName || u.userName}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendsPage;
