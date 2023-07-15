import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({ filter, handleFilterChange }) => {
  return (
    <form>
      <div>
        find countries <input 
                         value={filter}
                         onChange={handleFilterChange}
                       />
      </div>
    </form>
  )
}

const CountryInfo = ({ country }) => (
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
  </>
)

const Countries = ({ countries }) => (
  countries.length === 1 
    ? <CountryInfo country={countries[0]} />
    : countries.length <= 10
    ? countries.map(country => <p key={country.cca2}>{country.name.common}</p>)
    : <p>Too many matches, specify another filter</p>
)

const App = () => {
  const [filter, setFilter] = useState('')
  const [countries, setCountries] = useState([])

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => setCountries(response.data))
  }, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const filteredCountries = countries.some(country => country.name.common.toLowerCase() === filter.toLowerCase()) 
    ? [countries.find(country => country.name.common.toLowerCase() === filter.toLowerCase())]
    : countries.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <Countries countries={filteredCountries} />
    </div>
  )
}

export default App
