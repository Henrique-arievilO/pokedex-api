// Importa o Express
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

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
  }
];

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

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}.`);
});