import { useEffect, useState } from "react";
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiDayHaze, WiFog, WiSmoke } from "react-icons/wi";
import { useNavigate } from 'react-router-dom';

const Body = ({ image1, image2, image3, image4, image5, image6, image7, image8 }) => {
  const [city, setCity] = useState("Dhaka");
  const [search, setSearch] = useState("");
  const [backgroundImage, setBackgroundImage] = useState(image2);
  const [fadeOut, setFadeOut] = useState(false);
  const [lastSearches, setLastSearches] = useState(() => {
    const savedSearch = localStorage.getItem("lastSearches");
    return savedSearch ? JSON.parse(savedSearch) : [];
  });
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const fetchWeather = async (cityName) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=07ec1c9540a4cccb69a3040c89a3bf7b`;
      const response = await fetch(url);
      const resJson = await response.json();
      
      const newSearch = {
        city: cityName,
        temp: resJson.main.temp,
        feelsLike: resJson.main.feels_like,
        country: resJson.sys.country,
        weatherType: resJson.weather[0].main,
      };

      // Check if the city already exists in the lastSearches array
      const isDuplicate = lastSearches.some(item => item.city.toLowerCase() === cityName.toLowerCase());

      if (!isDuplicate) {
        const updatedSearches = [newSearch, ...lastSearches.slice(0, 2)]; // Keep only the last 3 searches
        setLastSearches(updatedSearches);

        // Save the updated lastSearches in localStorage
        localStorage.setItem("lastSearches", JSON.stringify(updatedSearches));
      }

      setCity(resJson.main);  // Update city state
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const fetchCitySuggestions = async (query) => {
    if (query.length > 2) {
      const url = `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=07ec1c9540a4cccb69a3040c89a3bf7b`;
      const response = await fetch(url);
      const resJson = await response.json();
      setSuggestions(resJson);
    } else {
      setSuggestions([]);
    }
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearch(value);
    fetchCitySuggestions(value);
  };

  const handleCitySelection = (cityName) => {
    setSearch(cityName);
    setSuggestions([]); // Clear suggestions
    fetchWeather(cityName); // Fetch weather for selected city
    navigate(`/city-weather/${cityName}`); // Navigate to city-weather page
  };

  useEffect(() => {
    if (lastSearches.length > 0) {
      const lastWeatherType = lastSearches[0].weatherType;
      let newBackgroundImage;

      if (lastWeatherType === "Clear") newBackgroundImage = image1;
      else if (lastWeatherType === "Clouds") newBackgroundImage = image2;
      else if (lastWeatherType === "Rain") newBackgroundImage = image3;
      else if (lastWeatherType === "Snow") newBackgroundImage = image4;
      else if (lastWeatherType === "Haze" || lastWeatherType === "Mist") newBackgroundImage = image5;
      else if (lastWeatherType === "Smoke") newBackgroundImage = image8;
      else newBackgroundImage = image2;

      setFadeOut(true);  // Fade out the current background
      setTimeout(() => {
        setBackgroundImage(newBackgroundImage);
        setFadeOut(false);  // Fade in the new background
      }, 400);
    }
  }, [lastSearches, image1, image2, image3, image4, image5, image6, image7, image8]);

  useEffect(() => {
    if (lastSearches.length > 0) {
      fetchWeather(lastSearches[0].city);
    }
  }, []);

  const handleWeatherClick = (cityName) => {
    navigate(`/city-weather/${cityName}`);
  };

  const getWeatherIcon = (weatherType) => {
    switch (weatherType) {
      case "Clear":
        return <WiDaySunny size={44} />;
      case "Clouds":
        return <WiCloudy size={44} />;
      case "Rain":
        return <WiRain size={44} />;
      case "Snow":
        return <WiSnow size={44} />;
      case "Haze":
      case "Mist":
        return <WiDayHaze size={44} />;
      case "Fog":
        return <WiFog size={44} />;
      case "Smoke":
        return <WiSmoke size={44} />;
      default:
        return <WiCloudy size={44} />;
    }
  };

  return (
    <div className="relative min-h-screen">
      <img
        className={`absolute top-0 left-0 h-full w-full object-cover transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
        src={backgroundImage}
        alt="Weather Background"
      />

      <div className="relative z-10 p-6 text-white max-w-6xl mx-auto">
        <div className="relative w-full flex justify-center items-center space-x-4 mb-12">
          <div className="relative w-1/2">
            <input
              type="text"
              className="inputData w-full p-3 rounded-lg shadow-lg text-black"
              placeholder="Search your Address or City"
              value={search}
              onChange={handleInputChange}
            />
            {suggestions.length > 0 && (
              <ul className="absolute top-full left-0 w-full bg-white text-black rounded-b-lg shadow-lg mt-1">
                {suggestions.map((item, index) => (
                  <li
                    key={index}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => handleCitySelection(item.name)}
                  >
                    {item.name}, {item.country}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button className="search_icon p-3 bg-white text-black rounded-lg shadow-md" onClick={() => fetchWeather(search)}>
            Search
          </button>
        </div>

        <div className="recent-locations">
          <h3 className="text-xl font-bold mb-4">Recent Locations</h3>
          <div className="grid grid-cols-4 gap-6">
            {lastSearches.map((item, index) => (
              <div key={index} className="bg-white bg-opacity-20 backdrop-blur-md p-6 rounded-lg shadow-lg flex flex-col items-center cursor-pointer" onClick={() => handleWeatherClick(item.city)}>
                <h4 className="text-2xl font-bold">{item.city}</h4>
                <p className="text-lg">{item.country}</p>

                <div className="mt-2 flex gap-2">
                <p className="text-3xl font-semibold mt-2">{Math.round(item.temp)}°<span className="text-sm font-normal">C</span></p>
                  {getWeatherIcon(item.weatherType)}
                </div>

                <p className="text-base">RealFeel® {item.feelsLike}°<span className="text-xs font-normal">C</span></p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
