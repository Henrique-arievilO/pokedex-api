//Imports
import express from 'express';

//Variáveis
const app = express();
const PORT = process.env.PORT || 3000;

//Funções
app.get('/', (req, res) => {
  res.json({message: "Bem vindo à Pokedex API!"});
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});