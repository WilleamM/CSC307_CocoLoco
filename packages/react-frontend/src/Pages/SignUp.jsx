import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from 'react-router-dom';
import axios from 'axios'; // fetches data from an API
import './SignUp.css';

function SignUp(props) {
  const navigate = useNavigate();
  const [creds, setCreds] = useState({
    userName: '',
    displayName: '',
    password: '',
  });
  const [msg, setMsg] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case 'userName':
        setCreds({ ...creds, userName: value });
        break;
      case 'displayName':
        setCreds({ ...creds, displayName: value });
        break;
      case 'password':
        setCreds({ ...creds, password: value });
        break;
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = await props.handleSubmit(creds);
      setMsg('User successfully Created!');
      // Handle successful registration (e.g., redirect, show success message)
      navigate(`/user/${payload.userId}`);
    } catch (error) {
      console.error('Error registering user:', error);
      setMsg(error.response?.data || 'Error Creating User');
    }
  };

  return (
    <div className="signup">
      <div className="signup-card">
        {' '}
        {/* ← the rectangle */}
        <h1>Sign Up</h1>
        <form className="signup-form" onSubmit={onSubmit}>
          <input
            type="text"
            name="userName"
            id="userName"
            placeholder="Username"
            value={creds.userName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="displayName"
            id="displayName"
            placeholder="Display Name"
            value={creds.displayName}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            value={creds.password}
            onChange={handleChange}
          />
          <input type="submit" value={props.buttonLabel || 'Sign Up'} />
        </form>
        {msg && <p>{msg}</p>}
        <p>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
