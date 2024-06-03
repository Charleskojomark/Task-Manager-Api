const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Adjust the path if needed
const Task = require('../models/Task');

describe('Task API Endpoints', () => {
  let taskId;

  // Connect to the database before running tests
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  // Disconnect from the database after all tests have run
  afterAll(async () => {
    await mongoose.connection.close();
  });

  // Clear the database before each test
  beforeEach(async () => {
    await Task.deleteMany({});
    const task = await Task.create({
      title: 'Initial Task',
      description: 'Initial task description',
      status: 'pending',
      due_date: '2024-06-10',
    });
    taskId = task._id.toString();
  });

  it('should create a new task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({
        title: 'Test Task',
        description: 'This is a test task',
        status: 'pending',
        due_date: '2024-06-10',
      })
      .expect(201);

    expect(res.body).toHaveProperty('_id');
  }, 10000);

  it('should get all tasks', async () => {
    const res = await request(app).get('/api/tasks').expect(200);
    expect(res.body.length).toBeGreaterThan(0);
  }, 10000);

  it('should get a single task by ID', async () => {
    const res = await request(app).get(`/api/tasks/${taskId}`).expect(200);
    expect(res.body).toHaveProperty('_id', taskId);
  }, 10000);

  it('should update a task by ID', async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .send({
        title: 'Updated Task',
        description: 'This is an updated test task',
        status: 'in-progress',
        due_date: '2024-06-11',
      })
      .expect(200);

    expect(res.body).toHaveProperty('title', 'Updated Task');
  }, 10000);

  it('should delete a task by ID', async () => {
    await request(app).delete(`/api/tasks/${taskId}`).expect(200);
    const task = await Task.findById(taskId);
    expect(task).toBeNull();
  }, 10000);

  it('should get the next three tasks due', async () => {
    await Task.create([
      { title: 'Task 1', description: 'First task', status: 'pending', due_date: '2024-06-10' },
      { title: 'Task 2', description: 'Second task', status: 'pending', due_date: '2024-06-11' },
      { title: 'Task 3', description: 'Third task', status: 'pending', due_date: '2024-06-12' },
      { title: 'Task 4', description: 'Fourth task', status: 'pending', due_date: '2024-06-13' },
    ]);

    const res = await request(app).get('/api/tasks/next-three').expect(200);
    expect(res.body.length).toBe(3);
  }, 10000);
});
