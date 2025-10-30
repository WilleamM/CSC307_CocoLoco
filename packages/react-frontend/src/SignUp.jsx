import React, { useState } from "react";

function SignUp(props) {
  const [person, setPerson] = useState({name: ""});

  // checks when you input text into text boxes
  // then setPerson updates person
  function handleChange(event){
    const { name, value } = event.target;
    if (name == "job")
        setPerson({ name: person["name"], job: value});
    else setPerson({ name: value, job: person["job"]});
  }

  // takes the current person and sends it over to updateList to add to top list
  function submitForm(){
    props.handleSubmit(person); // gives person to updateList
    setPerson({ name: "", job: ""}); // reset after submission
  }

    return (
    <div className="page-center">
      <form className="SignUp-rect" onSubmit={submitForm}>
        <label htmlFor="Sign Up" className="label">Sign Up</label>
        <input
          id="name"
          name="name"
          className="input"
          type="text"
          placeholder="Username"
          value={person.name}
          onChange={handleChange}
        />
        <input
          id="name"
          name="name"
          className="input"
          type="text"
          placeholder="Job"
          value={person.job}
          onChange={handleChange}
        />
        <button className="btn" type="submit" disabled={!person.name.trim()}>
          Sign up
        </button>
      </form>
    </div>
  );
}

export default SignUp;