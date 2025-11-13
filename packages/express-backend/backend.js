import express from 'express';
import cors from 'cors';
import userServices from './services/user-services.js';
import postServices from './services/post-services.js';
import groupServices from './services/group-services.js';
import friendServices from './services/friends-services.js';
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
    .then((posts) => res.send({ posts_list: posts }))
    .catch((err) => {
      console.error(err);
      res.status(500).send('Failed to fetch posts');
    });
});

// POST /posts
// Creates a post
app.post('/posts', (req, res) => {
  const {
    authorId,
    author,
    title = '',
    body,
    visibility = 'friends',
  } = req.body;

  if (!authorId || !author || !body) {
    return res.status(400).send('authorId, author, and body are required');
  }

  postServices
    .createPost({ authorId, author, title, body, visibility })
    .then((post) => res.status(201).send(post))
    .catch((err) => {
      console.error(err);
      res.status(400).send(err.message);
    });
});

// DELETE /posts/:id  -> delete a post and its comments
app.delete('/posts/:id', (req, res) => {
  const postId = req.params.id;

  // delete post first, then cascade-delete its comments
  postServices
    .deletePostById(postId)
    .then((deletedPost) => {
      if (!deletedPost) return res.status(404).send('Post not found');
      // remove all comments that belonged to this post
      return commentServices.deleteManyByPostId(postId);
    })
    .then(() => res.status(204).send())
    .catch((err) => {
      console.error(err);
      res.status(400).send('Failed to delete post');
    });
});

// ------------------COMMENTS------------------

// GET /posts/:id/comments
// Get all comments for a post
app.get('/posts/:id/comments', (req, res) => {
  const postId = req.params.id;

  commentServices
    .getCommentsByPostId(postId)
    .then((comments) => {
      if (!comments || comments.length === 0) {
        return res.status(404).send('No comments found for this post');
      }
      res.send({ comments_list: comments });
    })
    .catch((err) => {
      console.error(err);
      res.status(400).send('Failed to fetch comments');
    });
});

// POST /posts/:id/comments
// Creates a comment and attaches it to post
app.post('/posts/:id/comments', (req, res) => {
  const postId = req.params.id;
  const { authorId, authorHandle, content } = req.body;

  if (!authorId || !authorHandle || !content) {
    return res.status(400).send('authorId, authorHandle, and content required');
  }

  commentServices
    .createComment({ postId, authorId, authorHandle, content })
    .then((comment) => {
      return commentServices
        .addCommentToPost(postId, comment._id)
        .then(() => comment);
    })
    .then((comment) => {
      res.status(201).send(comment);
    })
    .catch((err) => {
      console.error(err);
      res.status(400).send(err.message);
    });
});

// DELETE /comments/:id
// Deletes a single comment and unlink it from its post
app.delete('/comments/:id', (req, res) => {
  const commentId = req.params.id;

  // 1) find comment to learn its postId
  commentServices
    .getCommentById(commentId)
    .then((comment) => {
      if (!comment) return res.status(404).send('Comment not found');

      // 2) delete comment and pull ref from the post
      return Promise.all([
        commentServices.deleteCommentById(commentId),
        postServices.pullCommentFromPost(comment.postId, commentId),
      ]);
    })
    .then(() => res.status(204).send())
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
      res.send({ users_list: users });
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
  console.log('BODY RECEIVED:', req.body);
  const { userName, displayName, bio = '', avatarUrl = '' } = req.body;
  if (!userName || !displayName) {
    return res.status(400).send('username and display name required!');
  }
  userServices
    .addUser({ userName, displayName, bio, avatarUrl })
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

// ------------------GROUPS------------------
// TODO: Created the group-services functions, just need to add api endpoints to use them

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
