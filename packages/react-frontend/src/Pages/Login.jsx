import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import axios from 'axios'; // fetches data from an API
import './Login.css';

function Login(props) {
  const [creds, setCreds] = useState({
    userName: '',
    password: '',
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
            name="userName"
            id="userName"
            value={creds.userName}
            onChange={handleChange}
            placeholder="Username"
          />
          <input 
            type="password" 
            name="password"
            id="password"
            value={creds.password}
            onChange={handleChange}
            placeholder="Password" 
          />
          <input
            type="button"
            value={props.buttonLabel || 'Login'}
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
      case 'userName':
        setCreds({ ...creds, userName: value });
        break;
      case 'password':
        setCreds({ ...creds, password: value });
        break;
    }
  }

  function submitForm() {
    props.handleSubmit(creds);
    setCreds({ userName: '', password: '' });
  }
}

export default Login;
