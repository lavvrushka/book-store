import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import { jwtDecode as decodeJwt } from 'jwt-decode';
import './Header.css';

const Header = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState(null);

  // Извлечение имени пользователя из JWT токена
  useEffect(() => {
    const token = localStorage.getItem('jwt'); // Получаем токен из LocalStorage
    if (token) {
      try {
        const decodedToken = decodeJwt(token);
        setUserName(decodedToken.name); // Извлекаем имя пользователя
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('jwt'); // Если токен недействителен, удаляем его
      }
    }
  }, []);

  const handleDropdownToggle = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/logout', {
        method: 'GET',
      });

      if (response.ok) {
        // Успешный logout
        localStorage.removeItem('jwt'); // Удаляем токен из LocalStorage

        // Очистка cookies
        document.cookie.split(';').forEach((cookie) => {
          document.cookie = cookie
            .replace(/^ +/, '')
            .replace(/=.*/, `=; expires=${new Date(0).toUTCString()}; path=/`);
        });

        // Перенаправление на страницу входа
        window.location.href = '/login';
      } else {
        console.error('Failed to log out:', response.statusText);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleProfile = () => {
    window.location.href = 'http://localhost:3000/profile';
    setDropdownOpen(false);
  };

  return (
    <header className="header">
      <h1>BookShop</h1>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/catalog">Catalog</Link></li> 
          <li><Link to="/cart">Cart</Link></li> 
          <li><Link to="/crud">CRUD</Link></li> 
          {userName ? (
            <li className="dropdown">
              <button
                className="dropdown-toggle"
                onClick={handleDropdownToggle}
                aria-expanded={isDropdownOpen}
              >
                {userName} {/* Имя пользователя из токена */}
              </button>
              {isDropdownOpen && (
                <ul className="dropdown-menu">
                  <li>
                    <Link onClick={handleProfile} to="/profile" className="dropdown-link">Profile</Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="dropdown-link logout-button">Logout</button>
                  </li>
                </ul>
              )}
            </li>
          ) : (
            <li><Link to="/login">Login</Link></li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default observer(Header);
