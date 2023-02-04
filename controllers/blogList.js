const blogListRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

// Get all blogs
blogListRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('author');
  response.json(blogs);
});

// Create new blog
blogListRouter.post('/', async (request, response) => {
  const body = request.body;
  const users = await User.find({});
  const user = users.filter((u) => u.username === body.author);

  const blog = new Blog({
    title: body.title,
    likes: body.likes,
    url: body.url,
    author: body.author,
    user: user._id,
  });

  if (!blog.likes) {
    blog.likes = 0;
  }

  const savedBlog = await blog.save();
  user.notes = user.notes.concat(savedNote._id);
  await user.save();

  response.status(201).json(savedBlog);
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
  await Blog.findByIdAndRemove(id);
  response.status(204).end();
});

module.exports = blogListRouter;
