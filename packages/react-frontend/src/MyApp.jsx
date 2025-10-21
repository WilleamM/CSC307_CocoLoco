import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form"

// <Table characterData={characters}/> where characters is being passed to table as a prop
function MyApp() {
    const [characters, setCharacters] = useState([]);

    useEffect(() => {
        fetchUsers() 
            .then((res) => res.json())
            .then((json) => setCharacters(json["users_list"]))
            .catch((error) => { console.log(error); });
    }, [] );

    function fetchUsers() { // fetches all the data using the GET 
        const promise = fetch("http://localhost:8000/users");
        return promise;
    }

    // Like with the GET request, we don't wait for our POST to come back, but return a promise which will be fulfilled when it does
    function postUser(person) {
        const promise = fetch("http://localhost:8000/users", {
        method: "POST", // default is GET
        headers: {
            "Content-Type": "application/json", // tells server that body contains JSON
        },
        body: JSON.stringify(person), // puts the persons data into the request & stringify to be able to send it
        });

        return promise;
    }    

    function removeOneCharacter(_id) {
        const promise = fetch(`http://localhost:8000/users/${_id}`, { 
        method: "DELETE",
        headers: {
            "Content-Type": "application/json", // tells server that body contains JSON
        },}).then((res) => {
                if (res.status === 204) { // 204 == success
                    setCharacters((prev) => prev.filter((user) => user._id !== _id));
                }else if (res.status === 404) {
                    console.log("resource not found, no object was deleted");
                }else{
                    throw new Error(`Unexpected status ${res.status}`);
                }
            })
            .catch((err) => console.log(err));
        return promise;
    }

    function updateList(person) {
        postUser(person)
            .then((res) => {
            if (res.status !== 201) throw new Error(`Unexpected status ${res.status}`);
            return res.json(); // created user with id
            })
            .then((created) => setCharacters([...characters, created]))
            .catch((error) => console.log(error));
    }


    return (
    <div className="container">
        <Table
        characterData={characters}
        removeCharacter={removeOneCharacter}
        />
        <Form handleSubmit={updateList} />
    </div>
    );
}
export default MyApp;