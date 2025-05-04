const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pokédex API',
      version: '1.0.0',
      description: `
        Pokédex API

        Esta API permite gerenciar um repositório de Pokémon com endpoints para listagem,
        consulta, criação, atualização e deleção.

        Base URL: /api
      `,
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor de desenvolvimento',
      },
    ],
    components: {
      schemas: {
        Pokemon: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            number: { type: 'number', example: 1 },
            name: { type: 'string', example: 'Bulbasaur' },
            type: { type: 'string', example: 'Grass' },
            subtype: { type: 'string', nullable: true, example: 'Poison' },
            atk: { type: 'number', example: 49 },
            def: { type: 'number', example: 49 },
            hp: { type: 'number', example: 45 },
            description: { type: 'string', example: 'O Pokémon Semente. Pode ser visto tirando uma soneca ao sol.' },
            weakness: {
              type: 'array',
              items: { type: 'string' },
              example: ['Fire', 'Flying', 'Psychic', 'Ice'],
            },
            location: { type: 'string', example: 'Kanto' },
            img: { type: 'string', example: 'https://img.pokemondb.net/sprites/go/normal/bulbasaur.png' },
            evolutionChain: { type: 'string', example: 'Bulbasaur -> Ivysaur -> Venusaur' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js', './src/models/*.js']
};

export default swaggerOptions;