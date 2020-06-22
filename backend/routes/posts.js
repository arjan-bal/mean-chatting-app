const express = require('express');
const multer = require('multer');

const Post = require('../models/post');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpeg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('invalid mimetype');
    if(isValid){
      error = null;
    }
    // destination path relative to server.js
    cb(error, 'backend/images')
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

// /api/posts is already present in path due to app.js

// can add any number of middleware to paths,
// evaluated from left to right
// 'image' tells multer to look for image attribute of req.body
router.post('',
  checkAuth,
  multer({storage: storage}).single('image'),
  async (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId
  });
  let createdPost;
  try {
    createdPost = await post.save();
  } catch {
    return res.status(500).json({
      message: 'Creating a post failed!'
    });
  }
  res.status(201).json({
    message: "Post added successfully",
    post: {
      ...createdPost.toObject(),
      id: createdPost._id
    }
  });
});

router.get('', async (req, res, next) => {
  const postQuery = Post.find();
  // console.log(req.query);
  // + is for converting string to int
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1)) // 1 based indexing for page
      .limit(pageSize);
  }
  let results;
  try{
    results = await Promise.all([postQuery, Post.countDocuments()]);
  } catch {
    return res.status(500).json({
      message: 'Fetching posts failed!'
    });
  }
  res.status(200).json({
    message: 'Posts sent successfully',
    posts: results[0],
    maxPosts: results[1]
  });
});

// get single post for Update
router.get('/:id', async (req, res, next) => {
  let post;
  try{
    post = await Post.findById(req.params.id);
  } catch {
    return res.status(500).json({
      message: "Fetching post failed!"
    });
  }
  if (post){
    res.status(200).json({
      message: 'Post sent successfully',
      post: post
    });
  } else {
    res.status(404).json({
      message: 'Post not found!'
    });
  }
});

router.delete('/:id',
  checkAuth,
  async (req, res, next) => {
  let result;
  try{
    result = await  Post.deleteOne({
      _id: req.params.id,
      creator: req.userData.userId
    });
  } catch {
    return res.status(500).json({
      message: "Post deletion failed!"
    });
  }
  if (result.deletedCount > 0) {
    res.status(200).json({
      message: 'Post deleted!'
    });
  } else {
    res.status(401).json({ message: 'Not Authorized!' });
  }
});

router.put('/:id',
  checkAuth,
  multer({storage: storage}).single('image'),
  async (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + '://' + req.get("host");
      imagePath = url + '/images/' + req.file.filename;
    }
    const post = {
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creator: req.userData.userId
    };
    let result;
    try {
      result = await Post.updateOne({
        _id: req.params.id,
        creator: req.userData.userId
      }, post);
    } catch {
      return res.status(500).json({
        message: "Couldn't update post!"
      });
    }
    if (result.nModified > 0) {
      res.status(200).json({ message: 'Update successful!' , imagePath: imagePath});
    } else {
      res.status(401).json({ message: 'Not Authorized!' });
    }
})

module.exports = router;
