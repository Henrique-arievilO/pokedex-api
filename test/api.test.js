// test/api.test.js
import { expect } from 'chai';
import supertest from 'supertest';
import fs from 'fs';
import path from 'path';

const dbFile = path.join(process.cwd(), 'db.json');

// Antes de cada teste, reseta o estado do banco para conter apenas o Bulbasaur
beforeEach(function () {
  this.timeout(5000); // Aumenta o timeout do hook, se necessário
  const estadoInicial = {
    pokemons: [
      {
        number: 1,
        name: "Bulbasaur",
        image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
        type: "Planta",
        subtype: "Venenoso",
        description: "Pokémon semente. Possui uma semente em seu dorso que cresce com o tempo."
      }
    ]
  };
  fs.writeFileSync(dbFile, JSON.stringify(estadoInicial, null, 2));
});

// Importa o app para os testes (certifique-se de que o server.js exporte o app)
import app from '../server.js';

const request = supertest(app);

describe('Pokedex API', function () {
  this.timeout(10000); // Aumenta o timeout global para esta suite de testes

  // Testa o endpoint GET /
  it('deve retornar a mensagem de boas-vindas na raiz (GET /)', async function () {
    const res = await request.get('/');
    expect(res.status).to.equal(200);
    expect(res.text).to.include('Hello, this is my Pokedex API!');
  });

  // Testa o endpoint GET /api/pokemon
  it('deve listar todos os pokémons (GET /api/pokemon)', async function () {
    const res = await request.get('/api/pokemon');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body).to.have.lengthOf(1); // Apenas o Bulbasaur está presente
    expect(res.body[0].name).to.equal('Bulbasaur');
  });

  // Testa o endpoint POST /api/pokemon
  it('deve adicionar um novo Pokémon (POST /api/pokemon)', async function () {
    const novoPokemon = {
      number: 4,
      name: "Charmander",
      image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
      type: "Fogo",
      description: "Pokémon lagarto. Um pequeno dinossauro com uma chama na ponta da cauda."
    };

    const res = await request.post('/api/pokemon').send(novoPokemon);
    expect(res.status).to.equal(201);
    expect(res.body).to.include(novoPokemon);

    // Após a adição, o banco deve conter Bulbasaur e Charmander
    const getRes = await request.get('/api/pokemon');
    expect(getRes.body).to.have.lengthOf(2);
    expect(getRes.body[1].name).to.equal('Charmander');
  });

  // Testa o endpoint PUT /api/pokemon/:number
  it('deve atualizar um Pokémon existente (PUT /api/pokemon/:number)', async function () {
    const pokemonAtualizado = {
      number: 1,
      name: "Ivysaur",
      image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png",
      type: "Planta",
      description: "Pokémon evoluído. Está se tornando mais forte."
    };

    const res = await request.put('/api/pokemon/1').send(pokemonAtualizado);
    expect(res.status).to.equal(200);
    expect(res.body.name).to.equal('Ivysaur');

    // Verifica se o Pokémon foi realmente atualizado
    const getRes = await request.get('/api/pokemon/1');
    expect(getRes.body.name).to.equal('Ivysaur');
  });

  // Testa o endpoint DELETE /api/pokemon/:number
  it('deve excluir um Pokémon existente (DELETE /api/pokemon/:number)', async function () {
    // Para este teste, adiciona o Charmander para podermos testá-lo, sem afetar o Bulbasaur
    const novoPokemon = {
      number: 4,
      name: "Charmander",
      image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
      type: "Fogo",
      description: "Pokémon lagarto. Um pequeno dinossauro com uma chama na ponta da cauda."
    };
    await request.post('/api/pokemon').send(novoPokemon);

    // Deleta o Charmander (número 4)
    const res = await request.delete('/api/pokemon/4');
    expect(res.status).to.equal(200);
    expect(res.body.number).to.equal(4);

    // Verifica que apenas o Bulbasaur permanece
    const getRes = await request.get('/api/pokemon');
    expect(getRes.body).to.have.lengthOf(1);
    expect(getRes.body[0].name).to.equal('Bulbasaur');
  });

  // Teste de erro: tentativa de excluir um Pokémon inexistente
  it('deve retornar erro ao tentar excluir um Pokémon inexistente (DELETE /api/pokemon/:number)', async function () {
    const res = await request.delete('/api/pokemon/999');
    expect(res.status).to.equal(404);
    expect(res.body.error).to.equal('Pokémon not found');
  });
});