import { useState, useEffect } from 'react';

import axios from 'axios'

import Country from './components/Country';
import Countries from './components/Countries';

function App() {
  const [countries, setCountries] = useState([])
  const [searchQueryCountry, setSearchQueryCountry] = useState('')

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
      .then((response) => {
        setCountries(response.data)
      })
  }, [])

  const filteredCountries =
    countries.filter(country => 
      country.name.common.toLowerCase().includes(searchQueryCountry.toLocaleLowerCase())
    )

  const isOneCountry = filteredCountries.length === 1
  const isLessThanTenCount = filteredCountries.length < 10

  const handleCountryChange = (e) => {
    setSearchQueryCountry(e.target.value)
  }

  const handleShowClick = country => setSearchQueryCountry(country) 

  return (
    <div>
      <div>
       <span>Find countries: </span>
       <input onChange={handleCountryChange} />
      </div>
      <div>
        {
          isOneCountry
            ? <Country country={filteredCountries[0]} />
            : isLessThanTenCount
                ? <Countries countries={filteredCountries} handleShowClick={handleShowClick}
                  />
                : <p>Too many matches</p>
        }
      </div>
    </div>
  );
}

export default App;
