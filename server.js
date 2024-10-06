const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');
const { expressjwt: expressJWT } = require('express-jwt');

const bodyParser = require('body-parser');
const path = require('path');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
  next();
});
const PORT = 3000;

const secretKey = 'secretKey';
const jwtMw = expressJWT({
  secret: secretKey,
  algorithms: ['HS256'],
});

let users = [
  {
    id: 1,
    username: 'fabio',
    password: '123',
  },
  {
    id: 2,
    username: 'nolasco',
    password: '456',
  },
];

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  for (let user of users) {
    if (username == user.username && password == user.password) {
      const timeInSeconds = 180;
      let token = jwt.sign(
        { id: user.id, username: user.username },
        secretKey,
        { expiresIn: timeInSeconds }
      );
      res.json({
        success: true,
        err: null,
        token,
      });
    } else {
      res.status(401).json({
        success: false,
        token: null,
        err: 'Username or password is incorrect',
      });
    }
  }
});

app.get('/api/dashboard', jwtMw, (req, res) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];
//   console.log(token);
  res.json({
    success: true,
    myContent: 'Secret content that only logged in people can see',
  });
});

app.get('/api/settings', jwtMw, (req, res) => {
  res.json({
    success: true,
    myContent: 'Settings page',
  });   
});

app.get('/api/prices', jwtMw, (req, res) => {
    res.json({
      success: true,
      myContent: 'This is the price $3.99',
    });   
  });

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({
      success: false,
      officialError: err,
      err: 'Username or password is incorrect 2',
    });
  } else {
    next(err);
  }
});

app.listen(PORT, () => {
  console.log(`serving on port ${PORT}`);
});
