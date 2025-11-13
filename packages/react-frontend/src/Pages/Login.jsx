import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import axios from 'axios'; // fetches data from an API
import './Login.css';

function Login(props) {
  const [creds, setCreds] = useState({
    username: '',
    pwd: '',
  });

  return (
    <div className="login">
      <div className="login-card">
        {' '}
        {/* ← the rectangle */}
        <h1>Login</h1>
        <form className="login-form">
          <input
            type="text"
            name="username"
            id="username"
            value={creds.username}
            onChange={handleChange}
            placeholder="Username"
          />
          <input type="password" placeholder="Password" />
          <input
            type="button"
            value={props.buttonLabel || 'Sign In'}
            onClick={submitForm}
          />
        </form>
        <p>
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </div>
    </div>
  );

  // checks when you input text into text boxes
  function handleChange(event) {
    const { name, value } = event.target;
    switch (name) {
      case 'username':
        setCreds({ ...creds, username: value });
        break;
      case 'password':
        setCreds({ ...creds, pwd: value });
        break;
    }
  }

  function submitForm() {
    props.handleSubmit(creds);
    setCreds({ username: '', pwd: '' });
  }
}

export default Login;
