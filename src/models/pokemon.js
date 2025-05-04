//Imports
import mongoose from "mongoose";

//Variáveis
const { Schema, model } = mongoose;
const PokemonSchema = new Schema({
  id: {
    type: Number,
    unique: true
  },
  number: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  subtype: {
    type: String,
    default: null,
    trim: true
  },
  atk: {
    type: Number,
    required: true,
    min: 0
  },
  def: {
    type: Number,
    required: true,
    min: 0
  },
  hp: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  weakness: {
    type: [String],
    default: []
  },
  location: {
    type: String,
    trim: true
  },
  img: {
    type: String,
    trim: true
  },
  evolutionChain: {
    type: String,
    trim: true
  }
});

//Funções
PokemonSchema.pre('save', async function (next) {
  if(this.isNew && (this.id === undefined || this.id === null)){
    try {
      const lastPokemon = await this.constructor.findOne({}).sort({ id: -1});
      this.id = lastPokemon ? lastPokemon.id + 1 : 1;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

export default model('Pokemon', PokemonSchema);