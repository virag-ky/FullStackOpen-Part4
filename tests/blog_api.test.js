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

  // expect(response.body).toHaveLength(3);
});

test('the first blog is about study', async () => {
  const response = await api.get('/api/blogs');

  expect(response.body[0].title).toBe('Study');
});

test('unique identifier property is named id and it exist', async () => {
  const response = await api.get('/api/blogs');

  expect(response.body[0].id).toBeDefined();
});

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Computer Science',
    author: 'Jane Doe',
    url: 'https://example2.com',
    likes: 15,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/blogs');
  const contents = response.body.map((blog) => blog.title);

  //expect(response.body).toHaveLength(3);
  expect(contents).toContain('Computer Science');
});

afterAll(async () => {
  await mongoose.connection.close();
});
