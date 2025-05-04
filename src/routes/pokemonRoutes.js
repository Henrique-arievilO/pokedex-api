//Imports
import express from 'express';
import Pokemon from '../models/pokemon.js';

//Variáveis
const router = express.Router();

//Funções
/**
 * @swagger
 * /api/pokemon:
 *   get:
 *     summary: Listar todos os Pokémon
 *     description: Retorna a lista completa de Pokémon cadastrados.
 *     responses:
 *       200:
 *         description: Lista de Pokémon retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pokemon'
 */
//- GET /pokemon: Listar todos os Pokémon.
router.get('/pokemon', async (req, res) => {
  try {
    const pokemon = await Pokemon.find();
    res.json(pokemon);
  } catch (error) {
    res.status(500).json( {error: 'Erro ao obter pokémon!'})
  }
});

/**
 * @swagger
 * /api/pokemon/{id}:
 *   get:
 *     summary: Obter um Pokémon pelo ID
 *     description: Retorna o Pokémon que corresponde ao ID fornecido.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do Pokémon a ser buscado.
 *     responses:
 *       200:
 *         description: Dados do Pokémon retornados com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pokemon'
 *       404:
 *         description: Pokémon não encontrado.
 */
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

/**
 * @swagger
 * /api/pokemon:
 *   post:
 *     summary: Criar um novo Pokémon
 *     description: Cria um novo registro de Pokémon utilizando os dados informados.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pokemon'
 *     responses:
 *       201:
 *         description: Pokémon criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pokemon'
 */
//- POST /pokemon: Criar um novo Pokémon.
router.post('/pokemon', async (req, res) => {
  try {
    const newPokemon = await Pokemon.create(req.body);
    res.status(201).json(newPokemon);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar o Pokémon' });
  }
});

/**
 * @swagger
 * /api/pokemon/{id}:
 *   put:
 *     summary: Atualizar um Pokémon existente
 *     description: Atualiza os dados de um Pokémon já cadastrado, identificado pelo ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do Pokémon que será atualizado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pokemon'
 *     responses:
 *       200:
 *         description: Dados do Pokémon atualizados com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pokemon'
 *       404:
 *         description: Pokémon não encontrado.
 */
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

/**
 * @swagger
 * /api/pokemon/{id}:
 *   delete:
 *     summary: Remover um Pokémon
 *     description: Remove o Pokémon correspondente ao ID informado.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do Pokémon a ser removido.
 *     responses:
 *       200:
 *         description: Pokémon removido com sucesso.
 *       404:
 *         description: Pokémon não encontrado.
 */
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