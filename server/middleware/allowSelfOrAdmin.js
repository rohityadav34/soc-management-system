const allowSelfOrAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication failed: User details missing.'
      });
    }

    // Role check - allow admins or user checking their own details
    if (req.user.role === 'admin' || req.user.id === req.params.id) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Access denied: You are not authorized to access this resource.'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = allowSelfOrAdmin;
