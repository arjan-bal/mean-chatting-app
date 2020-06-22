const express = require('express');
const UserController = require('../controllers/user');

const router = express.Router();

router.post('/signup', UserController.CreateUser);

router.post('/login', UserController.LoginUser);

module.exports = router;
