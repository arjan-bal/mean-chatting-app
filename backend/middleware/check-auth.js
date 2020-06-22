const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    // jwt verify also throws error on failure
    // hence in try catch block
    const decodedToken = jwt.verify(token, 'secret_this_should_be_longer');
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    next();
  } catch (error){
    return res.status(401).json({ message: 'You are not authenticated!' });
  }
}
