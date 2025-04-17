// 1. IMPORTS E CONFIGURAÇÕES INICIAIS
// =====================================
// Importa os módulos necessários:
import express from 'express';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { body, validationResult } from 'express-validator';
// Importa a configuração do Swagger
import { swaggerUi, swaggerSpec } from './config/swagger.js';

// Define __filename e __dirname (não estão disponíveis automaticamente em ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cria a instância do Express e define a porta:
const app = express();
const port = process.env.PORT || 3000;

// Define o caminho do arquivo do banco de dados e o adaptador:
const dbFile = path.join(__dirname, 'db.json');
const adapter = new JSONFile(dbFile);

// Passe a default data como segundo argumento para o Low:
const db = new Low(adapter, { default: { pokemons: [] } });

// Configura os middlewares:
// - Parser JSON para interpretar o corpo das requisições
app.use(express.json());
// - Habilita o CORS para todas as requisições
app.use(cors());
// Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Display the API welcome message.
 *     description: >
 *       This endpoint is used to verify that the Pokedex API is active and running.
 *       It responds with a simple welcome message and does not perform any additional operations.
 *       Typically utilized to confirm the availability of the API server.
 *     responses:
 *       200:
 *         description: Welcome message displayed successfully.
 *         content:
 *           'text/plain':
 *             schema:
 *               type: string
 *               example: "Hello, this is my Pokedex API!"
 */

// Endpoint básico para teste da API (ex.: http://localhost:3000)
app.get('/', (req, res) => {
  res.send('Hello, this is my Pokedex API!');
});

// 2. INICIALIZAÇÃO DO BANCO DE DADOS E DEFINIÇÃO DOS ENDPOINTS
// =============================================================
// Utilize uma função assíncrona autoexecutável para ler/inicializar os dados e definir os endpoints.
/**
 * Initialization of the Database and Endpoint Definitions.
 *
 * This asynchronous Immediately Invoked Function Expression (IIFE) performs the following tasks:
 *   1. Reads the data from the JSON database file (db.json) using LowDB.
 *   2. If the "pokemons" collection is empty (e.g., on the first run), it seeds the database with the default record (Bulbasaur).
 *   3. Defines the main API endpoints that interact with the persistent data, including:
 *      - GET /api/pokemon: Retrieves all pokemons.
 *      - GET /api/pokemon/{number}: Retrieves the details of a specific pokemon by its number.
 *      - POST /api/pokemon: Creates a new pokemon with input validation.
 *      - PUT /api/pokemon/{number}: Updates an existing pokemon with input validation.
 *      - DELETE /api/pokemon/{number}: Deletes a specific pokemon.
 *
 * This structure ensures that the database is properly initialized before any routes are made available,
 * thereby providing a consistent environment for all subsequent API operations.
 */
