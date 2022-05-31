import React from 'react'

const Countries = ( {countries, handleShowClick} ) => {
  return (
    countries
      .map(country => 
        <p key={country.name.common}>
          {country.name.common}
          <button onClick={() => handleShowClick(country.name.common)}>
            show
          </button>
        </p>
      )
  )
}

export default Countries