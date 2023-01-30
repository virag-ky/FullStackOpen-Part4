const blogListRouter = require('express').Router();
const Blog = require('../models/blog');

// Get all blogs
blogListRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

// Create new blog
blogListRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body);

  if (!blog.likes) {
    blog.likes = 0;
  }

  const result = await blog.save();
  response.status(201).json(result);
});

// Update a blog
blogListRouter.put('/:id', async (request, response) => {
  const id = request.params.id;
  const { likes } = request.body;

  const updatedBlog = await Blog.findByIdAndUpdate(id, likes, {
    new: true,
    runValidators: true,
    context: 'query',
  });

  response.json(updatedBlog);
});

// Get by ID
blogListRouter.get('/:id', async (request, response) => {
  const id = request.params.id;

  const blog = await Blog.findById(id);

  if (!blog) {
    response.status(404).end();
  } else {
    response.json(blog);
  }
});

// Delete a blog
blogListRouter.delete('/:id', async (request, response) => {
  const id = request.params.id;
  const blog = await Blog.findByIdAndRemove(id);
  response.status(204).end();
});

module.exports = blogListRouter;
