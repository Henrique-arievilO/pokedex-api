# Pokédex API

A API que vai te ajudar a catalogar seus Pokémon de forma profissional, fazendo jus à paixão e aventura do universo Pokémon. Desenvolvida com Node.js, Express e MongoDB Atlas, a Pokédex API oferece endpoints completos para listar, consultar, criar, atualizar e deletar registros de Pokémon. **Gotta catch 'em all!**

## Índice
- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Instalação](#instalação)
- [Uso](#uso)
- [Endpoints](#endpoints)
- [Documentação Swagger](#documenta%C3%A7%C3%A3o-swagger)
- [Contribuição](#contribui%C3%A7%C3%A3o)

## Visão Geral
A **Pokédex API** é uma aplicação RESTful que atua como um repositório digital de Pokémon. Com um design leve e modular, a API permite que você mantenha e manipule registros de Pokémon de forma eficiente e elegante. Os dados são persistidos no MongoDB Atlas, enquanto a documentação interativa é oferecida via Swagger, com um toque visual que remete ao universo Pokémon.

## Funcionalidades
- **CRUD Completo**: Endpoints para criar, ler, atualizar e deletar registros de Pokémon.
- **Persistência Robusta**: Os dados são armazenados de forma segura usando MongoDB Atlas.
- **Documentação Interativa**: Explore e teste cada endpoint com o Swagger UI customizado.
- **Fácil Integração**: Estrutura pensada para expandir e adaptar-se às suas necessidades.

## Instalação
1. Clone o repositório:
    ```bash
    git clone <URL-do-repositório>
    ```
2. Acesse o diretório do projeto:
    ```bash
    cd pokedex-api
    ```
3. Instale as dependências:
    ```bash
    npm install
    ```
4. Configure as variáveis de ambiente:
    - Crie um arquivo `.env` na raiz do projeto.
    - Ajuste as variáveis necessárias, incluindo a string de conexão com o MongoDB Atlas e a porta do servidor.
5. Inicie o servidor:
    ```bash
    npm start
    ```

## Uso
Após iniciar o servidor, a API ficará acessível em `http://localhost:3000`.

Utilize ferramentas como Thunder Client ou Postman para interagir com os endpoints descritos na seção abaixo.

## Endpoints
- **GET /api/pokemon**: Lista todos os Pokémon.
- **GET /api/pokemon/{id}**: Retorna os dados de um Pokémon específico a partir do seu ID.
- **POST /api/pokemon**: Cria um novo registro com os dados de um Pokémon.
- **PUT /api/pokemon/{id}**: Atualiza os dados de um Pokémon existente.
- **DELETE /api/pokemon/{id}**: Remove o registro de um Pokémon.

## Documentação Swagger
A documentação interativa, com um tema especialmente customizado para remeter ao universo Pokémon, está disponível em:  
[http://localhost:3000/docs](http://localhost:3000/docs)

## Contribuição
Contribuições são bem-vindas!  
Se você deseja propor melhorias ou novos recursos, sinta-se à vontade para abrir uma issue ou enviar um pull request. Para mudanças significativas, sugerimos abrir uma issue para discutirmos as ideias antes de implementá-las.

---

Que sua jornada pela programação seja tão emocionante quanto uma aventura Pokémon. Capture, evolua e conquiste cada linha de código!