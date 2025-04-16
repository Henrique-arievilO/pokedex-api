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

// Endpoint básico para teste da API (ex.: http://localhost:3000)
app.get('/', (req, res) => {
  res.send('Hello, this is my Pokedex API!');
});

// 2. INICIALIZAÇÃO DO BANCO DE DADOS E DEFINIÇÃO DOS ENDPOINTS
// ==============================================================
// Utilize uma função assíncrona autoexecutável para ler/inicializar os dados e definir os endpoints.
(async () => {
  // Lê os dados do arquivo; se estiver vazio, o lowdb já define db.data com a default data que passamos.
  await db.read();

  // Se o array de pokémons estiver vazio (ou for a primeira vez), inicializa com os registros padrão.
  if (db.data.pokemons.length === 0) {
    db.data.pokemons = [
      {
        number: 1,
        name: "Bulbasaur",
        image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
        type: "Planta",
        subtype: "Venenoso",
        description: "Pokémon semente. Possui uma semente em seu dorso que cresce com o tempo."
      },
      {
        number: 4,
        name: "Charmander",
        image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
        type: "Fogo",
        subtype: null,
        description: "Pokémon lagarto. Um pequeno dinossauro com uma chama na ponta da cauda."
      },
      {
        number: 7,
        name: "Squirtle",
        image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",
        type: "Água",
        subtype: null,
        description: "Pokémon Tartaruga Minúscula. Um pequeno Pokémon tartaruga com uma carapaça resistente."
      }
    ];
    await db.write();
  }

  // Definição dos endpoints que interagem com os dados persistidos (db.data.pokemons):

  // GET: Lista todos os pokémons
  app.get('/api/pokemon', async (req, res) => {
    await db.read();
    res.json(db.data.pokemons);
  });

  // GET: Detalhes de um pokémon pelo número
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

  // 3. INÍCIO DO SERVIDOR
  // ======================
  // Inicia o servidor apenas uma vez, após a configuração e inicialização do banco de dados.
  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
})();