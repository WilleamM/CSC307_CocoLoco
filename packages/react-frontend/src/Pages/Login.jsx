import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from 'react-router-dom';
import axios from 'axios'; // fetches data from an API
import './Login.css';

function Login(props) {
  const [person, setPerson] = useState({ name: '' });

  // checks when you input text into text boxes
  // then setPerson updates person
  function handleChange(event) {
    const { name, value } = event.target;
    if (name == 'job') setPerson({ name: person['name'], job: value });
    else setPerson({ name: value, job: person['job'] });
  }

  function submitForm() {
    props.handleSubmit(person); // gives person to updateList
    setPerson({ name: '', job: '' }); // reset after submission
  }

  return (
    <div className="login">
      <div className="login-card">
        {' '}
        {/* ← the rectangle */}
        <h1>Login</h1>
        <form className="login-form">
          <input placeholder="Username" />
          <input type="password" placeholder="Password" />
          <button
            type="button"
            onClick={() => {
              window.location.assign('/profile/690051534be4054686ca6757');
            }}
          >
            Sign in
          </button>
        </form>
        <p>
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
