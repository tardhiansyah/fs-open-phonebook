const express = require('express');
const app = express();

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => {
    return Math.floor(Math.random() * 1000000);
}

app.use(express.json());

app.get("/", (request, response) => {
    response.send("<h1>Hello World!</h1>");
})

app.get("/api/persons", (request, response) => {
    response.json(persons);
});

app.post("/api/persons", (request, response) => {
    const body = request.body;

    if (!body.name) {
        response.json({error: 'name is missing'});
        return;
    }

    if (!body.number) {
        response.json({ error: "number is missing" });
        return;
    }

    const unique = persons.every(person => person.name !== body.name);
    if (!unique) {
      response.json({ error: "name must be unique" });
      return;
    }

    const person = {
        id: generateId(),
        name: String(body.name),
        number: String(body.number)
    };

    persons = persons.concat(person);

    response.json(person);
});

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);
    if (!person) {
        response.statusMessage = "Person not found";
        response.status(404).end();
        return;
    }

    response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);

    response.status(204).end();
});

app.get("/info", (request, response) => {
    const date = new Date();
    response.send(`<p>Phonebook has info for ${persons.length} people<br\>${date}</p>`)
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});