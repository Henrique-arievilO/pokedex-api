// app.js
import express from 'express';
import pokemonRoutes from './src/routes/pokemonRoutes.js';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerOptions from './config/swagger/swaggerOptions.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dbConnect from './config/database/dbConnect.js'

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use('/api', pokemonRoutes);
app.use(express.static(path.join(__dirname, 'public')));

const customCss = fs.readFileSync(path.join(__dirname, 'public/css/swagger-custom.css'), 'utf8');
const specs = swaggerJsdoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs, { customCss }));

app.get('/', (req, res) => {
  res.json({ message: "Bem vindo à Pokedex API!" });
});

export default app;