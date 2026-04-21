# Sistema de Adoção de Pets - Backend

API desenvolvida em Node.js com MongoDB para gerenciamento de usuários, pets e solicitações de adoção.

---

## Tecnologias utilizadas

- Node.js
- Express
- MongoDB (Mongoose)
- JWT (JSON Web Token)
- Bcrypt

---

## Como rodar o projeto

### 1. Clonar o repositório ou extrair o ZIP

CMD

cd backend

# Instalar dependencias

npm install

# Criar arquivo .env

PORT=3000
MONGO_URI=sua_string_do_mongodb
JWT_SECRET=sua_chave_secreta

# Inicie o servidor

node server.js

# Servidor disponivel em

http://localhost:3000

# Autenticacao

Authorization: Bearer SEU_TOKEN

### Endpoints

# Usuarios

# Cadastro

POST /api/users

{
"name": "Luis",
"email": "luis@email.com",
"password": "123456"
}

# Login

POST /api/login

Resposta:
{
"token": "JWT_TOKEN"
}

# Pets

# Listar todos

GET /api/pets

# Criar pet(logado)

{
"name": "Rex",
"age": 3,
"species": "Cachorro",
"breed": "Vira-lata",
"description": "Muito amigável"
}

# Meus pets

GET /api/my-pets

# Buscar por ID

GET /api/pets/:id

# Atualizar

PUT /api/pets/:id

# Deletar

DELETE /api/pets/:id

### SOLICTACOES DE ADOCAO

# Criar solicitacao

POST /api/adoption-requests

{
"petId": "ID_DO_PET",
"message": "Tenho interesse em adotar"
}

# Minhas solicitacoes

GET /api/my-requests

# Solicitacoes recebidas

GET /api/received-requests

# Aprovar ou Rejeitar solicitacoes

PUT /api/adoption-requests/:id/approve

PUT /api/adoption-requests/:id/reject
