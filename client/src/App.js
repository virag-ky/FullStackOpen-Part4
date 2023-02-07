import './App.css';
import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import LoginForm from './components/LoginForm';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  const handleLogin = (event) => {
    event.preventDefault();
    console.log('logging in with ', username, password);
  };

  const onChangeUsername = ({ target }) => setUsername(target.value);
  const onChangePassword = ({ target }) => setPassword(target.value);

  return (
    <div>
      <h2>blogs</h2>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
      <LoginForm
        username={username}
        password={password}
        handleLogin={handleLogin}
        onChangeUsername={onChangeUsername}
        onChangePassword={onChangePassword}
      />
    </div>
  );
};

export default App;
