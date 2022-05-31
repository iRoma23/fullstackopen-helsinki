import React from 'react'

import CapitalWeather from './CapitalWeather'

const Country = ({ country }) => {
  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>
        <p>capital {country.capital[0]}</p>
        <p>area {country.area}</p>
      </div>
      <div>
        <h3>languages:</h3>
        <ul>
          {
            Object.keys(country.languages).map((lang) => 
              <li key={(country.languages)[lang]}>
                {(country.languages)[lang]}
              </li>
            )
          }
        </ul>
      </div>
      <img src={country.flags.svg} alt={country.name.common} style={{height: '50px'}} />
      <CapitalWeather capital={country.capital[0]}  />
    </div>
  )
}

export default Country