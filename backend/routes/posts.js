const express = require('express');

const Post = require('../models/post');

const router = express.Router();

// /api/posts is already present in path due to app.js

router.post('', async (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  // console.log(post);
  const createdPost = await post.save();
  res.status(201).json({
    message: "post added successfully",
    postId: createdPost._id
  });
});

router.get('', async (req, res, next) => {
  const documents = await Post.find();
   res.status(200).json({
      message: 'posts sent successfully',
      posts: documents
    });
});

// get single post for Update
router.get('/:id', async (req, res, next) => {
  const post = await Post.findById(req.params.id);
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

router.delete('/:id', async (req, res, next) => {
  const result = await  Post.deleteOne({_id: req.params.id});
  res.status(200).json({
    message: 'Post deleted!'
  });
});

router.put('/:id', async (req, res, next) => {
  const post = {
    title: req.body.title,
    content: req.body.content
  };
  const result = await Post.updateOne({_id: req.params.id}, post);
  res.status(200).json({ message: 'Update successful!' });
})

module.exports = router;
