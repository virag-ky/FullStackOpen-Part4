const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs');

  expect(response.body).toHaveLength(2);
});

test('the first blog is about study', async () => {
  const response = await api.get('/api/blogs');

  expect(response.body[0].title).toBe('Study');
});

test('unique identifier property is named id and it exist', async () => {
  const response = await api.get('/api/blogs');

  expect(response.body[0].id).toBeDefined();
});

afterAll(async () => {
  await mongoose.connection.close();
});
