import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import userServices from './user-services.js';

// registerUser: For creating a new user
export async function registerUser(req, res) {
  const { userName, password, displayName } = req.body; // from form

  if (!userName || !password) {
    return res.status(400).send('username and password are required');
  }

  try {
    const existing = await userServices.findUserByUserName(userName);
    if (existing) {
      return res.status(409).send('Username already taken');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = await generateAccessToken(userName);

    const newUser = await userServices.addUser({
      userName,
      displayName: displayName || userName,
      password: hashedPassword,
    });

    return res
      .status(201)
      .send({ token, userId: newUser._id, userName: newUser.userName });
  } catch (error) {
    console.error('error registering user', error);
    if (!res.headersSent) {
      res.status(500).send('Failed to create user');
    }
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
        req.user = decoded;
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
              res.status(200).send({
                token: token,
                userId: retrievedUser._id,
                userName: retrievedUser.userName,
              });
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
