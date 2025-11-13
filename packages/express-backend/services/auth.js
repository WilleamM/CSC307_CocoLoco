import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const creds = [];

// registerUser: For creating a new user
export function registerUser(req, res) {
  const { username, pwd } = req.body; // from form

  if (!username || !pwd) {
    res.status(400).send('Bad request: Invalid input data.');
  } else if (creds.find((c) => c.username === username)) {
    res.status(409).send('Username already taken');
  } else {
    bcrypt
      .genSalt(10)
      .then((salt) => bcrypt.hash(pwd, salt))
      .then((hashedPassword) => {
        generateAccessToken(username).then((token) => {
          console.log('Token:', token);
          res.status(201).send({ token: token });
          creds.push({ username, hashedPassword });
        });
      });
  }
}

// Helper function to generate an access token (a client uses this to show it's signed in):
function generateAccessToken(username) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { username: username },
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
// to: app.post("/login", registerUser);
export function loginUser(req, res) {
  const { username, pwd } = req.body; // from form
  const retrievedUser = creds.find((c) => c.username === username);

  if (!retrievedUser) {
    // invalid username
    res.status(401).send('Unauthorized');
  } else {
    bcrypt
      .compare(pwd, retrievedUser.hashedPassword)
      .then((matched) => {
        if (matched) {
          generateAccessToken(username).then((token) => {
            res.status(200).send({ token: token });
          });
        } else {
          // invalid password
          res.status(401).send('Unauthorized');
        }
      })
      .catch(() => {
        res.status(401).send('Unauthorized');
      });
  }
}
