import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({ filter, handleFilterChange }) => {
  return (
    <form>
      <div>
        find countries
        <input 
          value={filter}
          onChange={handleFilterChange}
        />
      </div>
    </form>
  )
}

const Weather = ({ weatherInfo, capital }) => {
  if (weatherInfo) {
      return (
        <>
          <h3>Weather in {capital}</h3>
          <p>temperature {weatherInfo.main.temp} Celsius</p>
          <img src={`https://openweathermap.org/img/wn/${weatherInfo.weather[0].icon}@2x.png`} alt={weatherInfo.weather[0].description} />
          <p>wind {weatherInfo.wind.speed} m/s</p>
        </>
      )
    }

  return null
}

const CountryInfo = ({ country, weatherInfo }) => (
  <>
    <h2>{country.name.common}</h2>
    <p>
      capital {country.capital}<br />
      area {country.area}
    </p>
    <h3>languages:</h3>
    <ul>
      {Object.keys(country.languages).map(key => <li key={key}>{country.languages[key]}</li>)}
    </ul>
    <img src={country.flags.png} alt={country.flags.alt} />
    <Weather weatherInfo={weatherInfo} capital={country.capital} />
  </>
)

const CountryListing = ({ country, handleClick }) => (
  <p>
    {country.name.common}
    <button onClick={handleClick(country)}>show</button>
  </p>
)

const Countries = ({ countries, handleClick, weatherInfo}) => (
  countries.length === 1 
    ? <CountryInfo country={countries[0]} weatherInfo={weatherInfo} />
    : countries.length <= 10
    ? countries.map(country => <CountryListing key={country.cca2} country={country} handleClick={handleClick}/>)
    : <p>Too many matches, specify another filter</p>
)

const App = () => {
  const api_key = process.env.REACT_APP_API_KEY
  const [filter, setFilter] = useState('')
  const [countries, setCountries] = useState([])
  const [previousFilterMatch, setPreviousFilterMatch] = useState('')
  const [weatherInfo, setWeatherInfo] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => setCountries(response.data))
  }, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const showCountryInfo = (country) => () => setFilter(country.name.common)

  const fetchWeatherInfo = (country) =>  {
    const [lat, lon] = country.capitalInfo.latlng
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`).then(response => setWeatherInfo(response.data))
      .catch(error => setWeatherInfo(null))
  }

  const filteredCountries = countries.some(country => country.name.common.toLowerCase() === filter.toLowerCase()) 
    ? [countries.find(country => country.name.common.toLowerCase() === filter.toLowerCase())]
    : countries.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase()))

  if (filteredCountries.length === 1) {
    if (filteredCountries[0].name.common !== previousFilterMatch) {
      fetchWeatherInfo(filteredCountries[0])
      setPreviousFilterMatch(filteredCountries[0].name.common)
    }
  } else if (previousFilterMatch !== '') {
    setPreviousFilterMatch('')
  }
  

  return (
    <div>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <Countries countries={filteredCountries} handleClick={showCountryInfo} weatherInfo={weatherInfo} />
    </div>
  )
}

export default App
