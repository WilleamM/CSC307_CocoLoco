import express from "express";
import cors from "cors";
import userServices from "./user-services.js";

// npx nodemon backend.js
const app = express();
const port = 8000;
app.use(cors());
app.use(express.json());

// api endpoint
// .get has 2 parameters:
    // 1. URL pattern that the end point will use
    // 2. Call back function that will be used when we get a call for this endpoint
app.get("/", (req, res) => {
    // req is what we were given
    // res is what we will send back
    return res.send("Hello World!");
});

// GET /users?name=...&job=...
// (Covers: all users, by name only, by job only, by name+job)
app.get("/users", (req, res) => {
    const name = req.query.name;
    const job = req.query.job;
    userServices.getUsers(name, job)
    .then((users) => res.send({ users_list: users}))
    .catch((err) => {
      console.error(err);
      res.status(500).send("Failed to fetch the users")
    });
});
// GET /users/:id
app.get("/users/:id", (req, res) => {
    const id = req.params.id
    userServices.findUserById(id)
    .then((user) => {
      if (!user) return res.status(404).send("User not found")
        return res.send(user); // if user exists, return the user
    })
    .catch((err) => {
      console.error(err);
      res.status(400).send("invalid id");
    });
});

// POST /users/
app.post("/users", (req, res) => {
    const { name, job } = req.body
    if (!name || !job) return res.status(400).send("name and job are required");

    userServices.addUser({ name, job })
    .then((createdUser) => res.status(201).send(createdUser))
    .catch((err) => {
      console.error(err);
      res.status(400).send(err.message ?? "Failed to create user");
    });

});

// DELETE /users/:id
app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  userServices.deleteUserById(id)
  .then((deletedUser) => {
    if(!deletedUser){
      return res.status(404).send("User not found");
    }
    return res.status(204).send("User deleted!");
  })
  .catch((err) => {
    console.error(err);
    res.status(400).send("Failed to delete user");
  });
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});