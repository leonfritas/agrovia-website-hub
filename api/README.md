# API Agrovia

API Node.js para o site Agrovia com funcionalidades de autenticação, gerenciamento de usuários, categorias, posts e vídeos.

## 🚀 Funcionalidades

- **Autenticação JWT**: Sistema completo de login e gerenciamento de usuários
- **Gerenciamento de Usuários**: CRUD de usuários com diferentes roles (user/admin)
- **Gerenciamento de Categorias**: CRUD completo de categorias
- **Gerenciamento de Posts**: CRUD completo de posts com busca e filtros
- **Gerenciamento de Vídeos**: CRUD completo de vídeos com diferentes tipos de URL
- **Sistema de Contato**: Envio e gerenciamento de mensagens de contato
- **Newsletter**: Inscrição, cancelamento e envio de newsletters
- **Middleware de Segurança**: Rate limiting, CORS, Helmet
- **Validação de Dados**: Validação robusta
- **Banco de Dados**: SQL Server com driver nativo

## 📋 Pré-requisitos

- Node.js >= 18.0.0
- SQL Server >= 2019
- npm ou yarn

## 🛠️ Instalação

1. **Clone o repositório e navegue para a pasta da API:**
   ```bash
   cd api
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   ```bash
   cp env.example .env
   ```
   
   Edite o arquivo `.env` com suas configurações:
   ```env
   NODE_ENV=development
   PORT=3001
   DB_SERVER=localhost
   DB_PORT=1433
   DB_NAME=agrovia
   DB_USER=admin
   DB_PASSWORD=01042018
   JWT_SECRET=seu_jwt_secret_super_seguro_aqui
   FRONTEND_URL=http://localhost:3000
   ```

4. **Inicie o servidor:**
   ```bash
   # Desenvolvimento
   npm run dev
   
   # Produção
   npm start
   ```

## 📚 Documentação da API

### Base URL
```
http://localhost:3001/api
```

### Endpoints Principais

#### 🔐 Autenticação (`/api/auth`)

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/login` | Fazer login | Não |
| POST | `/logout` | Fazer logout | Sim |
| GET | `/me` | Obter perfil do usuário | Sim |
| PUT | `/me` | Atualizar perfil | Sim |
| POST | `/change-password/:id` | Alterar senha | Sim |

#### 👥 Usuários (`/api/users`)

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/` | Listar todos os usuários | Admin |
| GET | `/:id` | Obter usuário por ID | Sim |
| POST | `/` | Criar novo usuário | Admin |
| PUT | `/:id` | Atualizar usuário | Admin |
| DELETE | `/:id` | Deletar usuário | Admin |
| GET | `/stats/overview` | Estatísticas de usuários | Admin |
| GET | `/search` | Buscar usuários | Admin |
| POST | `/:id/toggle-admin` | Alternar status admin | Admin |

#### 📂 Categorias (`/api/categorias`)

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/` | Listar todas as categorias | Sim |
| GET | `/:id` | Obter categoria por ID | Sim |
| POST | `/` | Criar nova categoria | Admin |
| PUT | `/:id` | Atualizar categoria | Admin |
| DELETE | `/:id` | Deletar categoria | Admin |
| GET | `/with-posts` | Categorias com posts | Sim |
| GET | `/search` | Buscar categorias | Sim |

#### 📝 Posts (`/api/posts`)

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/` | Listar todos os posts | Sim |
| GET | `/:id` | Obter post por ID | Sim |
| POST | `/` | Criar novo post | Sim |
| PUT | `/:id` | Atualizar post | Sim |
| DELETE | `/:id` | Deletar post | Sim |
| GET | `/categoria/:idCategoria` | Posts por categoria | Sim |
| GET | `/usuario/:idUsuario` | Posts por usuário | Sim |
| GET | `/search` | Buscar posts | Sim |
| GET | `/recent` | Posts recentes | Sim |
| GET | `/stats` | Estatísticas de posts | Admin |

#### 🎥 Vídeos (`/api/videos`)

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/` | Listar todos os vídeos | Sim |
| GET | `/:id` | Obter vídeo por ID | Sim |
| POST | `/` | Criar novo vídeo | Sim |
| PUT | `/:id` | Atualizar vídeo | Sim |
| DELETE | `/:id` | Deletar vídeo | Sim |
| GET | `/categoria/:idCategoria` | Vídeos por categoria | Sim |
| GET | `/usuario/:idUsuario` | Vídeos por usuário | Sim |
| GET | `/search` | Buscar vídeos | Sim |
| GET | `/recent` | Vídeos recentes | Sim |
| GET | `/type/:type` | Vídeos por tipo de URL | Sim |
| GET | `/date-range` | Vídeos por período | Sim |
| GET | `/stats` | Estatísticas de vídeos | Admin |

