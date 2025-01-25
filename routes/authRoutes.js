const express = require('express');
const { registerUser, loginUser,forgotPassword,resetPassword } = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser); // Registers a new user
router.post('/login', loginUser); // Logs in an existing user and returns an authentication token
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
