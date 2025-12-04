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
  const [allUsers, setAllUsers] = useState([]);
  const hasMorePostsRef = useRef(true); // tracks if there are more posts to load
  const loadingRef = useRef(false); // tracks if data is being fetched
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({
    id: localStorage.getItem('userId') || '',
    token: localStorage.getItem('authToken') || '',
  });
  const placeholderImage =
    'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png';

  const fetchPosts = async () => {
    if (loadingRef.current || !hasMorePostsRef.current) return; // prevents if already loading or no more posts

    loadingRef.current = true; // mark as loading

    try {
      const response = await axios.get(`${API_BASE_URL}/posts`);

      const newPosts = (response.data.posts_list || []).map((p) => ({
        ...p,
        likesCount: Array.isArray(p.likes) ? p.likes.length : 0,
        liked:
          currentUser.id &&
          Array.isArray(p.likes) &&
          p.likes.some((id) => String(id) === String(currentUser.id)),
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
  }, [currentUser.id]);

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

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/users`)
      .then((res) => {
        const list = res.data?.users_list || [];
        setAllUsers(list);
      })
      .catch((err) => {
        console.error('Error fetching users list', err);
        setAllUsers([]);
      });
  }, []);

  const handleToggleLike = async (postId) => {
    if (!currentUser.id || !currentUser.token) {
      console.warn('Must be logged in to like');
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${currentUser.token}` } }
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
      {/* Right Column: All users */}
      <div className="right-column">
        <span>All Users</span>
        {allUsers.length === 0 && <div>Loading users...</div>}
        {allUsers.map((u) => (
          <div key={u._id} className="profile-info">
            <div className="profile-image">
              <img
                src={
                  u.avatarUrl
                    ? `${API_BASE_URL}${u.avatarUrl}`
                    : placeholderImage
                }
                alt="profile"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = placeholderImage;
                }}
              />
            </div>
            <div className="display-name">{u.userName}</div>
            <div className="followers">{u.followers || 0} followers</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FrontPage;
