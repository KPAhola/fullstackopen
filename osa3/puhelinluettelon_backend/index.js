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

morgan.token('request-body', (request) => request.method === 'POST' ? JSON.stringify(request.body) : '')

app.get('/info', (request, response) => {
  Person.estimatedDocumentCount()
    .then(count => {
      const message = (`
        <div>
          <p>Phonebook has info for ${count} people</p>
          <p>${Date()}</p>
        </div>
        `)
      response.send(message)
    })
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => response.json(people))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person =>  {
      person
        ? response.json(person)
        : response.status(404).end()
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => response.status(204).end())
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const newPerson = new Person({
    name: request.body.name,
    number: request.body.number
  })
  if (newPerson.name && newPerson.number) {
    newPerson.save()
      .then(savedPerson => response.json(savedPerson))
      .catch(error => next(error))
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

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body
  const person = {
    name: name,
    number: number
  }
  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      if (updatedPerson) {
        response.json(updatedPerson)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
