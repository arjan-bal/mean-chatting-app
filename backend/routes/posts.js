const express = require('express');

const checkAuth = require('../middleware/check-auth');
const PostsController = require('../controllers/posts');
const extractFile = require('../middleware/file');

const router = express.Router();



// /api/posts is already present in path due to app.js

// can add any number of middleware to paths,
// evaluated from left to right
// 'image' tells multer to look for image attribute of req.body
router.post('',
  checkAuth,
  extractFile,
  PostsController.createPost
);

router.put('/:id',
  checkAuth,
  extractFile,
  PostsController.updatePost
)

router.get('', PostsController.getPosts);

// get single post for Update
router.get('/:id', PostsController.getPost);

router.delete('/:id',
  checkAuth,
  PostsController.deletePost
);

module.exports = router;
