const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :request-body'))
app.use(cors())

morgan.token('request-body', (request, response) => request.method === 'POST' ? JSON.stringify(request.body) : '')

let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

app.get('/info', (request, response) => {
  const message = (`
    <div>
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${Date()}</p>
    </div>
    `)
  response.send(message)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  person
    ? response.json(person)
    : response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

const generateId = () => {
  const ids = persons.map(person => person.id)
  const id = Math.floor(Math.random() * 10000000) + 1
  if (!(ids.includes(id))) {
    return id
  } else {
    return generateId()
  }
}

app.post('/api/persons', (request, response) => {
  const newPerson = { ...request.body, id: generateId() }
  if (newPerson.name && newPerson.number) {
    if (persons.some(person => person.name === newPerson.name)) {
      response.status(400).json({
        error: 'name must be unique'
      })
    } else {
      persons = persons.concat(newPerson)
      response.json(newPerson)
    }
  } else if (!newPerson.name) {
    response.status(400).json({
      error: 'name missing'
    })
  } else {
    response.status(400).json({
      error: 'number missing'
    })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
