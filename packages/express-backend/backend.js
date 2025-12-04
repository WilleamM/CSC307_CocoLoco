import express from 'express';
import cors from 'cors';
import userServices from './services/user-services.js';
import postServices from './services/post-services.js';
import multer from 'multer';
import commentServices from './services/comment-services.js';

// Configure Multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
  const authorId = req.query.authorId;
  postServices
    .getPosts(author, date, search_terms, authorId)
    .then((posts) => res.send({ posts_list: posts }))
    .catch((err) => {
      console.error(err);
      res.status(500).send('Failed to fetch posts');
    });
});

// POST /posts
// Creates a new post with optional image
app.post('/posts', upload.single('image'), (req, res) => {
  const { authorId, author, title, body, visibility } = req.body;

  if (!authorId || !author || !body) {
    return res.status(400).send('Missing required fields');
  }

  const newPost = {
    authorId,
    author,
    title,
    body,
    visibility: visibility || 'friends',
  };

  if (req.file) {
    newPost.image = req.file.buffer;
    newPost.imageContentType = req.file.mimetype;
  }

  postServices
    .addPost(newPost)
    .then((savedPost) => res.status(201).send(savedPost))
    .catch((error) => {
      console.error(error);
      res.status(500).send('Failed to create post');
    });
});

// GET /posts/:id
// Example: GET http://localhost:8000/posts/671eb54c8ddad1d8cf7a0012
// Returns a single post by id
app.get('/posts/:id', (req, res) => {
  const id = req.params.id;
  postServices
    .findPostById(id)
    .then((post) => {
      if (!post) {
        return res.status(404).send('Post not found');
      }
      return res.send(post);
    })
    .catch((err) => {
      console.error(err);
      res.status(400).send('Invalid post id');
    });
});

// GET /posts/:id/image
// Retrieves a post's image
app.get('/posts/:id/image', (req, res) => {
  const id = req.params.id;
  postServices
    .findPostByIdForUpdate(id)
    .then((post) => {
      if (!post) {
        return res.status(404).send('Post not found');
      }

      if (!post.image || !post.imageContentType) {
        return res.redirect(
          'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
        );
      }

      res.set('Content-Type', post.imageContentType);
      res.send(post.image);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Failed to fetch image');
    });
});

// GET /posts/:postId/comments
// Example: GET http://localhost:8000/posts/671eb54c8ddad1d8cf7a0012/comments
// Returns all comments for a given post, sorted oldest → newest
app.get('/posts/:postId/comments', (req, res) => {
  const postId = req.params.postId;

  commentServices
    .getCommentsByPostId(postId)
    .then((comments) => {
      res.send({ comments_list: comments });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Failed to fetch comments');
    });
});

// PUT /posts/:id/image
// Adds or updates an image for an existing post
app.put('/posts/:id/image', upload.single('image'), (req, res) => {
  const id = req.params.id;
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  // Validate file type
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ];
  if (!allowedMimeTypes.includes(req.file.mimetype)) {
    return res.status(400).send('Invalid file type. Only images are allowed.');
  }

  // Validate file size (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (req.file.size > maxSize) {
    return res.status(400).send('File too large. Maximum size is 5MB.');
  }

  postServices
    .findPostByIdForUpdate(id)
    .then((post) => {
      if (!post) {
        return res.status(404).send('Post not found');
      }

      post.image = req.file.buffer;
      post.imageContentType = req.file.mimetype;

      return post.save();
    })
    .then((post) => {
      res.send({
        message: 'Post image uploaded successfully',
        postId: post._id,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Failed to upload post image');
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

// POST /users/:id/avatar
// Uploads a profile picture for a user
app.post('/users/:id/avatar', upload.single('avatar'), (req, res) => {
  const id = req.params.id;
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  // Validate file type
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ];
  if (!allowedMimeTypes.includes(req.file.mimetype)) {
    return res.status(400).send('Invalid file type. Only images are allowed.');
  }

  // Validate file size (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (req.file.size > maxSize) {
    return res.status(400).send('File too large. Maximum size is 5MB.');
  }

  userServices
    .findUserByIdForUpdate(id)
    .then((user) => {
      if (!user) {
        return res.status(404).send('User not found');
      }

      user.avatar = req.file.buffer;
      user.avatarContentType = req.file.mimetype;
      // Update avatarUrl to point to the new endpoint
      user.avatarUrl = `/users/${id}/avatar`;

      return user.save();
    })
    .then((user) => {
      res.send({
        message: 'Avatar uploaded successfully',
        avatarUrl: user.avatarUrl,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Failed to upload avatar');
    });
});

// GET /users/:id/avatar
// Retrieves a user's profile picture
app.get('/users/:id/avatar', (req, res) => {
  const id = req.params.id;
  // Use findUserByIdForUpdate to get actual Buffer (not lean)
  userServices
    .findUserByIdForUpdate(id)
    .then((user) => {
      if (!user) {
        return res.status(404).send('User not found');
      }

      if (!user.avatar || !user.avatarContentType) {
        // Redirect to default avatar if no avatar is set
        return res.redirect(
          'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
        );
      }

      res.set('Content-Type', user.avatarContentType);
      res.send(user.avatar);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Failed to fetch avatar');
    });
});

// GET /suggested-users
// Returns 3 random users based off if the user doesn't have them added
app.get('/suggested-users', (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res.status(400).send('Id is required');
  }
  userServices
    .getSuggestedUsers(id)
    .then((suggestedUsers) => {
      res.status(200).send(suggestedUsers);
    })
    .catch((error) => {
      console.error('Error fetching suggested users', error);
      res.status(500);
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

// POST /posts/:postId/comments
/*
Example:
POST http://localhost:8000/posts/671eb54c8ddad1d8cf7a0012/comments
body: {
  "authorId": "671eb54c8ddad1d8cf7a0001",
  "authorHandle": "willeam",
  "content": "Nice post!"
}
Returns the created comment
*/
app.post('/posts/:postId/comments', (req, res) => {
  const postId = req.params.postId;
  const { authorId, authorHandle, content } = req.body;

  if (!authorId || !authorHandle || !content) {
    return res
      .status(400)
      .send('authorId, authorHandle, and content are required');
  }

  let createdComment;

  commentServices
    .createComment({ postId, authorId, authorHandle, content })
    .then((comment) => {
      createdComment = comment;
      return commentServices.addCommentToPost(postId, comment._id);
    })
    .then(() => {
      res.status(201).send(createdComment);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Failed to create comment');
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
