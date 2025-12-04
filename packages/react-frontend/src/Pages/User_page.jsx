import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'; // fetches data from an API
import './ProfilePage.css';
import { API_BASE_URL } from '../apiConfig.js';

const UserPage = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [, setUserPost] = useState(null);
  const [editingBio, setEditingBio] = useState(false);
  const [bioDraft, setBioDraft] = useState('');

  // will fetch user data from the backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching data user', error);
      }
    };
    fetchUserData();
  }, [userId]);

  useEffect(() => {
    //this will for the posts and will fetch from the database
    const fetchUserPost = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/posts/${userId}`, {
          params: { author: userId },
        });
        setUserPost(response.data);
      } catch (error) {
        console.error('Error fetching posts user', error);
      }
    };
    fetchUserPost();
  }, [userId]);

  if (!userData) {
    //if there's no user found then it will just put a Loading on their screen
    return <div>Loading...</div>;
  }

  const handleStartEditBio = () => {
    setBioDraft(userData.bio || '');
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

      // Update local user data with new bio
      setUserData((prev) => ({ ...prev, bio: res.data.bio }));
      setEditingBio(false);
    } catch (error) {
      console.error('Error updating bio', error);
    }
  };

  return (
    //but if user is found then it will display their profile onto to the screen
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-image">
          <img src={userData.avatarUrl || 'https://placehold.co/600x400'} />
        </div>
        <div className="profile-info">
          <h2 className="display-name">{userData.displayName}</h2>
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-value">{userData.Posts || 0}</span>
              <span className="stat-label">posts</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{userData.Followers || 0}</span>
              <span className="stat-label">followers</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{userData.Following || 0}</span>
              <span className="stat-label">following</span>
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
        </div>
      </div>
      <div className="profile-tabs">
        <div className="tab active">Posts</div>
      </div>
      <div style={{ marginTop: '10px' }}>
        <Link to="/friends">
          <button className="follow-button">Go to Friends Feed</button>
        </Link>
      </div>
      <div className="profile-posts">
        <div className="post-grid">
          {(() => {
            if (userData.posts > 0) {
              return (
                <div className="post-item">
                  <img src="https://placehold.co/600x400" />
                </div>
              );
            } else {
              return <div className="post-placeholder">No posts yet</div>;
            }
          })()}
        </div>
      </div>
    </div>
  );
};

export default UserPage;
