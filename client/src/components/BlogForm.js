const BlogForm = ({
  addBlog,
  username,
  blogs,
  title,
  author,
  url,
  handleBlogChange,
}) => {
  return (
    <div>
      <h2>Blogs</h2>
      <p>{username} logged in</p>
      <h2>Create new blog:</h2>
      <form id="blog-form" onSubmit={addBlog}>
        <div className="input-container">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={handleBlogChange}
          />
        </div>
        <div className="input-container">
          <label htmlFor="author">Author:</label>
          <input
            type="text"
            id="author"
            name="author"
            value={author}
            onChange={handleBlogChange}
          />
        </div>
        <div className="input-container">
          <label htmlFor="url">URL:</label>
          <input
            type="text"
            id="url"
            name="url"
            value={url}
            onChange={handleBlogChange}
          />
        </div>
        <button type="submit">Create</button>
      </form>
      {blogs &&
        blogs.map((blog) => (
          <p key={blog.id}>
            {blog.title} - {blog.author}
          </p>
        ))}
    </div>
  );
};

export default BlogForm;
