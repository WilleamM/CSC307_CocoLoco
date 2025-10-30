import React, { useState } from "react";

function Login(props) {
  const [person, setPerson] = useState({name: ""});

  // checks when you input text into text boxes
  // then setPerson updates person
  function handleChange(event){
    const { name, value } = event.target;
    if (name == "job")
        setPerson({ name: person["name"], job: value});
    else setPerson({ name: value, job: person["job"]});
  }

  function submitForm(){
    props.handleSubmit(person); // gives person to updateList
    setPerson({ name: "", job: ""}); // reset after submission
    }

    return (
    <div className="page-center">
      <form className="login-rect" onSubmit={submitForm}>
        <label htmlFor="Login" className="label">Login</label>
        <input
          id="name"
          name="name"
          className="input"
          type="text"
          placeholder="Username"
          value={person.name}
          onChange={handleChange}
        />
        <button className="btn" type="submit" disabled={!person.name.trim()}>
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;