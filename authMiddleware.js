// authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = () => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log(authHeader)
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ error: 'Token error' });
    }

    const token = parts[1];

    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ error: 'Token expired' });
      } else if (error instanceof jwt.JsonWebTokenError) {
        return res.status(403).json({ error: 'Invalid token' });
      } else {
        next();
      }
    }
  };
};

module.exports = authMiddleware;