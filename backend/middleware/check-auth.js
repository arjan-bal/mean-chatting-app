const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    // jwt verify also throws error on failure
    // hence in try catch block
    jwt.verify(token, 'secret_this_should_be_longer');
    next();
  } catch (error){
    return res.status(401).json({ message: 'Auth failed!' });
  }
}
