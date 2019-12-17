const express = require("express");

const server = express();

server.use(express.json());

//localhost:3000/teste

// Parametros:
// Query params = ?teste=1
// Rout params = /users/1
// Request body = { "nome":"gus" }

const users = ["Efrinha", "Gus", "Tag", "Weds", "Thay"];

server.use((req, res, next) => {
  console.time(`Método: ${req.method} Tempo`);
  next();
  console.timeEnd(`Método: ${req.method} Tempo`);
});

function checkUserExists(req, res, next) {
  if (!req.body.nome) {
    return res.status(400).json({ error: "Deve conter nome" });
  }

  return next();
}

function checkUserInArray(req, res, next) {
  const user = users[req.params.index];
  if (!user) {
    return res.status(404).json({ error: "Posição nao existe" });
  }

  req.user = user;

  return next();
}

server.get("/users/:index", checkUserInArray, (req, res) => {
  return res.json(req.user);
});

server.get("/users", (req, res) => {
  return res.json(users);
});

server.post("/users", checkUserExists, (req, res) => {
  const { nome } = req.body;

  users.push(nome);

  return res.json({ message: `Usuario add ${nome}` });
});

server.put("/users/:index", checkUserExists, (req, res) => {
  const { nome } = req.body;
  const { index } = req.params;

  users[index] = nome;

  return res.json(users);
});

server.delete("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.send();
});

server.listen(3000);