#### 📧 Contato (`/api/contact`)

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/` | Enviar mensagem | Não |
| GET | `/` | Listar mensagens | Admin |
| GET | `/:id` | Obter mensagem por ID | Admin |
| PUT | `/:id/status` | Atualizar status | Admin |
| DELETE | `/:id` | Deletar mensagem | Admin |

#### 📰 Newsletter (`/api/newsletter`)

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/subscribe` | Inscrever no newsletter | Não |
| POST | `/unsubscribe` | Cancelar inscrição | Não |
| GET | `/subscribers` | Listar inscritos | Admin |
| GET | `/subscribers/:id` | Obter inscrito por ID | Admin |
| DELETE | `/subscribers/:id` | Deletar inscrito | Admin |
| POST | `/send` | Enviar newsletter | Admin |

### Exemplos de Uso

#### Fazer Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "nomeUsuario": "admin",
    "senhaUsuario": "01042018"
  }'
```

#### Criar Categoria
```bash
curl -X POST http://localhost:3001/api/categorias \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "nomeCategoria": "Tecnologia"
  }'
```

#### Criar Post
```bash
curl -X POST http://localhost:3001/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "nomePost": "Novo Post",
    "descricao": "Descrição do post",
    "idCategoria": 1,
    "idUsuario": 1,
    "imagemPost": "imagem.jpg",
    "linkExterno": "https://exemplo.com"
  }'
```

#### Criar Vídeo
```bash
curl -X POST http://localhost:3001/api/videos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "nopmeVideo": "Vídeo Tutorial",
    "descricao": "Descrição do vídeo",
    "idCategoria": 1,
    "idUsuario": 1,
    "urlArquivo": "video.mp4",
    "urlExterno": "https://youtube.com/watch?v=123"
  }'
```

#### Enviar Mensagem de Contato
```bash
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Santos",
    "email": "maria@email.com",
    "subject": "Dúvida sobre produtos",
    "message": "Gostaria de saber mais sobre os produtos da Agrovia."
  }'
```

#### Inscrever no Newsletter
```bash
curl -X POST http://localhost:3001/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@email.com",
    "name": "Usuário"
  }'
```

## 🔧 Estrutura do Projeto

```
api/
├── controllers/         # Controladores da API
│   ├── categoriaController.js
│   ├── postController.js
│   ├── usuarioController.js
│   ├── videoController.js
│   ├── contactController.js
│   └── newsletterController.js
├── middleware/          # Middlewares
│   ├── auth.js
│   └── admin.js
├── models/             # Modelos do banco de dados
│   ├── BaseModel.js
│   ├── Categoria.js
│   ├── Post.js
│   ├── Usuario.js
│   ├── Video.js
│   ├── ContactMessage.js
│   └── NewsletterSubscriber.js
├── routes/             # Rotas da API
│   ├── auth.js
│   ├── users.js
│   ├── categorias.js
│   ├── posts.js
│   ├── videos.js
│   ├── contact.js
│   └── newsletter.js
├── utils/              # Utilitários
│   ├── validation.js
│   └── database.js
├── server.js           # Arquivo principal
├── package.json        # Dependências e scripts
├── env.example         # Exemplo de variáveis de ambiente
└── README.md          # Documentação
```

## 🛡️ Segurança

- **JWT Authentication**: Tokens seguros para autenticação
- **Rate Limiting**: Proteção contra spam e ataques
- **CORS**: Configuração adequada para requisições cross-origin
- **Helmet**: Headers de segurança HTTP
- **Validação de Dados**: Sanitização e validação de entrada
- **Hash de Senhas**: Senhas criptografadas com bcrypt

## 🧪 Testes

```bash
# Executar testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com coverage
npm run test:coverage
```

## 📊 Monitoramento

### Health Check
```bash
curl http://localhost:3001/api/health
```

Resposta:
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "environment": "development"
}
```

## 🚀 Deploy

### Variáveis de Ambiente para Produção

```env
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/agrovia-api
JWT_SECRET=seu_jwt_secret_super_seguro_para_producao
FRONTEND_URL=https://agrovia.com
```

### Docker (Opcional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte, entre em contato através de:
- Email: suporte@agrovia.com
- Issues: [GitHub Issues](https://github.com/agrovia/website/issues)

## 🔄 Changelog

### v1.0.0
- Sistema de autenticação JWT
- CRUD de usuários
- Sistema de contato
- Newsletter
- Middleware de segurança
- Validação de dados
- Documentação completa
