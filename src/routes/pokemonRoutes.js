//Imports
import express, { Router } from 'express';
import Pokemon from '../models/pokemon.js';

//Variáveis
const router = express.Router();

//Funções
//- GET /pokemon: Listar todos os Pokémon.
router.get('/pokemon', async (req, res) => {
  try {
    const pokemon = await Pokemon.find();
    res.json(pokemon);
  } catch (error) {
    res.status(500).json( {error: 'Erro ao obter pokémon!'})
  }
});
//- GET /pokemon/:id: Buscar um Pokémon específico pelo campo id.
router.get('/pokemon/:id', async (req, res) => {
  try {
    const pokemon = await Pokemon.findOne({ id: req.params.id });
    if (!pokemon) {
      return res.status(404).json({ error: 'Pokémon não encontrado' });
    }
    res.json(pokemon);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter o Pokémon' });
  }
});

//- POST /pokemon: Criar um novo Pokémon.
router.post('/pokemon', async (req, res) => {
  try {
    const newPokemon = await Pokemon.create(req.body);
    res.status(201).json(newPokemon);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar o Pokémon' });
  }
});

//- PUT /pokemon/:id: Atualizar os dados de um Pokémon existente.
router.put('/pokemon/:id', async (req, res) => {
  try {
    const updatedPokemon = await Pokemon.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true } // Retorna o documento atualizado
    );
    if (!updatedPokemon) {
      return res.status(404).json({ error: 'Pokémon não encontrado' });
    }
    res.json(updatedPokemon);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar o Pokémon' });
  }
});

//- DELETE /pokemon/:id: Remover um Pokémon.
router.delete('/pokemon/:id', async (req, res) => {
  try {
    const deletedPokemon = await Pokemon.findOneAndDelete({ id: req.params.id });
    if (!deletedPokemon) {
      return res.status(404).json({ error: 'Pokémon não encontrado' });
    }
    res.json({ message: 'Pokémon deletado com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar o Pokémon' });
  }
});

export default router;