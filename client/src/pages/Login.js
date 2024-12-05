import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import './Login.css';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const name = params.get('name');
        const email = params.get('email');

        if (token) {
            // Сохраняем токен в localStorage или cookies
            localStorage.setItem('jwt', token);
            localStorage.setItem('user', JSON.stringify({ name, email }));

           
            window.location.href = '/';
        }
    }, []);


  const handleFormSubmit = (e) => {
    e.preventDefault();
    const user = { email, password };
    console.log('User Login:', JSON.stringify(user));
    fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Login failed');
        }
        return response.json();
      })
      .then((data) => {
        localStorage.setItem('jwt', data.token);
        window.location.href = '/';
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Login failed. Please check your email and password.');
      });
  };



  return (
    <div className="login">
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <div className="divider">or</div>
        <button onClick={handleLogin} className="google-login-button">
          Login with Google
        </button>
        <div className="register-link">
          <p>Don't have an account?</p>
          <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default observer(Login);
