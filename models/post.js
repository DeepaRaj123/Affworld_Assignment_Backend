const mongoose = require('mongoose');

/**
 * Post Schema
 * Defines the structure of a "Post" document in the MongoDB collection.
 */
const postSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        caption: { type: String, required: true },
        // The URL of the photo associated with the post
        photo: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
