const { verifyToken } = require('../utils/jwt');
const Admin = require('../models/Admin');

/**
 * Authentication middleware to verify JWT token
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next function
 */
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = verifyToken(token);
    const admin = await Admin.findById(decoded.userId).select('-password');
    
    if (!admin) {
      return res.status(401).json({ message: 'Invalid token.' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ 
      message: 'Invalid token.',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Authentication failed'
    });
  }
};

module.exports = authMiddleware;
