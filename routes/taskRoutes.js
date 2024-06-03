const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Task = require('../models/Task');

// Validation and error handling middleware
const validateTask = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('status').isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status'),
  body('due_date').isISO8601().withMessage('Due date must be a valid date'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Create a new task
router.post('/tasks', validateTask, async (req, res) => {
  try {
    const { title, description, status, due_date } = req.body;
    const task = new Task({ title, description, status, due_date });
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get all tasks
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).send(tasks);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get a single task by ID
router.get('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).send({ error: 'Task not found' });
    }
    res.status(200).send(task);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Update a task by ID
router.put('/tasks/:id', validateTask, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!task) {
      return res.status(404).send({ error: 'Task not found' });
    }
    res.status(200).send(task);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Delete a task by ID
router.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).send({ error: 'Task not found' });
    }
    res.status(200).send(task);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get the next three tasks due
router.get('/tasks/next-three', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ due_date: 1 }).limit(3);
    res.status(200).send(tasks);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
