import React, { useState, useEffect } from 'react';
import './WeatherComponent.css';

const WeatherComponent = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      const lat = 53.9;  // Широта Минска
      const lon = 27.5667; // Долгота Минска
      const apiKey = 'd2070668968af3232bd18d95f86bc26c';  // Ваш ключ API

      try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ru`);  // Используем русский язык для погоды
        
        if (!response.ok) {
          throw new Error('Error fetching weather data');
        }
        
        const data = await response.json();
        setWeatherData(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchWeatherData();
  }, []);

  return (
    <div className="weather-container">
      {error && <p className="error-message">Ошибка: {error}</p>}
      {weatherData ? (
        <div>
          <h3 className="weather-header">{weatherData.name}, {weatherData.sys.country}</h3>
          <img
            className="weather-icon"
            src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
            alt="Weather Icon"
          />
          <div className="weather-details">
            <p>Температура: {weatherData.main.temp}°C</p>
            <p>Погода: {weatherData.weather[0].description}</p>
            <p>Влажность: {weatherData.main.humidity}%</p>
            <p>Ветер: {weatherData.wind.speed} м/с</p>
          </div>
        </div>
      ) : (
        <p className="loading-message">Загружается информация о погоде...</p>
      )}
    </div>
  );
};

export default WeatherComponent;
