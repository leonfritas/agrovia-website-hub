# 🔧 Configuração de Variáveis de Ambiente - AgroVia

## 📁 Arquivos de Configuração

### Backend (API)
- **Arquivo**: `api/.env`
- **Propósito**: Configurações do servidor Node.js e banco de dados

### Frontend (Next.js)
- **Arquivo**: `painelAdmin/painel-admin/.env.local`
- **Propósito**: Configurações do cliente Next.js

## 🚀 Como Usar

### 1. Backend (API)
```bash
cd api
npm start
```
O servidor carregará automaticamente as variáveis do arquivo `.env`

### 2. Frontend (Next.js)
```bash
cd painelAdmin/painel-admin
npm run dev
```
O Next.js carregará automaticamente as variáveis do arquivo `.env.local`

## ⚙️ Variáveis Principais

### 🔐 Banco de Dados
```env
DB_SERVER=localhost
DB_PORT=1433
DB_NAME=agrovia
DB_USER=admin
DB_PASSWORD=01042018
```

### 🔑 Autenticação JWT
```env
JWT_SECRET=agrovia_jwt_secret_super_seguro_2025_admin_01042018
JWT_EXPIRES_IN=24h
```

### 🌐 Servidor
```env
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### 📧 Email (Opcional)
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_app
```

## 🔒 Segurança

### ⚠️ IMPORTANTE
- **NUNCA** commite os arquivos `.env` ou `.env.local` no Git
- Estes arquivos contêm informações sensíveis
- Use o arquivo `env.example` como referência

### 🛡️ Boas Práticas
1. **JWT_SECRET**: Use uma string longa e aleatória
2. **Senhas**: Use senhas fortes e únicas
3. **Produção**: Use variáveis de ambiente do servidor
4. **Backup**: Mantenha cópias seguras das configurações

## 🔄 Atualizando Configurações

### Para mudar credenciais do banco:
1. Edite `api/.env`
2. Reinicie o servidor: `npm start`

### Para mudar URL da API:
1. Edite `painelAdmin/painel-admin/.env.local`
2. Reinicie o Next.js: `npm run dev`

## 📋 Checklist de Configuração

- [ ] Arquivo `api/.env` criado
- [ ] Arquivo `painelAdmin/painel-admin/.env.local` criado
- [ ] Credenciais do banco configuradas
- [ ] JWT_SECRET definido
- [ ] URLs de frontend/backend configuradas
- [ ] Servidor reiniciado após mudanças

## 🆘 Solução de Problemas

### Erro: "Cannot find module 'dotenv'"
```bash
cd api
npm install dotenv
```

### Erro: "Database connection failed"
- Verifique as credenciais em `api/.env`
- Confirme se o SQL Server está rodando
- Teste a conexão: `npm run test-connection`

### Erro: "API not found" no frontend
- Verifique `NEXT_PUBLIC_API_URL` em `.env.local`
- Confirme se a API está rodando na porta 3001

## 📞 Suporte

Para dúvidas sobre configuração, consulte:
- `api/env.example` - Exemplo completo de variáveis
- `api/README.md` - Documentação da API
- Logs do servidor para erros específicos
