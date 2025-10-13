# 🚨 AÇÕES URGENTES PARA CORRIGIR O ERRO

## ❌ Erro Atual
```
GET /api/auth/session 500 (Internal Server Error)
[next-auth][error][CLIENT_FETCH_ERROR]
```

## ✅ SOLUÇÃO (3 passos rápidos)

### **PASSO 1: Gerar Secret do NextAuth**

#### Windows PowerShell:
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

#### Git Bash / Linux / Mac:
```bash
openssl rand -base64 32
```

**Copie o resultado** (será algo como: `xK2jF8mP9qL...`)

---

### **PASSO 2: Criar arquivo `.env.local`**

Crie um arquivo chamado `.env.local` **na raiz do projeto** com este conteúdo **MÍNIMO**:

```env
# OBRIGATÓRIO
NEXTAUTH_SECRET=COLE-O-SECRET-QUE-VOCE-GEROU-AQUI
NEXTAUTH_URL=http://localhost:3000

# OBRIGATÓRIO (ajuste para seu banco)
DATABASE_URL="postgresql://usuario:senha@localhost:5432/banco"

# Sua API Externa
NEXT_PUBLIC_API_URL=https://5acfae47b7cd.ngrok-free.app/api

# Para emails de reset de senha
SITE_URL=http://localhost:3000
```

**⚠️ IMPORTANTE:**
- Substitua `COLE-O-SECRET-QUE-VOCE-GEROU-AQUI` pelo secret gerado no Passo 1
- Ajuste `DATABASE_URL` com seus dados reais do banco

---

### **PASSO 3: Reiniciar o Servidor**

No terminal onde o Next.js está rodando:

1. **Pare** o servidor: `Ctrl+C`

2. **Reinicie** o servidor:
   ```bash
   npm run dev
   ```

3. **Teste**: Abra `http://localhost:3000`

---

## 📋 Checklist Rápido

- [ ] Secret gerado (mínimo 32 caracteres)
- [ ] Arquivo `.env.local` criado na raiz
- [ ] `NEXTAUTH_SECRET` preenchido
- [ ] `DATABASE_URL` configurado corretamente
- [ ] Servidor reiniciado
- [ ] Site abrindo sem erros

---

## ❓ Não Tem Banco de Dados Configurado?

Se você **não tem PostgreSQL ou MySQL** instalado:

### Opção 1: Usar SQLite (mais fácil)

1. Edite `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = "file:./dev.db"
   }
   ```

2. No `.env.local`:
   ```env
   DATABASE_URL="file:./prisma/dev.db"
   ```

3. Execute:
   ```bash
   npx prisma db push
   ```

### Opção 2: Desabilitar NextAuth temporariamente

Se você **não precisa de autenticação agora**, pode comentar o uso do NextAuth no layout ou pages.

---

## 🎯 Resultado Esperado

Após seguir os passos:
- ✅ Nenhum erro `500` no console
- ✅ Nenhum erro `[next-auth][error]`
- ✅ Site carregando normalmente
- ✅ Posts da API externa aparecendo

---

## 📞 Ainda com Problemas?

Veja o arquivo detalhado: **[CONFIGURACAO-ENV.md](./CONFIGURACAO-ENV.md)**

