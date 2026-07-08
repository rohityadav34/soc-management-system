const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  try {
    let token = req.cookies.token;

    // Fallback to Authorization Header (for cross-origin requests in production)
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication failed: No token provided.',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_STRING);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Authentication failed: Invalid token.',
      });
    }

    // Attach user info to request object
    req.user = decoded;
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error.message);

    let statusCode = 401;
    let message = 'Authentication failed.';

    if (error.name === 'TokenExpiredError') {
      message = 'Session expired. Please log in again.';
    } else if (error.name === 'JsonWebTokenError') {
      message = 'Invalid token. Please log in again.';
    }

    return res.status(statusCode).json({
      success: false,
      message,
      error: error.message,
    });
  }
};

module.exports = verifyToken;