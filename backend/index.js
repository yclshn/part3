require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person.js')
const app = express()
const PORT = process.env.PORT

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())

const requestTime = (req, res, next) => {
  req.requestTime = new Date().toUTCString()
  next()
}
app.use(requestTime)

morgan.token('body', function (req) {
  return JSON.stringify(req.body)
})

app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      'ms',
      tokens.body(req),
    ].join(' ')
  })
)

app.get('/info', (req, res, next) => {
  Person.find({})
    .then((result) => {
      const personLength = result.map((person) => person.name).length
      res.send(`<div>
      <p>Phonebook has info for ${personLength}</p>
      <p>${req.requestTime}</p>
      </div>`)
    })
    .catch((err) => next(err))
})

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then((result) => {
      res.send(result)
    })
    .catch((err) => next(err))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.send(person)
      }
    })
    .catch((err) => next(err))
})

app.post('/api/persons/', (req, res, next) => {
  const person = new Person({
    name: req.body.name,
    number: req.body.number,
  })

  person
    .save()
    .then((person) => {
      res.send(person)
    })
    .catch((err) => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
  const person = {
    name: req.body.name,
    number: req.body.number,
  }
  const id = req.params.id

  Person.findByIdAndUpdate(id, person, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updatedPerson) => {
      res.send(updatedPerson)
    })
    .catch((err) => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findByIdAndDelete(id)
    .then(() => {
      res.sendStatus(204)
    })
    .catch((err) => next(err))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (err, req, res, next) => {
  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (err.name === 'ValidationError') {
    return res.status(400).send({ error: err.message })
  }

  next(err)
}

app.use(errorHandler)

app.listen(process.env.PORT || PORT, () => {
  console.log(`App is listening on ${PORT}`)
})
