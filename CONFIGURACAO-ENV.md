# 🔐 Configuração de Variáveis de Ambiente

## ⚠️ Erro Atual

Se você está vendo este erro:
```
GET /api/auth/session 500 (Internal Server Error)
[next-auth][error][CLIENT_FETCH_ERROR]
```

Significa que as **variáveis de ambiente do NextAuth não estão configuradas**.

---

## 📝 Criar Arquivo `.env.local`

Crie um arquivo chamado `.env.local` na **raiz do projeto** com o seguinte conteúdo:

```env
# ============================================
# NEXTAUTH (OBRIGATÓRIO)
# ============================================
# Gere um secret com: openssl rand -base64 32
NEXTAUTH_SECRET=sua-chave-secreta-aqui-min-32-caracteres
NEXTAUTH_URL=http://localhost:3000

# ============================================
# DATABASE (OBRIGATÓRIO SE USAR PRISMA)
# ============================================
# Exemplo PostgreSQL
DATABASE_URL="postgresql://usuario:senha@localhost:5432/agrovia_db"
# Exemplo MySQL
# DATABASE_URL="mysql://usuario:senha@localhost:3306/agrovia_db"

# ============================================
# API EXTERNA (Sua API com Ngrok)
# ============================================
NEXT_PUBLIC_API_URL=https://93c44447ef94.ngrok-free.app/api

# ============================================
# SITE URL (para emails de reset)
# ============================================
SITE_URL=http://localhost:3000

# ============================================
# GITHUB OAUTH (Opcional)
# ============================================
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# ============================================
# GOOGLE OAUTH (Opcional)
# ============================================
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# ============================================
# EMAIL SERVER (para magic links)
# ============================================
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=seu-email@gmail.com
EMAIL_SERVER_PASSWORD=sua-senha-app
EMAIL_FROM=noreply@agrovia.com

# ============================================
# STRIPE (para pagamentos)
# ============================================
STRIPE_SECRET_KEY=sk_test_...

# ============================================
# FACEBOOK API (para posts do Facebook)
# ============================================
FACEBOOK_TOKEN=
FACEBOOK_PAGE_ID=
```

---

## 🔑 Como Gerar o NEXTAUTH_SECRET

### No Linux/Mac/Git Bash:
```bash
openssl rand -base64 32
```

### No Windows PowerShell:
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### Online (alternativa):
Acesse: https://generate-secret.vercel.app/32

**Copie o resultado e cole no `.env.local`**

---

## 📊 Variáveis Obrigatórias vs Opcionais

### ✅ **OBRIGATÓRIAS** (para o site funcionar):

```env
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL=...
NEXT_PUBLIC_API_URL=...
```

### 🔹 **OPCIONAIS** (recursos específicos):

- **GitHub/Google OAuth**: Apenas se quiser login social
- **Email Provider**: Apenas se quiser magic links
- **Stripe**: Apenas se tiver pagamentos
- **Facebook API**: Apenas se quiser integração com Facebook

---

## 🚨 Checklist de Configuração

- [ ] Arquivo `.env.local` criado na raiz do projeto
- [ ] `NEXTAUTH_SECRET` gerado e preenchido (mínimo 32 caracteres)
- [ ] `NEXTAUTH_URL` configurado para `http://localhost:3000`
- [ ] `DATABASE_URL` configurado com sua string de conexão do banco
- [ ] `NEXT_PUBLIC_API_URL` configurado com sua URL do ngrok
- [ ] Servidor reiniciado após criar o `.env.local`

---

## 🔄 Após Configurar

1. **Reinicie o servidor**:
   ```bash
   # Pare o servidor (Ctrl+C)
   npm run dev
   ```

2. **Verifique se está carregando**:
   - Abra o terminal onde o Next.js está rodando
   - Você NÃO deve ver mais erros do NextAuth
   - Acesse: `http://localhost:3000`

---

## 🐛 Ainda com Problemas?

### Erro: "Invalid database URL"
- Verifique se o banco de dados está rodando
- Confirme a string de conexão no `DATABASE_URL`
- Execute: `npx prisma db push`

### Erro: "NEXTAUTH_SECRET missing"
- Certifique-se de que tem pelo menos 32 caracteres
- Não use espaços ou caracteres especiais problemáticos
- Reinicie o servidor após adicionar

### Erro: "Can't connect to database"
- Verifique se PostgreSQL/MySQL está rodando
- Teste a conexão com uma ferramenta GUI (pgAdmin, DBeaver, etc.)
- Verifique firewall e portas

---

## 📍 Estrutura Final

```
agrovia-website/
├── .env.local          ← CRIAR ESTE ARQUIVO AQUI
├── .gitignore          (já deve incluir .env.local)
├── next.config.js
├── package.json
├── prisma/
│   └── schema.prisma
└── src/
    └── ...
```

---

## ⚠️ SEGURANÇA

- ❌ **NUNCA** commit o arquivo `.env.local` no git
- ✅ Certifique-se de que `.env.local` está no `.gitignore`
- ✅ Use secrets diferentes para desenvolvimento e produção
- ✅ Rotacione secrets periodicamente

---

## 📚 Links Úteis

- [NextAuth.js Docs](https://next-auth.js.org/configuration/options)
- [Prisma Connection URLs](https://www.prisma.io/docs/reference/database-reference/connection-urls)
- [Environment Variables - Next.js](https://nextjs.org/docs/basic-features/environment-variables)

