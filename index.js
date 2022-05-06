const cors = require("cors")
const express = require("express")
const morgan = require("morgan")


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

const app = express()
app.use(express.json())
app.use(cors())

morgan.token("req-body", (request, response) => (
    Object.keys(request.body).length === 0 ? "" : JSON.stringify(request.body)
))
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :req-body"))

app.get("/info", (request, response) => {
    response.send(
        `Phonebook has info for ${persons.length} people\n\n` +
        `${new Date().toString()}`
    )
})
app.get("/api/persons", (request, response) => {
    response.json(persons)
})
app.post("/api/persons", (request, response) => {
    if (Object.keys(request.body).length === 0) {
        return response.status(400).json({error: "content missing"})
    }

    for (key of ["name", "number"]) {
        if (!request.body[key]) {
            return response.status(400).json({error: `${key} is missing`})
        }
    }

    if (persons.some(person => person.name === request.body.name)) {
        return response.status(409).json({error: "name must be unique"})
    }

    const person = {
        id: Math.floor(Math.random() * 1000000),
        name: request.body.name,
        number: request.body.number
    }
    persons = persons.concat(person)
    return response.json(person)

})
app.get("/api/persons/:id", (request, response) => {
    const person = persons.find(person => person.id === Number(request.params.id))
    if (!person) {
        return response.status(404).end()
    }

    return response.json(person)
})
app.delete("/api/persons/:id", (request, response) => {
    persons = persons.filter(person => person.id !== Number(request.params.id))
    response.status(204).end()
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})