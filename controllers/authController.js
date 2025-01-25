const User = require('../models/user');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail'); // Utility for sending emails

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register User
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({ name, email, password });
        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user.id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user.id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// POST /auth/forgot-password
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes
        await user.save();

        // Send the reset link via email
        const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
        const message = `You requested a password reset. Please click the link below to reset your password:\n\n${resetUrl}`;

        await sendEmail({ to: user.email, subject: 'Password Reset', text: message });

        res.status(200).json({ message: 'Password reset email sent.' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending password reset email.' });
    }
};

// POST /auth/reset-password/:token
const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }, // Check if token is not expired
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token.' });
        }

        user.password = password; // Hash the password before saving
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error resetting password.' });
    }
};


module.exports = { registerUser, loginUser, forgotPassword,resetPassword };
