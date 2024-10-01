

import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { BiCloud, BiSun, BiCloudRain, BiCloudLightning } from "react-icons/bi"
import { BsDropletFill } from "react-icons/bs"

export default function CityWeather() {
  const { cityName } = useParams()
  const [cityWeather, setCityWeather] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true)
      try {
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=07ec1c9540a4cccb69a3040c89a3bf7b`
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=07ec1c9540a4cccb69a3040c89a3bf7b`

        const [currentResponse, forecastResponse] = await Promise.all([
          fetch(currentWeatherUrl),
          fetch(forecastUrl)
        ])

        const currentData = await currentResponse.json()
        const forecastData = await forecastResponse.json()

        setCityWeather(currentData)
        setForecast(forecastData)
      } catch (error) {
        console.error("Failed to fetch weather data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchWeatherData()
  }, [cityName])

  if (loading) {
    return <div className="text-center p-4">Loading...</div>
  }

  if (!cityWeather || !forecast) {
    return <div className="text-center p-4">Failed to load weather data.</div>
  }

  const date = new Date()
  const options = { weekday: 'short', month: 'short', day: 'numeric' }
  const formattedDate = date.toLocaleDateString('en-US', options).toUpperCase()

  const getWeatherIcon = (main) => {
    switch (main.toLowerCase()) {
      case 'clear': return <BiSun />
      case 'clouds': return <BiCloud />
      case 'rain': return <BiCloudRain />
      case 'thunderstorm': return <BiCloudLightning />
      default: return <BiCloud />
    }
    }
    
    console.log(cityWeather)

  return (
    <div className="max-w-5xl mx-auto p-4 bg-gray-100">
     

      <div className="bg-white rounded-lg shadow-md p-6 mb-4">
        <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">CURRENT WEATHER</h2>
                  <div>
                  <p className="text-right text-sm text-gray-600 font-semibold">{formattedDate}</p>
                  <p className="text-sm text-gray-400">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                 </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-start ">
            <span className="text-6xl font-bold text-orange-500">{getWeatherIcon(cityWeather.weather[0].main)}</span>
            <div className="ml-4">
              <p className="text-6xl font-bold">{Math.round(cityWeather.main.temp)}°</p>
              <p className="text-xl">RealFeel® {Math.round(cityWeather.main.feels_like)}°</p>
            </div>
          </div>
          <div>
            <p className="text-lg font-semibold">{cityWeather.weather[0].main}</p>
          </div>
        </div>
              <div className="flex items-center justify-end text-right">
              <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">RealFeel Shade™</p>
            <p>{Math.round(cityWeather.main.feels_like)}°</p>
          </div>
          <div>
            <p className="font-semibold">Wind</p>
            <p>{cityWeather.wind.speed} km/h</p>
          </div>
          <div>
            <p className="font-semibold">Wind Gusts</p>
            <p>{cityWeather.wind.gust || 'N/A'} km/h</p>
          </div>
          <div>
            <p className="font-semibold">Air Quality</p>
            <p className="text-red-500">Unhealthy</p>
          </div>
        </div>
       </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-4">
        <h2 className="text-xl font-semibold mb-4">HOURLY WEATHER</h2>
        <div className="flex overflow-x-auto space-x-4 pb-4">
          {forecast.list.slice(0, 8).map((hour) => (
            <div key={hour.dt} className="flex flex-col items-center min-w-[60px]">
              <p>{new Date(hour.dt * 1000).getHours()}:00</p>
              <span className="text-3xl font-semibold py-2 text-orange-500">{getWeatherIcon(hour.weather[0].main)}</span>
              <p className="font-bold text-2xl">{Math.round(hour.main.temp)}°</p>
              <p className="text-lg text-gray-400">{Math.round(hour.pop * 100)}%</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">6-DAY WEATHER FORECAST</h2>
        {forecast.list.filter((item, index) => index % 7 === 0).slice(0, 7).map((day, index) => (
          <div key={day.dt} className="flex items-center justify-between py-2 border-b last:border-b-0">
            <div className="flex items-center space-x-4">
              <p className="w-12">{index === 0 ? 'TODAY' : new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}</p>
             <span className="text-3xl font-semibold py-2 text-orange-500"> {getWeatherIcon(day.weather[0].main)}</span>
              <div>
                <p className="font-bold text-xl">{Math.round(day.main.temp_max)}°<span className="font-normal text-base ms-2 text-gray-500">{Math.round(day.main.temp_min)}°</span></p>
              </div>
            </div>
            <div className="flex flex-col items-start">
              <p>{day.weather[0].main}</p>
              <p className="text-sm text-gray-500">{day.weather[0].description}</p>
            </div>
            <p className="text-sm">{Math.round(day.pop * 100)}%</p>
          </div>
        ))}
      </div>
    </div>
  )
}