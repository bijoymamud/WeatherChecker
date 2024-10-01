import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const CityWeather = () => {
  const { cityName } = useParams();
  const [cityWeather, setCityWeather] = useState(null);

  useEffect(() => {
    // Fetch the weather for the selected city
    const fetchCityWeather = async () => {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=07ec1c9540a4cccb69a3040c89a3bf7b`;
      const response = await fetch(url);
      const data = await response.json();
      setCityWeather(data);
    };

    fetchCityWeather();
  }, [cityName]);

  return (
    <div>
      {cityWeather ? (
        <div>
          <h1>{cityWeather.name}, {cityWeather.sys.country}</h1>
          <p>Temperature: {cityWeather.main.temp}°C</p>
          <p>Weather: {cityWeather.weather[0].main}</p>
          <p>RealFeel®: {cityWeather.main.feels_like}°C</p>
          {/* Add more details as needed */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default CityWeather;

