const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();

mongoose.connect(
  "mongodb+srv://arjan:evyopyfE0YUuPz4o@mymessages-q6n2y.mongodb.net/node-angular?retryWrites=true&w=majority",
  // added due to deprication warning
  { useNewUrlParser: true, useUnifiedTopology: true }
)
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("connection failed!")
  });

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
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  // console.log(post);
  post.save();
  res.status(201).json({
    message: "post added successfully"
  });
});

app.get('/api/posts', (req, res, next) => {
  Post.find()
    .then(documents => {
      res.status(200).json({
        message: 'posts sent successfully',
        posts: documents
      });
  });
});

app.delete('/api/posts/:id', (req, res, next) => {
  console.log(req.params.id);
  Post.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
    res.status(200).json({
      message: 'Post deleted!'
    });
  });
});

module.exports = app;
