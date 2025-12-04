import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import userServices from './user-services.js';

const creds = [];

// registerUser: For creating a new user
export function registerUser(req, res) {
  const { userName, password } = req.body; // from form

  let error;

  if (!userName || !password) {
    error = new Error('Bad request: Invalid input data.');
    error.statusCode = 400;
    throw error;
  } else if (creds.find((c) => c.userName === userName)) {
    error = new Error('Username already taken.');
    error.statusCode = 409;
    throw error;
  } else {
    const promise = bcrypt
      .genSalt(10)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        creds.push({ userName, hashedPassword });
        return generateAccessToken(userName).then((token) => {
          console.log('Token:', token);
          //Used to save the user and send a response
          return userServices
            .addUser({
              userName,
              displayName: userName,
              password: hashedPassword,
            })
            .then((newUser) => {
              res.status(201).send({ token: token, userId: newUser._id });
            });
        });
      });

    promise.catch((error) => {
      console.error('error registering user', error);
      if (!res.headersSent) {
        res.status(500).send('Code error');
      }
    });

    return promise;
  }
}

// Helper function to generate an access token (a client uses this to show it's signed in):
function generateAccessToken(userName) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { userName: userName },
      process.env.TOKEN_SECRET,
      { expiresIn: '1d' },
      (error, token) => {
        if (error) {
          reject(error);
        } else {
          resolve(token);
        }
      }
    );
  });
}

// authenticateUser: For authenticating the user token included in a request
// Example usage in backend.js (make sure auth.js is imported):
// updated from: app.post('/posts', (req, res) => {...}
// to: app.post('/posts', authenticateUser, (req, res) => {...}
export function authenticateUser(req, res, next) {
  const authHeader = req.headers['authorization'];
  //Getting the 2nd part of the auth header (the token)
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log('No token received');
    res.status(401).end();
  } else {
    jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
      if (decoded) {
        next();
      } else {
        console.log('JWT error:', error);
        res.status(401).end();
      }
    });
  }
}

// loginUser: To validate provided credentials and generate an access token
// Example usage in backend.js (make sure auth.js is imported):
// updated from: *empty line*
// to: app.post("/login", loginUser);
export function loginUser(req, res) {
  const { userName, password } = req.body; // from form
  userServices
    .findUserByUserName(userName)
    .then((retrievedUser) => {
      if (!retrievedUser) {
        // invalid username
        return res.status(401).send('Unauthorized');
      } // creds.find((c) => c.userName === userName);
      return bcrypt
        .compare(password, retrievedUser.password)
        .then((matched) => {
          if (matched) {
            generateAccessToken(userName).then((token) => {
              res.status(200).send({ token: token, userId: retrievedUser._id });
            });
          } else {
            // invalid password
            return res.status(401).send('Unauthorized');
          }
        });
    })
    .catch(() => {
      res.status(401).send('Unauthorized');
    });
}
