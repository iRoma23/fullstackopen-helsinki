import React from 'react'
import { useState ,useEffect } from 'react'

import axios from 'axios'

const CapitalWeather = ( {capital} ) => {
  const [weather, setWeather] = useState({})

  const apiKey = process.env.REACT_APP_API_KEY

  useEffect(() => {
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}`)
      .then((response) => {
        setWeather(response.data)
      })
  }, [capital, apiKey]) 

  return (
    <>
    {weather.main
      ? <div>
          <h2>Weather {weather.name}</h2>
          <p>temperature {(weather.main.temp - 273.15).toFixed(2)} Celcius</p>
          <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={`weather icon of ${weather.name}`} />
          <p>wind {weather.wind.speed} m/s</p>
        </div>
      : null}
    </>
  )
}

export default CapitalWeather