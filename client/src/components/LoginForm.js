const LoginForm = ({
  username,
  password,
  handleLogin,
  onChangeUsername,
  onChangePassword,
}) => {
  return (
    <form onSubmit={handleLogin}>
      <div>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={onChangeUsername}
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="text"
          id="password"
          name="password"
          value={password}
          onChange={onChangePassword}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
