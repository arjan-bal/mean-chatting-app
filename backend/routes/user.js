const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/user');

const router = express.Router();

router.post('/signup', async (req, res, next) => {
  hash = await bcrypt.hash(req.body.password, 10);
  const user = new User({
    email: req.body.email,
    password: hash
  });
  try {
    result = await user.save();
    res.status(201).json({
      message: 'User created!',
      result: result
    });
  } catch(err) {
    res.status(501).json({
      error: err
    });
  }
});

module.exports = router;
