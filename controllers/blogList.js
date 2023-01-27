const blogListRouter = require('express').Router();
const Blog = require('../models/blog');

// Get all blogs
blogListRouter.get('/', (request, response) => {
  Blog.find({}).then((blogs) => response.json(blogs));
});

// Create new blog
blogListRouter.post('/', (request, response) => {
  const blog = new Blog(request.body);

  blog.save().then((result) => response.status(201).json(result));
});

module.exports = blogListRouter;
