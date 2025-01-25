const Task = require('../models/task');

// Create a Task
const createTask = async (req, res) => {
    const { name, description } = req.body;
    try {
        const task = await Task.create({
            user: req.user.id,
            name,
            description,
            status: 'Pending',
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Get All Tasks for a User
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Update Task Status
const updateTaskStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.status = status;
        await task.save();
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Delete Task
const deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await task.deleteOne();
        res.status(200).json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    createTask,
    getTasks,
    updateTaskStatus,
    deleteTask,
};
