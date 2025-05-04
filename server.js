//Imports
import express from 'express';
import { connectDB } from './config/database/database.js';

//Variáveis
const app = express();
const PORT = process.env.PORT || 3000;
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