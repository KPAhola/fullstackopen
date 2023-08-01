require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(express.json())
app.use(express.static('build'))
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
  Person.find({}).then(people => response.json(people))
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

app.post('/api/persons', (request, response) => {
  const newPerson = new Person({ 
    name: request.body.name,
    number: request.body.number
  })
  if (newPerson.name && newPerson.number) {
    newPerson.save().then(savedPerson => response.json(savedPerson))
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

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
