# 🚀 Configuração Vercel + Ngrok

## 🎯 Problema Atual

Seu site está na **Vercel** (produção) tentando acessar sua API local via **ngrok**. Isso gera vários erros:

- ❌ `500` - NextAuth sem variáveis de ambiente
- ❌ `400` - URLs de imagens incorretas  
- ❌ `404` - Rotas não encontradas

---

## ✅ SOLUÇÃO COMPLETA

### **1️⃣ Configurar Variáveis na Vercel**

1. **Acesse**: [vercel.com/dashboard](https://vercel.com/dashboard)
2. **Selecione seu projeto**
3. **Vá para**: Settings → Environment Variables
4. **Adicione estas variáveis**:

```env
# OBRIGATÓRIAS
NEXTAUTH_SECRET=sua-chave-secreta-para-producao
NEXTAUTH_URL=https://seu-projeto.vercel.app
DATABASE_URL=sua-url-do-banco-em-producao
NEXT_PUBLIC_API_URL=https://93c44447ef94.ngrok-free.app/api
SITE_URL=https://seu-projeto.vercel.app

# OPCIONAIS (se usar)
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
EMAIL_SERVER_HOST=
EMAIL_SERVER_PORT=
EMAIL_SERVER_USER=
EMAIL_SERVER_PASSWORD=
EMAIL_FROM=
STRIPE_SECRET_KEY=
FACEBOOK_TOKEN=
FACEBOOK_PAGE_ID=
```

**⚠️ IMPORTANTE:**
- Substitua `seu-projeto.vercel.app` pela URL real do seu projeto
- Gere um novo `NEXTAUTH_SECRET` para produção
- Configure um banco de dados em produção (não use SQLite)

---

### **2️⃣ Configurar Banco de Dados em Produção**

#### Opção A: Vercel Postgres (Recomendado)

1. **Vercel Dashboard** → **Storage** → **Create Database** → **Postgres**
2. **Copie a connection string** gerada
3. **Cole em** `DATABASE_URL` nas Environment Variables

#### Opção B: Supabase (Gratuito)

1. **Crie conta em**: [supabase.com](https://supabase.com)
2. **Crie novo projeto**
3. **Settings** → **Database** → **Connection string**
4. **Copie e cole** em `DATABASE_URL`

#### Opção C: PlanetScale (MySQL)

1. **Crie conta em**: [planetscale.com](https://planetscale.com)
2. **Crie novo database**
3. **Copie connection string** e cole em `DATABASE_URL`

---

### **3️⃣ Configurar Ngrok para Produção**

Seu ngrok precisa permitir acesso de qualquer origem:

1. **No terminal onde ngrok está rodando**:
```bash
ngrok http 4000 --host-header=localhost:4000
```

2. **Configure CORS na sua API** (se possível):
```javascript
// Na sua API backend
app.use(cors({
  origin: [
    'https://seu-projeto.vercel.app',
    'https://*.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true
}));
```

---

### **4️⃣ Deploy na Vercel**

1. **Após configurar as variáveis**:
   - **Redeploy** o projeto na Vercel
   - Ou faça um **push** para o GitHub (se conectado)

2. **Verifique o deploy**:
   - Acesse a URL do seu projeto na Vercel
   - Verifique se não há mais erros 500/400

---

## 🔧 Correções Aplicadas no Código

### ✅ **URLs de Imagens Corrigidas**

Criado `src/utils/imageUrl.ts` com funções para:
- Construir URLs de imagens corretamente
- Validar URLs antes de usar
- Fallback automático para imagens locais

### ✅ **Componentes Atualizados**

- `AgroviaAtual/index.tsx` ✅
- `AgroviaEnsina/index.tsx` ✅  
- `AgroviaLegal/index.tsx` ✅

---

## 🚨 Problemas Comuns e Soluções

### **Erro: "NEXTAUTH_SECRET missing"**

**Solução:**
```env
NEXTAUTH_SECRET=qualquer-string-de-pelo-menos-32-caracteres
```

### **Erro: "Invalid database URL"**

**Solução:**
1. Verifique se o banco está rodando
2. Confirme a string de conexão
3. Execute migrations: `npx prisma db push`

### **Erro: "Images 400"**

**Solução:**
✅ **Já corrigido** com o novo sistema de URLs!

### **Erro: "CORS"**

**Solução:**
Configure CORS na sua API para aceitar:
```
https://seu-projeto.vercel.app
```

---

## 📋 Checklist Final

- [ ] Variáveis de ambiente configuradas na Vercel
- [ ] Banco de dados em produção configurado
- [ ] NEXTAUTH_SECRET gerado e configurado
- [ ] NEXTAUTH_URL apontando para Vercel
- [ ] NEXT_PUBLIC_API_URL apontando para ngrok
- [ ] Projeto redeployado na Vercel
- [ ] Ngrok rodando e acessível
- [ ] Teste de acesso: site da Vercel funcionando

---

## 🎯 Resultado Esperado

Após seguir todos os passos:
- ✅ Site da Vercel carregando sem erros 500
- ✅ Imagens carregando corretamente (sem 400)
- ✅ Posts da API externa aparecendo
- ✅ NextAuth funcionando
- ✅ Sem erros no console

---

## 💡 Alternativa: Deploy da API

Para produção, considere:
1. **Deploy da API na Vercel** (serverless functions)
2. **Deploy na Railway/Render** (persistente)
3. **Deploy na DigitalOcean/AWS** (VPS)

Isso elimina a dependência do ngrok e melhora a performance.

---

## 📞 Ainda com Problemas?

1. **Verifique os logs da Vercel**: Vercel Dashboard → Functions → Logs
2. **Teste localmente** com as mesmas variáveis
3. **Verifique se ngrok está acessível** de fora
4. **Confirme se o banco está acessível** publicamente
