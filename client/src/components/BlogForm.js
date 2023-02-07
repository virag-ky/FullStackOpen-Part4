const BlogForm = ({ addBlog, newBlog, handleBlogChange }) => {
  return (
    <form onSubmit={addBlog}>
      <input type="text" value={newBlog} onChange={handleBlogChange} />
      <button type="submit">Save</button>
    </form>
  );
};

export default BlogForm;
