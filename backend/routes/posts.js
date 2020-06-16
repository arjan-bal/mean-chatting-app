const express = require('express');

const Post = require('../models/post');

const router = express.Router();

// /api/posts is already present in path due to app.js

router.post('', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  // console.log(post);
  post.save().then((createdPost) => {
    res.status(201).json({
      message: "post added successfully",
      postId: createdPost._id
    });
  });
});

router.get('', (req, res, next) => {
  Post.find()
    .then(documents => {
      res.status(200).json({
        message: 'posts sent successfully',
        posts: documents
      });
  });
});

// get single post for Update
router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post){
      res.status(200).json({
        message: 'post sent successfully',
        post: post
      });
    } else {
      res.status(404).json({
        message: 'post not found!'
      });
    }
  });
});

router.delete('/:id', (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then(result => {
    res.status(200).json({
      message: 'Post deleted!'
    });
  });
});

router.put('/:id', (req, res, next) => {
  const post = {
    title: req.body.title,
    content: req.body.content
  };
  Post.updateOne({_id: req.params.id}, post).then(result => {
    res.status(200).json({ message: 'Update successful!' });
  });
})

module.exports = router;
