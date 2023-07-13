import { useState, useEffect } from 'react'
import contactService from './services/persons'

const Notification = ({ message, color }) => {
  const notificationStyle = {
    color: color,
    backgroundColor: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }

  if (message === null) {
    return null
  
  }
  return (
    <div style={notificationStyle}>
      {message}
    </div>
  )
}

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

const Person = ({person, removeContact}) => (
  <>
    <p>
      {person.name} {person.number} 
      <button onClick={removeContact}>delete</button>
    </p>
  </>
)

const Persons = ({ persons, filter, removeContact }) => {
  return (
    <>
      {persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase())).map(person => <Person key={person.name} person={person} removeContact={removeContact(person.id)} />)}
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
  const [notification, setNotification] = useState(null)
  const [notificationColor, setNotificationColor] = useState('green')

  useEffect(() => {
    contactService.getAll()
      .then(response => setPersons(response))
  }, [])

  const showNotification = (message) => {
    setNotification(message)
    setTimeout(() => setNotification(null), 5000)
  }

  const showSuccessMessage = (message) => {
    setNotificationColor('green')
    showNotification(message)
  }

  const showErrorMessage = (message) => {
    setNotificationColor('red')
    showNotification(message)
  }

  const addContact = (event) => {
    event.preventDefault()
    const newContact = {
      name: newName,
      number: newNumber
    }

    const replaceNumber = () => {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        contactService.update(persons.find(person => person.name === newName).id, newContact)
          .then(response => {
            setPersons(persons.map(person => person.name !== newName ? person : response))
            showSuccessMessage(`Changed ${newName}'s number`)
          }
        )
          .catch(error => {
            showErrorMessage(`Information of ${newName} has already been removed from server`)
            setPersons(persons.filter(person => person.name !== newName))
          }
          )
      }
    }

    persons.map(person => person.name).includes(newName)
      ? replaceNumber()
      : contactService.create(newContact)
          .then(response => {
            setPersons(persons.concat(response))
            showSuccessMessage(`Added ${newName}`)
          }
          )
    setNewName('')
    setNewNumber('')
  }

  const removeContact = (id) => {
    const name = persons.find(person => person.id === id).name
    return (
      () => {
          if (window.confirm(`Delete ${name}?`) )
              contactService.remove(id)
                .then(() => {
                  setPersons(persons.filter(person => person.id !== id))
                  showSuccessMessage(`Removed ${name}`)
                }
                )
                .catch(error => {
                          showErrorMessage(`Information of ${name} has already been removed from server`)
                          setPersons(persons.filter(person => person.id !== id))
                        }
                )
      }
    )
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
      <Notification message={notification} color={notificationColor} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h3>add a new</h3>
      <PersonForm newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} addContact={addContact} />
      <h3>Numbers</h3>
      <Persons persons={persons} filter={filter} removeContact={removeContact} />
    </div>
  )

}

export default App
