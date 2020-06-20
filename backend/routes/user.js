const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

router.post('/login', async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(401).json({ message: 'Auth failed' });
  }
  try {
    const result = await bcrypt.compare(req.body.password, user.password);
    if (!result) {
      return res.status(401).json({ message: 'Auth failed' });
    }
  } catch {
    return res.status(401).json({ message: 'Auth failed' });
  }
  const token = jwt.sign(
    {email: user.email, id: user.__id},
    'secret_this_should_be_longer',
    { expiresIn: '1h' }
  );
  res.status(200).json({ token: token });
});

module.exports = router;
