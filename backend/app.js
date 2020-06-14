const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// for parsing json data, body is stream of bits initially
app.use(bodyParser.json());
// not used here, but you can parse urlencoded data too
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
  // for CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-with, Content-Type, Accept"
  );
  // for allowed methods
  // OPTIONS is set implicitely by angular to check if
  // post request is valid
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post('/api/posts', (req, res, next) => {
  const post = req.body;
  console.log(post);
  res.status(201).json({
    message: "post added successfully"
  });
});

app.get('/api/posts', (req, res, next) => {
  const posts = [
    {
      id: '3dsfds2342s',
      title: 'post 1',
      content: 'this is some good content'
    },
    {
      id: '3dsfio21213',
      title: 'post 2',
      content: 'this is some good content two'
    }
  ];
  res.status(200).json({
    message: 'posts sent successfully',
    posts: posts
  });
});

module.exports = app;

// evyopyfE0YUuPz4o
