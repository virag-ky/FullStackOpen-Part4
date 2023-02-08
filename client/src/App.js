import './App.css';
import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import LoginForm from './components/LoginForm';
import loginService from './services/login';
import Notification from './components/Notification';
import BlogForm from './components/BlogForm';

const App = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [newBlog, setNewBlog] = useState('');

  // useEffect(() => {
  //   blogService.getAll().then((blogs) => setBlogs(blogs));
  // }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user));

      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      setMessage('Wrong credentials');
      removeMessage();
    }
  };

  const handleLogout = () => {
    window.localStorage.clear();
    setUser(null);
  };

  const onChangeUsername = ({ target }) => setUsername(target.value);

  const onChangePassword = ({ target }) => setPassword(target.value);

  const addBlog = () => {};
  const handleBlogChange = ({ target }) => {
    if (target.name === 'title') {
      setTitle(target.value);
    } else if (target.name === 'author') {
      setAuthor(target.value);
    } else {
      setUrl(target.value);
    }
  };

  const removeMessage = () => {
    setTimeout(() => {
      setMessage('');
    }, 5000);
  };

  return (
    <div>
      {!user && (
        <div>
          <Notification message={message} />
          <LoginForm
            username={username}
            password={password}
            handleLogin={handleLogin}
            onChangeUsername={onChangeUsername}
            onChangePassword={onChangePassword}
          />
        </div>
      )}
      {user && (
        <div>
          <Notification message={message} />
          <BlogForm
            addBlog={addBlog}
            username={user.username}
            blogs={user.blogs}
            title={title}
            author={author}
            url={url}
            handleBlogChange={handleBlogChange}
            handleLogout={handleLogout}
          />
        </div>
      )}
    </div>
  );
};

export default App;
