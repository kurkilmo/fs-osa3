require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
const Person = require('./models/phonedb')

app.use(express.json())
app.use(cors())

morgan.token('body', req => {
    return JSON.stringify(req.body)
})
app.use(morgan(
    ':method :url :status :res[content-length] - :response-time ms :body'
))
app.use(express.static('dist'))

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

const info = (resp) => {
    Person.find({}).then(people => {
        const len = people.length
        resp.send(`
        <div>
            <p>Phonebook has info for ${len} people</p>
            <p>${new Date().toString()}</p>
        </div>
    `)
    })
}

app.get('/info', (req, resp) => {
    info(resp)
})

app.get('/api/persons', (req, resp) => {
    Person.find({}).then(people => {
        resp.json(people)
    })
})

app.get('/api/persons/:id', (req, resp, next) => {
    Person.findById(req.params.id).then(person => {
        if (person) resp.json(person)
        else resp.status(404).end()
    }).catch(err => next(err))
})

app.delete('/api/persons/:id', (req, resp, next) => {
    Person.findByIdAndDelete(req.params.id).then(res => {
        resp.status(204).end()
    }).catch(err => next(err))
})

app.post('/api/persons', (req, resp, next) => {
    const body = req.body
    if (!body.name) return resp.status(400).json({ "error": "name missing" })
    if (!body.number) return resp.status(400).json({ "error": "number missing" })
    const person = new Person({
        "name": body.name,
        "number": body.number
    })
    person.save().then(saved => {
        resp.json(saved)
    }).catch(err => next(err))
})

app.put('/api/persons/:id', (req, resp, next) => {
    const body = req.body
    const person = {
        name: body.name,
        number: body.number
    }
    Person.findByIdAndUpdate(
        req.params.id,
        person,
        { new: true, runValidators: true, context: 'query' }
    ).then(updatedPerson => {
        resp.json(updatedPerson)
    }).catch(err => next(err))
})


// Middleware:
const unknownEndpoint = (req, res) => {
    res.status(418).end()
}
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return res.status(400).send({error: error.message})
    }
    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})