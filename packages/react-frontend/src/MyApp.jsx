import React, { useState, useEffect } from 'react';
import {BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import ProfilePage from './Pages/Profile_Page.jsx';
import Login from './Pages/Login.jsx';
import SignUp from './Pages/SignUp.jsx';

//Home page
function Home(){
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
  return(
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile/:userId" element={<ProfilePage/>} />
        <Route path="*" element={<div>Not found</div>} />
      </Routes>
    </Router>
  );
  
}
export default MyApp;
