// Importa o Express
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Endpoint básico: raiz da API
app.get('/', (req, res) => {
    res.send('Hello, this is my Pokedex API!');
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}.`);
});