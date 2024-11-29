const express = require('express');
const Task = require('../models/task');
const User = require("../models/user");
const router = express.Router();
const authMiddleware = require('../middleware/authmiddleware'); 

// Create Task Endpoint
router.post('/', authMiddleware, async (req, res) => {
  const { title, description, deadline, priority } = req.body;

  try {
      // Simulate task creation
      const newTask = { id: Date.now(), title, description, deadline, priority };
      res.status(201).json(newTask); // Respond with the created task
  } catch (err) {
      res.status(500).json({ msg: 'Failed to create task', error: err.message });
  }
});

// Get All Tasks
router.get('/', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update a task (protected)
router.put('/:id', authMiddleware, async (req, res) => {
  const { title, description, priority, deadline } = req.body;

  try {
      // Find the task by ID
      const task = await Task.findById(req.params.id);
      if (!task) {
          return res.status(404).json({ message: 'Task not found' });
      }

      // Check if the user is the task owner
      if (task.user.toString() !== req.user.id) {
          return res.status(403).json({ message: 'Unauthorized' });
      }

      // Update the task
      task.title = title || task.title;
      task.description = description || task.description;
      task.priority = priority || task.priority;
      task.deadline = deadline || task.deadline;

      await task.save();
      res.status(200).json(task);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
      const task = await Task.findByIdAndDelete(req.params.id);
      if (!task) return res.status(404).send({ message: "Task not found" });
      res.status(200).send({ message: "Task deleted successfully" });
  } catch (error) {
      res.status(500).send({ message: "Error deleting task" });
  }
});

module.exports = router;
