//Imports
import mongoose from 'mongoose';
import dotenv from 'dotenv';

//Variáveis
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pokedex';

//Funções
export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Conexão com MongoDB estabelecida com sucesso!')
  } catch (error) {
    console.error('Falha ao conectar ao MongoDB:', error);
    process.exit(1);
  }
};