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
import User_page from './Pages/User_page.jsx';
const INVALID_TOKEN = 'INVALID_TOKEN';
import Page_Header from './Headers/Page_Header.jsx';
import FrontPage from './Pages/Front_Page.jsx';
import CreatePost from './Pages/Create_Post.jsx';
import FriendsPage from './Pages/Friends_page.jsx';
import { API_BASE_URL } from './apiConfig.js';

//This is needed for the fetch to work correctly it connects to the DB
const API_PREFIX =
  'https://cocoloco-api-gud7c3e9gzbrcpaf.westus3-01.azurewebsites.net'; //'http://localhost:8000';

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

    if (savedToken) {
      setToken(savedToken);
    }
    if (savedUserId) {
      setUser({ id: savedUserId });
    }
  }, []);

  function loginUser(creds) {
    const promise = fetch(`${API_PREFIX}/login`, {
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
    const promise = fetch(`${API_PREFIX}/signup`, {
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
      const promise = fetch(`${API_PREFIX}/users`, {
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

  return (
    <Router>
      <Page_Header />
      <Routes>
        <Route path="/" element={<FrontPage />} />
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
          path="/user/:userId"
          element={
            <ProtectedRoute token={token}>
              <User_page />
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
      </Routes>
    </Router>
  );
}

export default MyApp;
