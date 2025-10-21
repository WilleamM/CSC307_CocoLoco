import React, { useState } from "react";

function Form(props) {
  const [person, setPerson] = useState({
    name: "",
    job: ""
  });

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
  <form>
    <label htmlFor="name">Name</label>
    <input
      type="text"
      name="name"
      id="name"
      value={person.name}
      onChange={handleChange}
    />
    <label htmlFor="job">Job</label>
    <input
      type="text"
      name="job"
      id="job"
      value={person.job}
      onChange={handleChange}
    />
    <input type="button" value="Submit" onClick={submitForm} />
  </form>
  
  
);

}


export default Form;

