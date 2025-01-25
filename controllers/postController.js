const Post = require('../models/post');
const cloudinary = require('cloudinary').v2;
const fs = require('fs'); // To clean up temporary files after upload
const dotenv = require('dotenv');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUDNAME, 
    api_key: process.env.CLOUDINARY_APIKEY, 
    api_secret: process.env.CLOUDINARY_APISECRET,
});

// Create a Post
const createPost = async (req, res) => {
    const { caption } = req.body;

    if (!req.file) {
        return res.status(400).json({ message: 'Photo file is required' });
    }

    try {
        // Upload the image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'posts', // Store images in a folder on Cloudinary
        });

        // Create a post in the database
        const post = await Post.create({
            user: req.user.id, // Assumes `req.user` is set by an authentication middleware
            caption,
            photo: result.secure_url, // Use the secure URL provided by Cloudinary
        });

        // Clean up the locally stored file
        fs.unlinkSync(req.file.path);
        res.status(201).json(post);
        
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error.message);

        // Clean up the locally stored file in case of error
        if (req.file && req.file.path) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Get All Posts
const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('user', 'name email'); // Populate user details
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error.message);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    createPost,
    getPosts,
};
