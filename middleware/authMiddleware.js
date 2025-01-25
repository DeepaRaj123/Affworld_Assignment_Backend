const jwt = require('jsonwebtoken');
const User = require('../models/user');

/**
 * Middleware to protect routes and ensure only authenticated users can access them
 * 
 * This middleware:
 * - Verifies the presence and validity of a JWT token in the Authorization header
 * - Decodes the token to extract user information
 * - Attaches the authenticated user to the `req.user` object
 */

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = protect;
