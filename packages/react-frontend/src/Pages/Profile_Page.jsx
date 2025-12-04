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
  const placeholderImage =
    'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png';

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
          {/* Simple file input for uploading avatar */}
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) return;

              const formData = new FormData();
              formData.append('avatar', file);

              try {
                await axios.post(
                  `${API_BASE_URL}/users/${userId}/avatar`,
                  formData,
                  { headers: { 'Content-Type': 'multipart/form-data' } }
                );
                // Refetch user data to get updated avatarUrl
                const userResponse = await axios.get(
                  `${API_BASE_URL}/users/${userId}`
                );
                setUserData(userResponse.data);
                console.log('Avatar uploaded successfully');
              } catch (error) {
                console.error('Error uploading avatar:', error);
                alert('Failed to upload avatar');
              }
            }}
            style={{ marginTop: '10px' }}
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
            <p className="bio">{userData.bio || ''}</p>
          </div>
          <button className="follow-button">Follow</button>
        </div>
      </div>
      <div className="profile-tabs">
        <div className="tab active">Posts</div>
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
