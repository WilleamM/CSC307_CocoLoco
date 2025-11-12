import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import axios from 'axios'; // fetches data from an API 
import './SignUp.css';

function SignUp(props) {
  const [form, setForm] = useState({ userName: '', displayName: '', bio: '', avatarUrl: ''});
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // checks when you input text into text boxes
  // then setPerson updates person
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { userName, displayName, bio, avatarUrl } = form;
      const response = await axios.post('http://localhost:8000/users', { userName, displayName, bio, avatarUrl });
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
        <form className="signup-form" onSubmit={handleSubmit}>
          <input name="userName" placeholder="Username" value={form.userName} onChange={handleChange} />
          <input name="displayName" placeholder="Display Name" value={form.displayName} onChange={handleChange} />
          <input name="bio" placeholder="Bio" value={form.bio} onChange={handleChange} />
          <input name="avatarUrl" placeholder="Avatar Url" value={form.avatarUrl} onChange={handleChange} />
          <button type="submit"> Sign up</button>
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