const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const helper = require('./test_helper');
const Blog = require('../models/blog');

beforeEach(async () => {
  await Blog.deleteMany({});
  console.log('cleared');

  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);

  console.log('done');
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('all blogs returned', async () => {
  const response = await api.get('/api/blogs');

  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs');
  const contents = response.body.map((blog) => blog.title);

  expect(contents).toContain('React patterns');
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

  const blogs = await helper.blogsInDb();
  expect(blogs).toHaveLength(helper.initialBlogs.length + 1);

  const contents = blogs.map((blog) => blog.title);
  expect(contents).toContain('Type wars');
});

test("if the likes property doesn't exist it defaults to the value 0", async () => {
  const newBlog = {
    title: 'Computers',
    author: 'John Doe',
    url: 'https://example2.com',
  };

  await api.post('/api/blogs').send(newBlog);
  const blogs = await helper.blogsInDb();

  expect(blogs[blogs.length - 1].likes).toBe(0);
});

test('if title or url property is missing respond with status code 400 Bad Request', async () => {
  const newBlog = {
    title: 'Computers',
    author: 'John Doe',
  };

  api.post('/api/blogs').send(newBlog).expect(400);
});

afterAll(async () => {
  await mongoose.connection.close();
});
