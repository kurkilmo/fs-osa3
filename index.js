const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

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
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${new Date().toString()}</p>
        </div>
    `
}

app.get('/info', (req, resp) => {
    resp.send(info())
})

app.get('/api/persons', (req, resp) => {
    resp.json(persons)
})

app.get('/api/persons/:id', (req, resp) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)
    if (person) resp.json(person)
    else resp.status(404).end()
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
    if (persons.map(p => p.name).includes(body.name)) {
        return resp.status(403).json({"error":"name must be unique"})
    }
    
    const id = Math.floor(Math.random() * 2**64) // mikä homma :D
    const newPerson = {
        "id": id,
        "name": body.name,
        "number": body.number
    }
    persons = persons.concat(newPerson)
    resp.json(newPerson)
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})