const express = require('express');
const { createPost, getPosts } = require('../controllers/postController');
const protect = require('../middleware/authMiddleware'); // Middleware to protect routes
const multer = require('multer');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to store uploaded files temporarily
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
    },
});
const upload = multer({ storage });

router
    .route('/')
    .post(protect, upload.single('photo'), createPost) // Protect route and handle file upload
    .get(getPosts); // Public route to get all posts

module.exports = router;
