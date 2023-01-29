const blogListRouter = require('express').Router();
const Blog = require('../models/blog');

// Get all blogs
blogListRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  blogs.forEach((blog) => {
    if (blog.likes === '') {
      blog['likes'] = 0;
    }
  });
  response.json(blogs);
});

// Create new blog
blogListRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body);

  const result = await blog.save();
  response.status(201).json(result);
});

module.exports = blogListRouter;
