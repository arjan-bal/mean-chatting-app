const express = require('express');
const multer = require('multer');

const checkAuth = require('../middleware/check-auth');
const PostsController = require('../controllers/posts');

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
  PostsController.createPost);

router.get('', PostsController.getPosts);

// get single post for Update
router.get('/:id', PostsController.getPost);

router.delete('/:id',
  checkAuth,
  PostsController.deletePost
);

router.put('/:id',
  checkAuth,
  multer({storage: storage}).single('image'),
  PostsController.updatePost
)

module.exports = router;