(async () => {
  // Lê os dados do arquivo; se estiver vazio, o lowdb já define db.data com a default data que passamos.
  await db.read();

  // Se o array de pokémons estiver vazio (ou for a primeira vez), inicializa com o registro padrão.
  if (db.data.pokemons.length === 0) {
    db.data.pokemons = [
      {
        number: 1,
        name: "Bulbasaur",
        image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
        type: "Planta",
        subtype: "Venenoso",
        description: "Pokémon semente. Possui uma semente em seu dorso que cresce com o tempo."
      }
    ];
    await db.write();
  }

  // Definição dos endpoints que interagem com os dados persistidos (db.data.pokemons):

  // GET: Lista todos os pokémons
/**
 * @swagger
 * /api/pokemon:
 *   get:
 *     summary: Retrieves all pokemons.
 *     description: >
 *       This endpoint fetches all the pokemons stored in the database.
 *       It reads the latest data from the JSON file and returns it as a JSON array.
 *     responses:
 *       200:
 *         description: A JSON array containing all the pokemons.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   number:
 *                     type: integer
 *                     description: The unique identifier for the pokemon.
 *                     example: 1
 *                   name:
 *                     type: string
 *                     description: The name of the pokemon.
 *                     example: Bulbasaur
 *                   image:
 *                     type: string
 *                     format: uri
 *                     description: The URL of the pokemon's image.
 *                     example: https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png
 *                   type:
 *                     type: string
 *                     description: The primary type of the pokemon.
 *                     example: Planta
 *                   subtype:
 *                     type: string
 *                     description: The secondary type of the pokemon, if applicable.
 *                     example: Venenoso
 *                   description:
 *                     type: string
 *                     description: A brief description of the pokemon.
 *                     example: "Por algum tempo após o nascimento, ele usa os nutrientes contidos na semente em suas costas para crescer."
 */
app.get('/api/pokemon', async (req, res) => {
  await db.read();
  res.json(db.data.pokemons);
});
  app.get('/api/pokemon', async (req, res) => {
    await db.read();
    res.json(db.data.pokemons);
  });

  // GET: Detalhes de um pokémon pelo número
 /**
 * @swagger
 * /api/pokemon/{number}:
 *   get:
 *     summary: Retrieves a specific pokemon by its number.
 *     description: >
 *       This endpoint searches for a pokemon in the database using its unique numeric identifier.
 *       If found, it returns the pokemon's details. If the specified number does not exist, a 404 error is returned.
 *     parameters:
 *       - in: path
 *         name: number
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique numeric identifier of the pokemon to retrieve.
 *     responses:
 *       200:
 *         description: The requested pokemon was found and returned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 number:
 *                   type: integer
 *                   description: The unique identifier of the pokemon.
 *                   example: 1
 *                 name:
 *                   type: string
 *                   description: The name of the pokemon.
 *                   example: Bulbasaur
 *                 image:
 *                   type: string
 *                   format: uri
 *                   description: The URL of the pokemon's image.
 *                   example: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"
 *                 type:
 *                   type: string
 *                   description: The primary type of the pokemon.
 *                   example: Planta
 *                 subtype:
 *                   type: string
 *                   description: The secondary type of the pokemon, if applicable.
 *                   example: Venenoso
 *                 description:
 *                   type: string
 *                   description: A brief description of the pokemon.
 *                   example: "Por algum tempo após o nascimento, ele usa os nutrientes contidos na semente em suas costas para crescer."
 *       404:
 *         description: The requested pokemon was not found in the database.
 */

  app.get('/api/pokemon/:number', async (req, res) => {
    await db.read();
    const number = parseInt(req.params.number, 10);
    const foundPokemon = db.data.pokemons.find(p => p.number === number);
    if (foundPokemon) {
      res.json(foundPokemon);
    } else {
      res.status(404).json({ error: "Pokémon not found" });
    }
  });

  // POST: Cria um novo Pokémon com validação dos campos de entrada
  /**
 * @swagger
 * /api/pokemon:
 *   post:
 *     summary: Creates a new pokemon.
 *     description: >
 *       This endpoint creates a new pokemon record in the database.
 *       It validates the input data to ensure that:
 *         - "number" is numeric,
 *         - "name" is provided,
 *         - "image" is a valid URL,
 *         - "type" is provided, and
 *         - "description" is provided.
 *       If validation fails, it returns a 400 error with the corresponding validation messages.
 *       On successful creation, it returns the new pokemon data with a 201 status.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               number:
 *                 type: integer
 *                 description: Unique numeric identifier for the pokemon.
 *                 example: 4
 *               name:
 *                 type: string
 *                 description: The pokemon's name.
 *                 example: Charmander
 *               image:
 *                 type: string
 *                 format: uri
 *                 description: URL of the pokemon's image.
 *                 example: https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png
 *               type:
 *                 type: string
 *                 description: The primary type of the pokemon.
 *                 example: Fogo
 *               subtype:
 *                 type: string
 *                 description: The secondary type of the pokemon.
 *                 example: null
 *               description:
 *                 type: string
 *                 description: A brief description of the pokemon.
 *                 example: A chama em sua cauda demonstra a força de sua força vital. Se Charmander estiver fraco, a chama também queimará fracamente.
 *     responses:
 *       201:
 *         description: The pokemon was created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 number:
 *                   type: integer
 *                   example: 4
 *                 name:
 *                   type: string
 *                   example: Charmander
 *                 image:
 *                   type: string
 *                   format: uri
 *                   example: https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png
 *                 type:
 *                   type: string
 *                   example: Fogo
 *                 subtype:
 *                   type: string
 *                   description: The secondary type of the pokemon.
 *                   example: null
 *                 description:
 *                   type: string
 *                   example: A chama em sua cauda demonstra a força de sua força vital. Se Charmander estiver fraco, a chama também queimará fracamente.
 *       400:
 *         description: Input validation failed. Returns the validation errors.
 */
  app.post(
    '/api/pokemon',
    [
      body('number').isNumeric().withMessage('O campo number deve ser numérico.'),
      body('name').notEmpty().withMessage('O campo name é obrigatório.'),
      body('image').isURL().withMessage('O campo image deve ser uma URL válida.'),
      body('type').notEmpty().withMessage('O campo type é obrigatório.'),
      body('description').notEmpty().withMessage('O campo description é obrigatório.')
    ],
    async (req, res) => {
      // Verifica se houve erros na validação
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      await db.read();
      const newPokemon = req.body;

      db.data.pokemons.push(newPokemon);
      await db.write();
      console.log("Novo Pokémon persistido:", newPokemon);
      res.status(201).json(newPokemon);
    }
  );

  // PUT: Atualiza um Pokémon existente, identificado pelo número, com validação dos campos de entrada
  /**
 * @swagger
 * /api/pokemon/{number}:
 *   put:
 *     summary: Updates an existing pokemon by its number.
 *     description: >
 *       This endpoint updates the details of an existing pokemon record identified by its unique numeric identifier.
 *       It validates the input data to ensure that:
 *         - "number" is numeric,
 *         - "name" is provided,
 *         - "image" is a valid URL,
 *         - "type" is provided, and
 *         - "description" is provided.
 *       If validation fails, it returns a 400 error with the validation messages. If the pokemon does not exist, a 404 error is returned.
 *       Upon successful update, it returns the updated pokemon data.
 *     parameters:
 *       - in: path
 *         name: number
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique numeric identifier of the pokemon to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               number:
 *                 type: integer
 *                 description: Unique numeric identifier for the pokemon.
 *                 example: 1
 *               name:
 *                 type: string
 *                 description: The pokemon's name.
 *                 example: Ivysaur
 *               image:
 *                 type: string
 *                 format: uri
 *                 description: URL of the pokemon's image.
 *                 example: https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png
 *               type:
 *                 type: string
 *                 description: The primary type of the pokemon.
 *                 example: Planta
 *               subtype:
 *                 type: string
 *                 description: The secondary type of the pokemon.
 *                 example: Venenoso
 *               description:
 *                 type: string
 *                 description: A brief description of the pokemon.
 *                 example: Quanto mais luz do sol Ivysaur recebe, mais força brota dentro dele, permitindo que o broto em suas costas cresça mais.
 *     responses:
 *       200:
 *         description: The pokemon was updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 number:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: Ivysaur
 *                 image:
 *                   type: string
 *                   format: uri
 *                   example: https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png
 *                 type:
 *                   type: string
 *                   example: Planta
 *                 subtype:
 *                   type: string
 *                   example: Venenoso
 *                 description:
 *                   type: string
 *                   example: Quanto mais luz do sol Ivysaur recebe, mais força brota dentro dele, permitindo que o broto em suas costas cresça mais.
 *       400:
 *         description: Input validation failed. Returns the validation errors.
 *       404:
 *         description: Pokemon not found in the database.
 */
  app.put(
    '/api/pokemon/:number',
    [
      body('number').isNumeric().withMessage('O campo number deve ser numérico.'),
      body('name').notEmpty().withMessage('O campo name é obrigatório.'),
      body('image').isURL().withMessage('O campo image deve ser uma URL válida.'),
      body('type').notEmpty().withMessage('O campo type é obrigatório.'),
      body('description').notEmpty().withMessage('O campo description é obrigatório.')
    ],
    async (req, res) => {
      // Verifica se há erros de validação
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Lê os dados atuais
      await db.read();
      const numberParam = parseInt(req.params.number, 10);
      const index = db.data.pokemons.findIndex(p => p.number === numberParam);

      if (index === -1) {
        return res.status(404).json({ error: 'Pokémon not found' });
      }

      const updatedPokemon = req.body;
      // Atualiza o registro
      db.data.pokemons[index] = updatedPokemon;
      await db.write();
      res.json(updatedPokemon);
    }
  );

  // DELETE: Remove um Pokémon pelo número
  /**
 * @swagger
 * /api/pokemon/{number}:
 *   delete:
 *     summary: Deletes a specific pokemon by its number.
 *     description: >
 *       This endpoint removes a pokemon from the database based on the provided unique numeric identifier.
 *       It reads the current data from the database, searches for the pokemon with the specified number,
 *       and if found, deletes it. If the pokemon is not found, a 404 error is returned.
 *     parameters:
 *       - in: path
 *         name: number
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique numeric identifier of the pokemon to delete.
 *     responses:
 *       200:
 *         description: The pokemon was successfully deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 number:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: Bulbasaur
 *                 image:
 *                   type: string
 *                   format: uri
 *                   example: https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png
 *                 type:
 *                   type: string
 *                   example: Planta
 *                 subtype:
 *                   type: string
 *                   example: Venenoso
 *                 description:
 *                   type: string
 *                   example: Pokémon seed that has a seed on its back which grows over time.
 *       404:
 *         description: Pokemon not found.
 */

  app.delete('/api/pokemon/:number', async (req, res) => {
    await db.read();
    const number = parseInt(req.params.number, 10);
    const index = db.data.pokemons.findIndex(p => p.number === number);

    if (index === -1) {
      return res.status(404).json({ error: 'Pokémon not found' });
    }

    const removedPokemon = db.data.pokemons.splice(index, 1);
    await db.write();
    res.json(removedPokemon[0]);
  });
})();

// 3. INÍCIO DO SERVIDOR
// ======================
// Exporta o app para que possa ser importado nos testes
export default app;