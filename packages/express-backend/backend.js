import express from 'express';
import cors from 'cors';
import userServices from './services/user-services.js';
import postServices from './services/post-services.js';
import commentServices from './services/comment-services.js';


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
// Example: GET http://localhost:8000/posts?author=willeam&date=2025-10-27&terms=dog&terms=fox
// Returns all posts by "willeam" from Oct 27, 2025 that include the words "dog" and "fox" in the post body (or all posts if no filters)
app.get('/posts', (req, res) => {
  const author = req.query.author;
  const date = req.query.date;
  const search_terms = req.query.terms;
  postServices
    .getPosts(author, date, search_terms)
    .then((posts) => res.status(200).send({ posts_list: posts }))
    .catch((err) => {
      console.error(err);
      res.status(500).send('Failed to fetch posts');
    });
});

// ------------------COMMENTS------------------


// GET /posts/:postId/comments
// Example: GET http://localhost:8000/posts/671eb54c8ddad1d8cf7a0012/comments
//Returns all comments for a given postId
app.get('/posts/:postId/comments', (req, res) => {
  const postId = req.params.postId;

  commentServices
    .getCommentsByPostId(postId)
    .then((comments) => {
      return res.status(200).send({ comments_list: comments });
    })
    .catch((err) => {
      console.error(err);
      // likely invalid ObjectId
      res.status(400).send('Failed to fetch comments for this post');
    });
})

/*
POST /posts/:postId/comments
Example:
  POST http://localhost:8000/posts/671eb54c8ddad1d8cf7a0012/comments
  body: {
    "authorId": "671eb54c8ddad1d8cf7a0abc",
    "authorHandle": "willeam",
    "content": "Nice post!"
  }

Creates a new comment on the given post and attaches it to the Post's comments array.
Returns the newly created comment document.
*/
app.post('/posts/:postId/comments', (req, res) => {
  const postId = req.params.postId;
  const { authorId, authorHandle, content } = req.body;

  if (!authorId || !authorHandle || !content) {
    return res.status(400).send('authorId, authorHandle, and content are required to create a comment');
  }

  commentServices
    .createComment({ postId, authorId, authorHandle, content })
    .then((comment) =>
      // also push the comment _id into the Post.comments array
      commentServices.addCommentToPost(postId, comment._id).then(() => comment)
    )
    .then((createdComment) => {
      return res.status(201).send(createdComment);
    })
    .catch((err) => {
      console.error(err);
      res.status(400).send('Failed to create comment');
    });
});

// GET /comments/:id
// Example: GET http://localhost:8000/comments/671eb54c8ddad1d8cf7a0def
// Returns a single comment by its id
app.get('/comments/:id', (req, res) => {
  const id = req.params.id;
  commentServices
    .getCommentById(id)
    .then((comment) => {
      if (!comment) {
        return res.status(404).send('Comment not found');
      }
      return res.status(200).send(comment); // if comment exists, return the comment with success status
    })
    .catch((err) => {
      console.error(err);
      res.status(400).send('invalid id');
    });
});

// DELETE /comments/:id
// Example: DELETE http://localhost:8000/comments/671eb54c8ddad1d8cf7a0def
// Deletes comment by specific id
app.delete('/comments/:id', (req, res) => {
  const commentId = req.params.id;

  commentServices
    .deleteCommentById(commentId)
    .then((deletedComment) => {
      if (!deletedComment) {
        return res.status(404).send('Comment not found');
      }

      // also removes the comment id from the Post.comments array
      return postServices
        .pullCommentFromPost(deletedComment.postId, commentId)
        .then(() => res.status(204).send());
    })
    .catch((err) => {
      console.error(err);
      res.status(400).send('Failed to delete comment');
    });
});

// ------------------USERS------------------

// GET /users/
// Example: GET http://localhost:8000/users/
// Returns all users
app.get('/users/', (req, res) => {
  userServices
    .getAllUsers()
    .then((users) => {
      if (!users) {
        return res.send('No users in DB yet!');
      }
      res.status(200).send({ users_list: users });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Failed to fetch users');
    });
});

// GET /users/:id
// Example: GET http://localhost:8000/users/671eb54c8ddad1d8cf7a0012
// Returns a single user's profile by their id
app.get('/users/:id', (req, res) => {
  const id = req.params.id;
  userServices
    .findUserById(id)
    .then((user) => {
      if (!user) {
        return res.status(404).send('User not found');
      }
      return res.status(200).send(user); // if user exists, return the user
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
  console.log('BODY RECEIVED:', req.body);
  const { userName, displayName, password = '' } = req.body;
  if (!userName || !displayName) {
    return res
      .status(400)
      .send('username, display name, and password are required!');
  }
  userServices
    .addUser({ userName, displayName, password })
    .then((created) => res.status(201).send(created))
    .catch((err) => {
      console.error(err);
      res.status(400).send(err.message ?? 'Failed to create user');
    });
});

// DELETE /users/:id
// Example: DELETE http://localhost:8000/users/671eb54c8ddad1d8cf7a0012
// Deletes user by specific id
app.delete('/users/:id', (req, res) => {
  const id = req.params.id;
  userServices
    .deleteUserById(id)
    .then((deleted) => {
      if (!deleted) {
        return res.status(404).send('User not found');
      }
      res.status(204).send('User Created!');
    })
    .catch((err) => {
      console.error(err);
      res.status(400).send('Failed to delete user');
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
