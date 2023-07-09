import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    {
      name: 'Arto Hellas',
      number: '040-1231244'
    }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const addContact = (event) => {
    event.preventDefault()
    const newContact = {
      name: newName,
      number: newNumber
    }
    persons.map(person => person.name).includes(newName) ? alert(`${newName} is already added to phonebook`) : setPersons(persons.concat(newContact))
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form>
        <div>
          filter shown with <input 
                              value={filter}
                              onChange={handleFilterChange}
                            />
        </div>
      </form>
      <h2>add a new</h2>
      <form onSubmit={addContact}>
        <div>
          name: <input 
                  value={newName}
                  onChange={handleNameChange}
                />
        </div>
        <div>
          number: <input 
                  value={newNumber}
                  onChange={handleNumberChange}
                  />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase())).map(person => <p key={person.name}>{person.name} {person.number}</p>)}
    </div>
  )

}

export default App
