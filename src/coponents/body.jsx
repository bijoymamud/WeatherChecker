import { useEffect, useState } from "react";
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiDayHaze, WiFog, WiSmoke } from "react-icons/wi";
import { useNavigate } from "react-router-dom";

const Body = ({ image1, image2, image3, image4, image5, image6, image7, image8 }) => {

  const navigate = useNavigate();
  const [city, setCity] = useState("Dhaka");
  const [search, setSearch] = useState("");
  const [type, setType] = useState("Rain");
  const [backgroundImage, setBackgroundImage] = useState(image2);
  const [fadeOut, setFadeOut] = useState(false);
  const [start, setStart] = useState(false);
  const [suggestions, setSuggestions] = useState([]); // Store city suggestions
  const [lastSearches, setLastSearches] = useState([]); // Store latest search info

  // Fetch weather data based on selected city
  const fetchWeather = async (cityName) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=07ec1c9540a4cccb69a3040c89a3bf7b`;
    const response = await fetch(url);
    const resJson = await response.json();
    setCity(resJson.main);
    setType(resJson.weather[0]);

    // Store the latest searched city
    setLastSearches((prev) => [
      {
        city: cityName,
        temp: resJson.main.temp,
        feelsLike: resJson.main.feels_like,
        country: resJson.sys.country,
        weatherType: resJson.weather[0].main, // Add weather type
      },
      ...prev.slice(0, 2), // Keep only the last 2 recent searches
    ]);
  };

  // Fetch city suggestions based on search input
  const fetchCitySuggestions = async (query) => {
    if (query.length > 2) {
      const url = `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=07ec1c9540a4cccb69a3040c89a3bf7b`;
      const response = await fetch(url);
      const resJson = await response.json();
      setSuggestions(resJson); // Update the suggestions list
    } else {
      setSuggestions([]);
    }
  };

  // Handle key press and fetch suggestions
  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearch(value);
    fetchCitySuggestions(value); // Fetch city suggestions as user types
  };

  // Handle city selection from suggestions
  const handleCitySelection = (cityName) => {
    setSearch(cityName);
    setSuggestions([]); // Clear suggestions
    fetchWeather(cityName); // Fetch weather for selected city
    
    // Navigate to the CityWeather component
    navigate(`/city-weather/${cityName}`);
  };

  useEffect(() => {
    setFadeOut(true);

    let newBackgroundImage;
    if (type.main === "Clear") newBackgroundImage = image1;
    else if (type.main === "Clouds") newBackgroundImage = image2;
    else if (type.main === "Rain") newBackgroundImage = image3;
    else if (type.main === "Snow") newBackgroundImage = image4;
    else if (type.main === "Haze" || type.main === "Mist") newBackgroundImage = image5;
    else if (type.main === "Smoke") newBackgroundImage = image8;
    else newBackgroundImage = image2;

    const timer = setTimeout(() => {
      setBackgroundImage(newBackgroundImage);
      setFadeOut(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [type, image1, image2, image3, image4]);

  const getWeatherIcon = (weatherType) => {
    switch (weatherType) {
      case "Clear":
        return <WiDaySunny size={40} />;
      case "Clouds":
        return <WiCloudy size={40} />;
      case "Rain":
        return <WiRain size={40} />;
      case "Snow":
        return <WiSnow size={40} />;
      case "Haze":
      case "Mist":
        return <WiDayHaze size={40} />;
      case "Fog":
        return <WiFog size={40} />;
      case "Smoke":
        return <WiSmoke size={40} />;
      default:
        return <WiCloudy size={40} />;
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Full-Screen Background Image */}
      <img
        className={`absolute top-0 left-0 h-full w-full object-cover transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
        src={backgroundImage}
        alt="Weather Background"
      />

      {/* Overlay for content */}
      <div className="relative z-10 p-6 text-white max-w-6xl mx-auto">
        {/* Search bar */}
        <div className="relative w-full flex justify-center items-center space-x-4 mb-12">
          <div className="relative w-1/2">
            <input
              type="text"
              className="inputData w-full p-3 rounded-lg shadow-lg text-black"
              placeholder="Search your Address, City, or Zip Code"
              value={search}
              onChange={handleInputChange}
            />
            {/* Display suggestions */}
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


        {/* Recent Locations */}
        <div className="recent-locations">
          <h3 className="text-xl font-bold mb-4">Recent Locations</h3>
          <div className="grid grid-cols-2 gap-6">
            {lastSearches.map((item, index) => (
              <div key={index} className="bg-white bg-opacity-20 backdrop-blur-md p-6 rounded-lg shadow-lg flex flex-col items-center">
                <h4 className="text-2xl font-bold">{item.city}</h4>
                <p className="text-lg">{item.country}</p>
                
                {/* Weather Icon */}
                <div className="mt-2">
                  {getWeatherIcon(item.weatherType)}
                </div>

                <p className="text-3xl font-semibold mt-2">{item.temp}°C</p>
                <p className="text-sm">RealFeel® {item.feelsLike}°C</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
