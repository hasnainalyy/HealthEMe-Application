const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authentication failed: Missing token' });
  }

  jwt.verify(token, 'secret', (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: 'Authentication failed: Invalid token' });
    }

    req.userId = decodedToken.userId;
    next();
  });
};

module.exports = authenticate;
