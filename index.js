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

const info = () => {
    return `
        <div>
            <p>Wrong info:</p>
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${new Date().toString()}</p>
        </div>
    `
}

app.get('/info', (req, resp) => {
    resp.send(info())
})

app.get('/api/persons', (req, resp) => {
    Person.find({}).then(people => {
        resp.json(people)
    })
})

app.get('/api/persons/:id', (req, resp) => {
    Person.findById(req.params.id).then(person => {
        resp.json(person)
    })
})

app.delete('/api/persons/:id', (req, resp) => {
    const id = Number(req.params.id)
    const found = persons.map(p => p.id).includes(id)
    if (found) {
        const removedPerson = persons.find(p => p.id === id)
        persons = persons.filter(p => p.id !== id)
        resp.status(200).json(removedPerson)
    } else resp.status(404).end()
})

app.post('/api/persons', (req, resp) => {
    const body = req.body
    if (!body.name) return resp.status(400).json({"error":"name missing"})
    if (!body.number) return resp.status(400).json({"error":"number missing"})
    const person = new Person({
        "name": body.name,
        "number": body.number
    })
    person.save().then(saved => {
        resp.json(saved)
    })
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})