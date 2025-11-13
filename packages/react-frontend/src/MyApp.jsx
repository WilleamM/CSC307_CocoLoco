import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ProfilePage from './Pages/Profile_Page.jsx';
import Login from './Pages/Login.jsx';
import SignUp from './Pages/SignUp.jsx';

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
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        <Route path="*" element={<div>Not found</div>} />
      </Routes>
    </Router>
  );
}
export default MyApp;

//              AUTHENTICATION

// Instructions say to make the below modification to useEffect() in MyApp(), but the original useEffect() was removed and MyApp()'s structure was changed.
// However, it's unclear whether the below is necessary for authentication to function, so we may be able to get by without it.
// If, in a future commit, authetication is working, these comments can be deleted.
/*
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
    .catch
      ...
}
*/

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
