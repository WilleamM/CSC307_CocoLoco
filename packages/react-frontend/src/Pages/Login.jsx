import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import './Login.css';

function Login(props) {
  const navigate = useNavigate();
  const [creds, setCreds] = useState({
    userName: '',
    password: '',
  });
  const [msg, setMsg] = useState('');

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

  const submitForm = async (event) => {
    event.preventDefault();
    try {
      await props.handleSubmit(creds);
      setMsg('User successfully logged in!\n');
      navigate(`/user/${creds._id}`);
    } catch (error) {
      console.error('Error logging user:', error);
      setMsg(error.response?.data || 'Error logging User');
      console.log(
        'Status:',
        error.response?.status,
        'Body:',
        error.response?.data
      );
    }
  };

  return (
    <div className="login">
      <div className="login-card">
        {' '}
        {/* ← the rectangle */}
        <h1>Login</h1>
        <form className="login-form" onSubmit={submitForm}>
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
          <input type="submit" value={props.buttonLabel || 'Login'} />
        </form>
        <p>
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
