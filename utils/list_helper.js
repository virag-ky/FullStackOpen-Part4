const dummy = (blogs) => 1;

const totalLikes = (blogs) => {
  let total = 0;

  blogs.forEach((blog) => (total += blog.likes));

  return total;
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return [];
  }

  const likesArray = [];
  blogs.map((blog) => likesArray.push(blog.likes));
  const maximumLikes = Math.max(...likesArray);
  const index = likesArray.indexOf(maximumLikes);

  return blogs[index];
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
