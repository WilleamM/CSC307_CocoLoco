// once the comments icon is clicked or a post on the profile page is clicked, 
// it will send the user to a page with all the comments of that post

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import axios from 'axios'; //fetches data from an API
import { faComment, faLocationArrow} from "@fortawesome/free-solid-svg-icons";
import './Comments_Display_Page.css';

const Comments_Display_Page = () => {
    const {userId, postId} = useParams();
    const [userData, setUserData] = useState(null);
    const [userPost, setUserPost] = useState(null);
    const [userComments, setUserComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const placeholderImage =
    'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png';
    
    console.log('Comment page params', { userId, postId });
    
    const handlePostComment = async () => {
        if(!newComment.trim()){
            return;
        }
        if (!userData || !postId){
            return;
        }
        try{
            const response = await axios.post(`https://cocoloco-api-gud7c3e9gzbrcpaf.westus3-01.azurewebsites.net/posts/${postId}/comments`,
                {
                    authorId: userData._id,
                    authorHandle: userData.userName,
                    content: newComment.trim(),
                });
            const created = response.data;

            setUserComments((prev) => [...(prev || []), created]); //will take current list of comments and add the new comment
            setNewComment('');
        }catch(error){
            console.error('Error posting comment', error);
        }
    };

    useEffect (() => {
        //this will get the users data
        const fetchUserData = async () => {
            try{
                const response = await axios.get(`https://cocoloco-api-gud7c3e9gzbrcpaf.westus3-01.azurewebsites.net/users/${userId}`);
                setUserData(response.data);
            }catch(error){
                console.error('error fetching user data',error);
            }
        };
        fetchUserData();
    }, [userId]);

    useEffect(() => {
        if(!postId){  
            return;
        }
        const fetchPost = async () => {
            try{
                const response = await axios.get(`https://cocoloco-api-gud7c3e9gzbrcpaf.westus3-01.azurewebsites.net/posts/${postId}`);
                setUserPost(response.data);
            }catch(error){
                console.error('Error fetching post', error);
            }
        };
        fetchPost();
    }, [postId]);

    useEffect (() => { //this will get the comments
        if(!postId){
            return;
        }
        const fetchUserComments = async () => {
            try{
                const response = await axios.get(`https://cocoloco-api-gud7c3e9gzbrcpaf.westus3-01.azurewebsites.net/posts/${postId}/comments`);
                setUserComments(response.data.comments_list);
            }catch(error){
                console.error('Error fetching post comments', error);
            }
        };
        fetchUserComments();
    }, [postId]);

    if(!userData || !userPost){
        return <div>Loading...</div>;
    }

    return(
        <div className="comments-page">
            <div className="left-side">{/* this will have the image from the post that was clicked on*/}
                <div className="image-box">
                    <img src={`https://cocoloco-api-gud7c3e9gzbrcpaf.westus3-01.azurewebsites.net/posts/${postId}/image`} alt="post image" onError={(e) => {
    e.target.onerror = null;
    e.target.src = placeholderImage;
  }}/>
                </div> 
            </div>

            <div className="right-side"> {/*this will have the post, user data, and the comments*/}
                <div className="row-1"> {/* this will have the username, published date, and the caption of the post */}
                    <img className="profile-image" src={userData.avatarUrl ? `https://cocoloco-api-gud7c3e9gzbrcpaf.westus3-01.azurewebsites.net${userData.avatarUrl}` : placeholderImage} />
                    <div className="username">{userData.userName}</div>
                    <div className="date">{new Date(userPost.publishedAt).toLocaleDateString()}</div>
                    <div className="caption">{userPost.body}</div>
                </div>

                <div className="row-2"> {/*this will be for all the comments that a post has*/}
                    <span className="comment-text">Comments:</span>
                    <div className="comments">
                        {userComments.map((comment) => (
                            <div key={comment._id}>
                                <div className="comment-user">{comment.authorHandle}</div>
                                <div className="comment-body">{comment.content}</div>
                            </div>
                        ))}
                        {/* this would have to map to go through evry comment that a post has and then display it*/}
                    </div>
                </div>

                <div className="row-3">
                    <div className="comment-icon"><FontAwesomeIcon icon={faComment}/></div>
                    <div className="search bar">
                        <input type="text" placeholder="Comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)}></input>
                    </div>
                    <div className="post-comment" onClick={handlePostComment}><FontAwesomeIcon icon={faLocationArrow}/></div>
                    {/* on click it will update the comments list and show the new updated comments with the new comment*/}
                </div>
            </div>
        </div>
    );
};

export default Comments_Display_Page;
