const blogListRouter = require('express').Router();
const Blog = require('../models/blog');

// Get all blogs
blogListRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

// Create new blog
blogListRouter.post('/', (request, response) => {
  const blog = new Blog(request.body);

  blog.save().then((result) => response.status(201).json(result));
});

module.exports = blogListRouter;
