import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ProfilePage from './Pages/Profile_Page.jsx';
import Login from './Pages/Login.jsx';
import SignUp from './Pages/SignUp.jsx';
import Page_Header from './Headers/Page_Header.jsx';
import FrontPage from './Pages/Front_Page.jsx';
import CreatePost from './Pages/Create_Post.jsx';
import Profile_Page_Header from './Headers/Profile_Page_Header.jsx';
import Comments_Display_Page from './Pages/Comments_Display_Page.jsx';

//This is needed for the fetch to work correctly it connects to the DB
const API_PREFIX =
  'https://cocoloco-api-gud7c3e9gzbrcpaf.westus3-01.azurewebsites.net';

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

// <Table characterData={characters}/> where characters is being passed to table as a prop
function MyApp() {
  const INVALID_TOKEN = 'INVALID_TOKEN';
  const [token, setToken] = useState(INVALID_TOKEN);

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
          response.json().then((payload) => setToken(payload.token));
          console.log(`Login successful; auth token saved`);
        } else {
          console.log(`Login Error ${response.status}: ${response.data}`);
        }
      })
      .catch((error) => {
        console.log(`Login Error: ${error}`);
      });

    return promise;
  }

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
          response.json().then((payload) => setToken(payload.token));
          console.log(
            `Signup successful for user: ${creds.username}; auth token saved`
          );
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
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        <Route path="*" element={<div>Not found</div>} />
        <Route path="/users/:userId/posts/:postId/comments" element={<Comments_Display_Page />}/>
      </Routes>
    </Router>
  );
}

//              AUTHENTICATION

// Instructions say to make the below modification to useEffect() in MyApp(), but the original useEffect() was removed and MyApp()'s structure was changed.
// However, it's unclear whether the below is necessary for authentication to function, so we may be able to get by without it.
// If, in a future commit, authetication is working, these comments can be deleted.

// Last existing useEffect() below
// Deleted on commit 2089d5a
/*
useEffect(() => {
  fetchUsers()
    .then((res) => res.json())

    .then((json) => setCharacters(json['users_list']))

    .catch((error) => {
      console.log(error);
    });
}, []);
*/
export default MyApp;
