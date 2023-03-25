import axios from 'axios'

export const getCountry = country => {
  return axios.get(`https://restcountries.com/v3.1/name/${country}?fullText=true`)
}