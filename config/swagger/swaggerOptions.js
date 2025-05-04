const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pokédex API',
      version: '1.0.0',
      description: 'Documentação da API da Pokédex'
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor de desenvolvimento'
      }
    ]
  },
  apis: ['../../src/routes/*.js', '../../src/models/*.js']
};

export default swaggerOptions;