import { useState, useEffect } from 'react'
import contactService from './services/persons'

const Filter = ({ filter, handleFilterChange }) => {
  return (
    <form>
      <div>
        filter shown with <input 
                            value={filter}
                            onChange={handleFilterChange}
                          />
      </div>
    </form>
  )
}

const PersonForm = ({ newName, newNumber, handleNameChange, handleNumberChange, addContact }) => {
  return (
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
  )
}

const Person = ({person}) => (
  <p>{person.name} {person.number}</p>
)

const Persons = ({ persons, filter }) => {
  return (
    <>
      {persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase())).map(person => <Person key={person.name} person={person} />)}
    </>
  )
}

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

  useEffect(() => {
    contactService.getAll()
      .then(response => setPersons(response))
  }, [])

  const addContact = (event) => {
    event.preventDefault()
    const newContact = {
      name: newName,
      number: newNumber
    }
    persons.map(person => person.name).includes(newName)
      ? alert(`${newName} is already added to phonebook`)
      : contactService.create(newContact)
          .then(response => setPersons(persons.concat(response)))
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
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h3>add a new</h3>
      <PersonForm newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} addContact={addContact} />
      <h3>Numbers</h3>
      <Persons persons={persons} filter={filter} />
    </div>
  )

}

export default App
