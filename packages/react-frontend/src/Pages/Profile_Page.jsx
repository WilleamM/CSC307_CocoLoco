import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'; // fetches data from an API 
import './ProfilePage.css';

const ProfilePage = () => {
    const {userId} = useParams();
    const [userData, setUserData] = useState(null);

    // will fetch user data from the backend 
    useEffect(()=>{
        const fetchUserData = async () => {
            try{
                const response = await axios.get(`http://localhost:8000/users/${userId}`);
                setUserData(response.data);
            }catch (error){
                console.error("Error fetching data user", error)
            }
        };
        fetchUserData();
    }, [userId]);
    
    if (!userData){ //if there's no user found then it will just put a Loading on their screen 
        return <div>Loading...</div>;
    } 

    return( //but if user is found then it will display their profile onto to the screen 
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-image">
                    <img 
                        src={userData.avatarUrl || 'cry.png'} 
                        alt={userData.displayName} 
                    />
                </div>
                <div className="profile-info">
                    <h2 className="display-name">{userData.displayName}</h2>
                    <div className="profile-stats">
                        <div className="stat-item">
                            <span className="stat-value">{userData.posts || 0}</span>
                            <span className="stat-label">posts</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">{userData.followers || 0}</span>
                            <span className="stat-label">followers</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">{userData.following || 0}</span>
                            <span className="stat-label">following</span>
                        </div>
                    </div>
                    <div className="profile-bio">
                        <p className="username">{userData.userName}</p>
                        <p className="bio">{userData.bio || ''}</p>
                    </div>
                    <button className="follow-button">
                        Follow
                    </button>
                </div>
            </div>
            <div className="profile-tabs">
                <div className="tab active">Posts</div>
            </div>
            <div className="profile-posts">
              <div className="post-grid">
                    {(() => {
                        if (userData.posts > 0) {
                            return (
                                <div className="post-item">
                                    <img src="/cry.png" alt="Crying" />
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
  
export default ProfilePage;