const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const helper = require('./test_helper');
const Blog = require('../models/blog');
const bcrypt = require('bcrypt');
const User = require('../models/user');
let token;

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash('secret', 10);
  const user = new User({ username: 'root', passwordHash });

  await user.save();
  const res = await api.post('/api/login').send(user);

  token = res.token;
});

describe('when there is initially some blogs', () => {
  test('POST/login', async () => {
    const user = {
      username: 'root',
      password: 'secret',
    };

    const res = await api.post('/api/login').send(user);

    token = res.token;
    expect(res.statusCode).toEqual(201);
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
});

describe('viewing a specific blog', () => {
  test('succeeds with a valid id', async () => {
    const blogs = await helper.blogsInDb();
    const blog = blogs[0];

    const resultBlog = await api
      .get(`/api/blogs/${blog.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(resultBlog.body).toEqual(blog);
  });

  test('fails with status code 404 if blog does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId();
    await api.get(`/api/blogs/${validNonexistingId}`).expect(404);
  });

  test('fails with status code 400 when id is invalid', async () => {
    const invalidId = '63d3ef49095a900fa48edf7';

    const res = await api.get(`/api/blogs/${invalidId}`);

    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toContain('invalid id');
  });
});

describe('updating a specific blog', () => {
  test('updates the likes', async () => {
    const blogs = await helper.blogsInDb();
    const blog = blogs[0];
    const updatedBlog = {
      ...blog,
      likes: 20,
    };

    await api.put(`/api/blogs/${blog.id}`).send(updatedBlog);

    const newList = await helper.blogsInDb();
    expect(newList[0].likes).toBe(20);
  });
});

describe('addition of a new blog', () => {
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
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogs = await helper.blogsInDb();
    expect(blogs).toHaveLength(helper.initialBlogs.length + 1);

    const contents = blogs.map((blog) => blog.title);
    expect(contents).toContain('Type wars');
  });

  test("if the likes property doesn't exist it defaults to the value 0", async () => {
    const users = await helper.usersInDb();
    const user = users[0];

    const newBlog = {
      title: 'Computers',
      author: 'John Doe',
      url: 'https://example2.com',
      userId: user.id,
    };

    await api.post('/api/blogs').send(newBlog);
    const blogs = await helper.blogsInDb();

    expect(blogs[blogs.length - 1].likes).toBe(0);
  });

  test('if title, author or url property is missing respond with status code 400 Bad Request', async () => {
    const newBlog = {
      title: 'Computers',
      author: 'John Doe',
    };

    api.post('/api/blogs').send(newBlog).expect(400);
  });
});

describe('deletion of a blog', () => {
  test('succeeds with a status code 204 if id is valid', async () => {
    const blogs = await helper.blogsInDb();
    const blogToDelete = blogs[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    const newList = await helper.blogsInDb();

    expect(newList).toHaveLength(helper.initialBlogs.length - 1);

    const contents = newList.map((blog) => blog.title);
    expect(contents).not.toContain(blogToDelete.title);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
