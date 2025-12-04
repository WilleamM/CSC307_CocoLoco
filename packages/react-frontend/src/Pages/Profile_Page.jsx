import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; // fetches data from an API
import './ProfilePage.css';
import { API_BASE_URL } from '../apiConfig.js';

const ProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [userPost, setUserPost] = useState(null);
  const [editingBio, setEditingBio] = useState(false);
  const [bioDraft, setBioDraft] = useState('');
  const placeholderImage =
    'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png';

  // will fetch user data from the backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
        setUserData(response.data);
        setBioDraft(response.data.bio || '');
      } catch (error) {
        console.error('Error fetching data user', error);
      }
    };
    fetchUserData();
  }, [userId]);

  useEffect(() => {
    //this will be for getting the posts for a specfic user based off Id,  and will add when ImageUrl implementation is done
    if (!userData) {
      //this will wait for the userData useEffect to finish
      return;
    }
    const fetchUserPost = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/posts`, {
          params: { authorId: userId },
        });
        setUserPost(response.data.posts_list);
      } catch (error) {
        console.error('Error fetching user posts', error);
      }
    }; // will check if the user exists before fetching for posts
    fetchUserPost();
  }, [userId, userData]);

  const handleStartEditBio = () => {
    setBioDraft(userData?.bio || '');
    setEditingBio(true);
  };

  const handleSaveBio = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.put(
        `${API_BASE_URL}/users/${userId}/bio`,
        { bio: bioDraft },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserData((prev) => ({ ...prev, bio: res.data.bio }));
      setEditingBio(false);
    } catch (error) {
      console.error('Error updating bio', error);
    }
  };

  if (!userData) {
    //if there's no user found then it will just put a Loading on their screen
    return <div>Loading...</div>;
  }

  return (
    //but if user is found then it will display their profile onto to the screen
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-image">
          <img
            src={
              userData.avatarUrl
                ? `${API_BASE_URL}${userData.avatarUrl}?t=${userData.updatedAt || Date.now()}`
                : placeholderImage
            }
            alt="Profile"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = placeholderImage;
            }}
          />
        </div>
        <div className="profile-info">
          <h2 className="display-name">{userData.displayName}</h2>
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-value">{userData.posts || 0}</span>
              <span className="stat-label">Posts</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{userData.followers || 0}</span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{userData.following || 0}</span>
              <span className="stat-label">Following</span>
            </div>
          </div>
          <div className="profile-bio">
            <p className="username">{userData.userName}</p>
            {editingBio ? (
              <>
                <textarea
                  className="bio-input"
                  value={bioDraft}
                  onChange={(e) => setBioDraft(e.target.value)}
                  rows={3}
                />
                <div>
                  <button className="follow-button" onClick={handleSaveBio}>
                    Save
                  </button>
                  <button
                    className="follow-button"
                    onClick={() => setEditingBio(false)}
                    style={{ marginLeft: '8px' }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="bio">{userData.bio || ''}</p>
                <button className="follow-button" onClick={handleStartEditBio}>
                  Change Bio
                </button>
              </>
            )}
          </div>
          <button className="follow-button">Follow</button>
        </div>
      </div>
      <div className="profile-tabs">
        <div className="tab active">Posts</div>
      </div>
      <div style={{ marginTop: '10px' }}>
        <button className="follow-button" onClick={() => navigate('/friends')}>
          Go to Friends Feed
        </button>
      </div>
      <div className="profile-posts">
        <div className="post-grid">
          {(() => {
            if (userPost && userPost.length > 0) {
              return userPost.map((post) => (
                <div
                  key={post._id}
                  onClick={() =>
                    navigate(`/users/${userId}/posts/${post._id}/comments`)
                  }
                  className="post-item"
                >
                  <img
                    src={
                      post.image
                        ? `${API_BASE_URL}/posts/${post._id}/image`
                        : placeholderImage
                    }
                    alt="post"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = placeholderImage;
                    }}
                  />
                </div>
              ));
            } else {
              return <div className="post-placeholder">No posts yet</div>;
            }
          })()}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
