const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.CreateUser = async (req, res, next) => {
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
      message: 'Invalid authentication credentials!'
    });
  }
}

exports.LoginUser = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid authentication credentials!' });
  }
  try {
    const result = await bcrypt.compare(req.body.password, user.password);
    if (!result) {
      return res.status(401).json({ message: 'Invalid authentication credentials!' });
    }
  } catch {
    return res.status(401).json({ message: 'Invalid authentication credentials!' });
  }
  const token = jwt.sign(
    { email: user.email, userId: user._id },
    'secret_this_should_be_longer',
    { expiresIn: '1h' }
  );
  res.status(200).json({
    token: token,
    userId: user._id,
    expiresIn: 3600
  });
}
