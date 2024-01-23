const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

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

const requestTime = (req, res, next) => {
  req.requestTime = new Date().toUTCString();
  next();
};

app.use(express.static("dist"));
app.use(cors());
app.use(express.json());
app.use(requestTime);

morgan.token("body", function (req) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      tokens.body(req),
    ].join(" ");
  })
);

const generatedId = () => {
  const maxId =
    persons.length > 0 ? Math.max(...persons.map((person) => person.id)) : 0;
  return maxId + 1;
};

app.get("/api/persons", (req, res) => {
  res.send(persons);
});

app.get("/info", (req, res) => {
  responseText = `<p>Phonebook has info for ${persons.length}</p><p>
  Requested at ${req.requestTime}</p>`;
  res.send(responseText);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    res.send(person);
  } else {
    res.sendStatus(404);
  }
});

app.post("/api/persons/", (req, res) => {
  if (!req.body.name) {
    return res.status(400).send({
      error: "Name must be provided",
    });
  }
  if (!req.body.number) {
    return res.status(400).send({
      error: "Number must be provided",
    });
  }

  const nameExists = persons.find((person) => {
    return person.name === req.body.name;
  });
  if (nameExists) {
    return res.status(400).send({
      error: "Name must be unique",
    });
  }

  const person = {
    name: req.body.name,
    number: req.body.number,
    id: generatedId(),
  };
  persons = persons.concat(person);
  res.send(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.sendStatus(204);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

app.listen(process.env.PORT || PORT, () => {
  console.log(`App is listening on ${PORT}`);
});
