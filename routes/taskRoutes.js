const express = require('express');
const { createTask, getTasks, updateTaskStatus, deleteTask } = require('../controllers/taskController');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
    .post(protect, createTask)   // Create a task
    .get(protect, getTasks);     // Get all tasks

router.route('/:id')
    .put(protect, updateTaskStatus) // Update task status
    .delete(protect, deleteTask);   // Delete a task

module.exports = router;
