const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  due_date: { type: Date, required: true }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
