// Importa o Express
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Midleware instrui o Express a utilizar seu parser interno para JSON
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const cors = require('cors');
app.use(cors());

//BASE ENDPOINT
// Endpoint básico: raiz da API
app.get('/', (req, res) => {
    res.send('Hello, this is my Pokedex API!');
});

// Dados fictícios para a Pokedéx
const pokemons = [
  {
    number: 1,
    name: "Bulbasaur",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
    type: "Grass",
    subtype: "Poison"
  },
  {
    number: 4,
    name: "Charmander",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
    type: "Fire",
    subtype: null
  },
  {
    number: 7,
    name: "Squirtle",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",
    type: "Water",
    subtype: null
  },
  {
    number: 25,
    name: "Squirtle",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",
    type: "Water",
    subtype: null
  }
];


//GET
// Endpoint para listar todos os pokémons
app.get('/api/pokemon', (req, res) => {
  res.json(pokemons);
});

// Endpoint para obter detalhes de um pokémon pelo número
app.get('/api/pokemon/:number', (req, res) => {
  const number = parseInt(req.params.number, 10);
  const foundPokemon = pokemons.find(p => p.number === number);
  if (foundPokemon) {
    res.json(foundPokemon);
  } else {
    res.status(404).json({ error: "Pokémon not found" });
  }
});


//POST
// Endpoint para criar um novo Pokémon
app.post('/api/pokemon', (req, res) => {
  const newPokemon = req.body;

  // Validação simples: verificar se os campos obrigatórios foram enviados
  if (!newPokemon.number || !newPokemon.name || !newPokemon.image || !newPokemon.type) {
    return res.status(400).json({ error: "Os campos 'number', 'name', 'image' e 'type' são obrigatórios." });
  }

  // Adiciona o novo Pokémon ao array
  pokemons.push(newPokemon);

  // Retorna o novo Pokémon criado com status 201 (Created)
  return res.status(201).json(newPokemon);
});


//PUT
// Endpoint PUT para atualizar um Pokémon existente identificado pelo seu número
app.put('/api/pokemon/:number', (req, res) => {
  const number = parseInt(req.params.number, 10);
  const index = pokemons.findIndex(p => p.number === number);

  if (index === -1) {
    return res.status(404).json({ error: 'Pokémon not found' });
  }

  const updatedPokemon = req.body;

  // Validação: garantir que os campos essenciais estão presentes
  if (!updatedPokemon.number || !updatedPokemon.name || !updatedPokemon.image || !updatedPokemon.type) {
    return res.status(400).json({ error: "Os campos 'number', 'name', 'image' e 'type' são obrigatórios." });
  }

  // Atualiza o registro
  pokemons[index] = updatedPokemon;

  res.json(updatedPokemon);
});

//DELETE
// Endpoint DELETE para remover um Pokémon pelo número
app.delete('/api/pokemon/:number', (req, res) => {
  const number = parseInt(req.params.number, 10);
  const index = pokemons.findIndex(p => p.number === number);

  if (index === -1) {
    return res.status(404).json({ error: 'Pokémon not found' });
  }

  // Remove o Pokémon do array e retorna o registrado removido
  const removedPokemon = pokemons.splice(index, 1);
  
  res.json(removedPokemon[0]);
});


//START SERVER
// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}.`);
});