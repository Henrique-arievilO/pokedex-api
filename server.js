//Imports
import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/database/database.js';
import pokemonRoutes from './src/routes/pokemonRoutes.js';

dotenv.config();

//Variáveis
const app = express();
const PORT = process.env.PORT || 3000;

//Middlewares
app.use(express.json());
app.use('/api', pokemonRoutes);

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