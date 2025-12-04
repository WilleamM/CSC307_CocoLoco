import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from 'react-router-dom';
import ProfilePage from './Pages/Profile_Page.jsx';
import Login from './Pages/Login.jsx';
import SignUp from './Pages/SignUp.jsx';
const INVALID_TOKEN = 'INVALID_TOKEN';
import Page_Header from './Headers/Page_Header.jsx';
import FrontPage from './Pages/Front_Page.jsx';
import CreatePost from './Pages/Create_Post.jsx';
import FriendsPage from './Pages/Friends_page.jsx';
import Profile_Page_Header from './Headers/Profile_Page_Header.jsx';
import Comments_Display_Page from './Pages/Comments_Display_Page.jsx';
import { API_BASE_URL } from './apiConfig.js';

//Home page
function Home() {
  return (
    <div>
      <h2>Home</h2>
      <Link to="/login">Go to login</Link>
      <br />
      <Link to="/signup">Go to signup</Link>
    </div>
  );
}

//Used to login the user into their profile page
function ProtectedRoute({ token, children }) {
  if (token === 'INVALID_TOKEN') {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// <Table characterData={characters}/> where characters is being passed to table as a prop
function MyApp() {
  const [token, setToken] = useState(INVALID_TOKEN);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    const savedUserId = localStorage.getItem('userId');
    const savedUserName = localStorage.getItem('userName');

    if (savedToken) {
      setToken(savedToken);
    }
    if (savedUserId) {
      setUser({ id: savedUserId, userName: savedUserName });
    }
  }, []);

  function loginUser(creds) {
    const promise = fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(creds),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json().then((payload) => {
            setToken(payload.token);
            setUser({ id: payload.userId, userName: payload.userName });
            localStorage.setItem('authToken', payload.token); //Used to store the authentication token in local storage
            localStorage.setItem('userId', payload.userId);
            localStorage.setItem('userName', payload.userName);
            setMessage(`Login successful; auth token saved`);
            return payload;
          });
        } else {
          setMessage(`Login Error ${response.status}: ${response.data}`);
          throw new Error('Login failed\n');
        }
      })
      .catch((error) => {
        setMessage(`Login Error: ${error}`);
        throw error;
      });

    return promise;
  }

  //This is going to be used to logout the user
  //function logoutUser() {
  //  setToken(INVALID_TOKEN);
  //  localStorage.removeItem('authToken');
  //}

  function signupUser(creds) {
    const promise = fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(creds),
    })
      .then((response) => {
        if (response.status === 201) {
          return response.json().then((payload) => {
            setToken(payload.token);
            setUser({ id: payload.userId, userName: payload.userName });
            localStorage.setItem('authToken', payload.token); //Used to store the authentication token in local storage
            localStorage.setItem('userId', payload.userId);
            localStorage.setItem('userName', payload.userName);
            setMessage(
              `Signup successful for user: ${creds.username}; auth token saved`
            );
            return payload;
          });
        } else {
          console.log(`Signup Error ${response.status}: ${response.data}`);
        }
      })
      .catch((error) => {
        console.log(`Signup Error: ${error}`);
      });

    return promise;
  }

  useEffect(() => {
    function addAuthHeader(otherHeaders = {}) {
      if (token === INVALID_TOKEN) {
        return otherHeaders;
      } else {
        return {
          ...otherHeaders,
          Authorization: `Bearer ${token}`,
        };
      }
    }

    function fetchUsers() {
      const promise = fetch(`${API_BASE_URL}/users`, {
        headers: addAuthHeader(),
      });

      return promise;
    }

    fetchUsers()
      .then((res) => (res.status === 200 ? res.json() : undefined))
      .then((json) => {
        if (json) {
          console.log('Users fetched successfully');
        } else {
          console.log('Failed to fetch users');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [token]);

  function logoutUser() {
    setToken(INVALID_TOKEN);
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
  }

  return (
    <Router>
      <Page_Header user={user} onLogout={logoutUser} />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute token={token}>
              <FrontPage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login handleSubmit={loginUser} />} />
        <Route
          path="/signup"
          element={<SignUp handleSubmit={signupUser} buttonLabel="Sign Up" />}
        />
        <Route
          path="/profile/:userId"
          element={
            <ProtectedRoute token={token}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/friends"
          element={
            <ProtectedRoute token={token}>
              <FriendsPage userId={user?.id} />
            </ProtectedRoute>
          }
        />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="*" element={<div>Not found</div>} />
        <Route
          path="/users/:userId/posts/:postId/comments"
          element={<Comments_Display_Page />}
        />
      </Routes>
    </Router>
  );
}

export default MyApp;
