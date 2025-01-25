const mongoose = require('mongoose');

/**
 * Task Schema
 * Defines the structure of a "Task" document in the MongoDB collection.
 */
const taskSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['Pending', 'Completed', 'Done'], default: 'Pending' },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
