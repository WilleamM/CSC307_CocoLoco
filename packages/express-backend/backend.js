import express from 'express';
import cors from 'cors';
import userServices from './services/user-services.js';
import postServices from './services/post-services.js';

// npx nodemon backend.js
const app = express();
const port = Number(process.env.PORT) || 8000;
app.use(cors());
app.use(express.json());

// health check
app.get('/', (req, res) => {
  return res.send('Hello World!');
});

// NOTE: For endpoint creation show:
// - what call looks like
// - an example call
// - what it returns

// ------------------POSTS------------------

// GET /posts?author=...&date=...
// Example: GET http://localhost:8000/posts?author=willeam&date=2025-10-27
// Returns all posts by "willeam" from Oct 27, 2025 (or all posts if no filters)
app.get('/posts', (req, res) => {
  const author = req.query.author;
  const date = req.query.date;

  userServices
    .getPosts(author, date)
    .then((posts) => res.send({ posts_list: posts }))
    .catch((err) => {
      console.error(err);
      res.status(500).send('Failed to fetch posts');
    });
});

// ------------------USERS------------------

// GET /users/:id
// Example: GET http://localhost:8000/users/671eb54c8ddad1d8cf7a0012
// Returns a single user's profile by their id
app.get('/users/:id', (req, res) => {
  const id = req.params.id;
  postServices
    .findUserById(id)
    .then((user) => {
      if (!user) {
        return res.status(404).send('User not found');
      }
      return res.send(user); // if user exists, return the user
    })
    .catch((err) => {
      console.error(err);
      res.status(400).send('invalid id');
    });
});

// POST /users
/*
Example: POST http://localhost:8000/users
  body: {
    "userName": "willeam",
    "displayName": "Willeam Mendez",
    "bio": "I go to school at Cal Poly SLO",
    "avatarUrl": "https://example.com/avatar.jpg"
    }
*/
// Creates a new user in the database
app.post('/users', (req, res) => {
  const { userName, displayName, bio = '', avatarUrl = ''} = req.body;
  if (!userName || !displayName){
    return res.status(400).send("username and display name required!");
  }
  userServices
    .addUser({ userName, displayName, bio, avatarUrl})
    .then((created) => res.status(201),send(created))
    .catch((err) => {
      console.error(err);
      res.status(400).send(err.message ?? 'Failed to create user');
    });
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
