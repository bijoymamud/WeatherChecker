
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { BiCloud } from "react-icons/bi"
import { BsDropletFill } from "react-icons/bs"

export default function CityWeather() {
  const { cityName } = useParams()
  const [cityWeather, setCityWeather] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCityWeather = async () => {
      setLoading(true)
      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=07ec1c9540a4cccb69a3040c89a3bf7b`
        const response = await fetch(url)
        const data = await response.json()
        setCityWeather(data)
      } catch (error) {
        console.error("Failed to fetch weather data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCityWeather()
  }, [cityName])

  if (loading) {
    return <div className="text-center p-4">Loading...</div>
  }

  if (!cityWeather) {
    return <div className="text-center p-4">Failed to load weather data.</div>
  }

  const date = new Date()
  const options = { weekday: 'short', month: 'short', day: 'numeric' }
  const formattedDate = date.toLocaleDateString('en-US', options).toUpperCase()

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-100">
      <div className="bg-white rounded-lg shadow-md p-6 mb-4">
        <h2 className="text-xl font-semibold mb-2">TODAY'S WEATHER</h2>
        <p className="text-right text-sm text-gray-600">{formattedDate}</p>
        <div className="flex items-center mt-2">
          <BiCloud className="mr-2" />
          <p>{cityWeather.weather[0].description}, especially late in the day</p>
        </div>
        <p className="mt-2">Hi: {Math.round(cityWeather.main.temp_max)}°</p>
        <div className="flex items-center mt-2">
          <BsDropletFill className="mr-2" />
          <p>Tonight: {cityWeather.weather[0].description} Lo: {Math.round(cityWeather.main.temp_min)}°</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">CURRENT WEATHER</h2>
          <p className="text-sm text-gray-600">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BsDropletFill className="mr-4" />
            <div>
              <p className="text-6xl font-bold">{Math.round(cityWeather.main.temp)}°</p>
              <p className="text-xl">RealFeel® {Math.round(cityWeather.main.feels_like)}°</p>
            </div>
          </div>
          <div>
            <p className="text-lg font-semibold">{cityWeather.weather[0].main}</p>
            <p className="text-gray-600">MORE DETAILS</p>
          </div>
        </div>
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
  )
}