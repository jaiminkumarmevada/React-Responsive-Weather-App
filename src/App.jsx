import React, { useState, useEffect } from "react";
import sunImage from "./images/sun.webp";
import RainImage from "./images/rain_with_cloud.webp";
import HazeImage from "./images/sun.webp";
import CloudsImage from "./images/rain_with_cloud.webp";
import ThunderstormImage from "./images/thunder.webp";
import TornadoImage from "./images/Tornado.webp";
import DefaultImage from "./images/sun.webp";

const cities = ["Palanpur", "Ahmedabad", "Mumbai", "Delhi", "Bengaluru", "Chennai", "Kolkata", "Pune", "Surat", "Jaipur"]; // Example city list

function App() {
  const [city, setCity] = useState("Palanpur");
  const [suggestions, setSuggestions] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  const isDayTime = currentHour >= 6 && currentHour < 18;

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const month = months[currentDate.getMonth()];
  const day = currentDate.getDate();
  const year = currentDate.getFullYear();
  const formattedDate = `${month} ${day}, ${year}`;

  const API_KEY = "45f434990185056c5675ec5767a38ad3";

  const fetchWeatherData = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      if (response.ok) {
        setWeatherData(data);
        setError(null);
      } else {
        setWeatherData(null);
        setError(data.message);
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError("Error fetching weather data");
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setCity(value);
    setSuggestions(cities.filter((city) => city.toLowerCase().startsWith(value.toLowerCase())));
  };

  const handleSuggestionClick = (suggestion) => {
    setCity(suggestion);
    setSuggestions([]);
    fetchWeatherData();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchWeatherData();
  };

  const getWeatherIconUrl = (main) => {
    switch (main) {
      case "Clear":
        return sunImage;
      case "Rain":
        return RainImage;
      case "Haze":
        return HazeImage;
      case "Clouds":
        return CloudsImage;
      case "Thunderstorm":
        return ThunderstormImage;
      case "Drizzle":
        return TornadoImage;
      default:
        return DefaultImage;
    }
  };

  return (
    <div className={`App ${isDayTime ? "day" : "night"}`}>
      <div className="container">
        <h1 className="container_date">{formattedDate}</h1>
        {error && <div className="error">{error}</div>}
        {weatherData && (
          <div className="weather_data">
            <h2 className="container_city">{weatherData.name}</h2>
            <img className="container_img" src={getWeatherIconUrl(weatherData.weather[0].main)} alt="Weather Icon" />
            <h2 className="container_degree">{weatherData.main.temp}<sup>°C</sup></h2>
            <h2 className="country_per">{weatherData.weather[0].main}</h2>
            <p className="weather_details">Wind Speed: {weatherData.wind.speed} m/s</p>
            <p className="weather_details">Humidity: {weatherData.main.humidity}%</p>
          </div>
        )}
        <form className="form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="input"
            placeholder="Enter city name"
            value={city}
            onChange={handleInputChange}
            required
          />
          <button type="submit">Get</button>
        </form>
        {suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((suggestion, index) => (
              <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
