//Imports
import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/database/database.js';
import pokemonRoutes from './src/routes/pokemonRoutes.js';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerOptions from './config/swagger/swaggerOptions.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

//Variáveis
const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Middlewares
app.use(express.json());
app.use('/api', pokemonRoutes);
app.use(express.static(path.join(__dirname, 'public')));

const customCss = fs.readFileSync(path.join(__dirname, 'public/css/swagger-custom.css'), 'utf8');
const specs = swaggerJsdoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs, { customCss }));

const startServer = async () => {
  //Funções
  await connectDB();
  app.get('/', (req, res) => {
    res.json({message: "Bem vindo à Pokedex API!"});
  });
  
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
};

startServer();