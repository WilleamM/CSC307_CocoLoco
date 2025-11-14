import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import axios from 'axios'; // fetches data from an API 
import './SignUp.css';

function SignUp(props) {
  const [creds, setCreds] = useState({ userName: "", displayName: "", password: ""});
  const [msg, setMsg] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    switch(name){
      case "userName":
        setCreds({ ...creds, userName: value });
        break;
      case "displayName":
        setCreds({ ...creds, displayName: value });
        break;
      case "password":
        setCreds({ ...creds, password: value });
        break;
    }
  };

  // checks when you input text into text boxes
  // then setPerson updates person

  function submitForm() {
    props.handleSubmit(creds);
    setCreds({ userName: '', displayName: '', password: ''});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { userName, displayName, password } = creds;
      const response = await axios.post('http://localhost:8000/users', { userName, displayName, password });
      console.log('User registered:', response.data);
      setMsg("User successfully Created!")
      // Handle successful registration (e.g., redirect, show success message)
    } catch (error) {
      console.error('Error registering user:', error);
      setMsg(error.response?.data || 'Error Creating User');
      console.log('Status:', error.response?.status, 'Body:', error.response?.data);
    }
    };

    return (
    <div className="signup">
      <div className="signup-card">   {/* ← the rectangle */}
        <h1>Sign Up</h1>
        <form className="signup-form">
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
          <input
            type="button"
            value={props.buttonLabel || 'Sign Up'}
            onClick={handleSubmit}
          />
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