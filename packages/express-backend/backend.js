import express from 'express';
import cors from 'cors';
import userServices from './user-services.js';


// npx nodemon backend.js
const app = express();
const port = Number(process.env.PORT) || 8000;
app.use(cors());
app.use(express.json());

// health check
app.get('/', (req, res) => { return res.send('Hello World!')});


// NOTE: Have removed terms for the time being, can add later for future sprint
// ------------------POSTS------------------

// GET /posts?author=...&date=...
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
// At least for now: Shows the profile of a single user
app.get('/users/:id', (req, res) => {
  const id = req.params.id;
  userServices
    .findUserById(id)
    .then((user) => {
      if (!user){
        return res.status(404).send('User not found');
      } 
      return res.send(user); // if user exists, return the user
    })
    .catch((err) => {
      console.error(err);
      res.status(400).send('invalid id');
    });
});





app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
