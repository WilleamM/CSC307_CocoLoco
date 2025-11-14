import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ProfilePage from './Pages/Profile_Page.jsx';
import Login from './Pages/Login.jsx';
import SignUp from './Pages/SignUp.jsx';

//This is needed for the fetch to work correctly it connects to the DB
const API_PREFIX = 'http://localhost:8000'

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
  const INVALID_TOKEN = "INVALID_TOKEN";
  const [token, setToken] = useState(INVALID_TOKEN);
  const [message, setMessage] = useState("");
  const [characters, setCharacters] = useState(null);

  function loginUser(creds) {
  const promise = fetch(`${API_PREFIX}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(creds)
  })
    .then((response) => {
      if (response.status === 200) {
        response
          .json()
          .then((payload) => setToken(payload.token));
        setMessage(`Login successful; auth token saved`);
      } else {
        setMessage(
          `Login Error ${response.status}: ${response.data}`
        );
      }
    })
    .catch((error) => {
      setMessage(`Login Error: ${error}`);
    });

  return promise;
}

  function signupUser(creds) {
  const promise = fetch(`${API_PREFIX}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(creds)
  })
    .then((response) => {
      if (response.status === 201) {
        response
          .json()
          .then((payload) => setToken(payload.token));
        setMessage(
          `Signup successful for user: ${creds.username}; auth token saved`
        );
      } else {
        setMessage(
          `Signup Error ${response.status}: ${response.data}`
        );
      }
    })
    .catch((error) => {
      setMessage(`Signup Error: ${error}`);
    });

  return promise;
}

  useEffect(() => {
  fetchUsers()
    .then((res) =>
      res.status === 200 ? res.json() : undefined
    )
    .then((json) => {
      if (json) {
        setCharacters(json["users_list"]);
      } else {
        setCharacters(null);
      }
    })
    .catch((error) => {
      console.log(error);
    })
  }, [token])

  function fetchUsers() {
  const promise = fetch(`${API_PREFIX}/users`, {
    headers: addAuthHeader()
  });

  return promise;
}

function addAuthHeader(otherHeaders = {}) {
  if (token === INVALID_TOKEN) {
    return otherHeaders;
  } else {
    return {
      ...otherHeaders,
      Authorization: `Bearer ${token}`
    };
  }
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login handleSubmit={loginUser}/>} />
        <Route path="/signup" element={<SignUp handleSubmit={signupUser} buttonLabel="Sign Up" />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        <Route path="*" element={<div>Not found</div>} />
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