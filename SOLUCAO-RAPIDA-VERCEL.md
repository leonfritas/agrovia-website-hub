# 🚨 SOLUÇÃO RÁPIDA - Erro 500 NextAuth na Vercel

## ❌ Problema Atual

```
GET /api/auth/session 500 (Internal Server Error)
[next-auth][error][CLIENT_FETCH_ERROR]
```

**Causa**: Variáveis de ambiente não configuradas ou incorretas na Vercel.

---

## ✅ SOLUÇÃO IMEDIATA (5 minutos)

### **PASSO 1: Acessar Dashboard da Vercel**

1. **Abra**: [vercel.com/dashboard](https://vercel.com/dashboard)
2. **Clique no seu projeto**: `agrovia-website-hub`
3. **Vá para**: Settings → Environment Variables

### **PASSO 2: Adicionar Variáveis (COPIE E COLE)**

Clique em **"Add New"** e adicione **UMA POR VEZ**:

#### **Variável 1:**
```
Name: NEXTAUTH_SECRET
Value: agrovia-secret-key-2025-vercel-production-32chars
Environment: Production, Preview, Development
```

#### **Variável 2:**
```
Name: NEXTAUTH_URL
Value: https://agrovia-website-hub.vercel.app
Environment: Production, Preview, Development
```

#### **Variável 3:**
```
Name: DATABASE_URL
Value: file:./prisma/dev.db
Environment: Production, Preview, Development
```

#### **Variável 4:**
```
Name: NEXT_PUBLIC_API_URL
Value: https://5acfae47b7cd.ngrok-free.app/api
Environment: Production, Preview, Development
```

#### **Variável 5:**
```
Name: SITE_URL
Value: https://agrovia-website-hub.vercel.app
Environment: Production, Preview, Development
```

### **PASSO 3: Redeploy**

1. **Volte para**: Deployments
2. **Clique nos 3 pontos** do último deploy
3. **Selecione**: "Redeploy"

### **PASSO 4: Aguardar e Testar**

- Aguarde o deploy terminar (2-3 minutos)
- Acesse: https://agrovia-website-hub.vercel.app
- Verifique se o erro 500 sumiu

---

## 🔧 SOLUÇÃO ALTERNATIVA (Se ainda der erro)

### **Desabilitar NextAuth Temporariamente**

Se você **não precisa de autenticação agora**, pode desabilitar temporariamente:

1. **Edite**: `src/app/layout.tsx`
2. **Comente** a linha do SessionProvider:

```tsx
// import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        {/* <SessionProvider> */}
          {children}
        {/* </SessionProvider> */}
      </body>
    </html>
  );
}
```

3. **Faça commit e push**:
```bash
git add .
git commit -m "temp: disable nextauth"
git push
```

---

## 🎯 CONFIGURAÇÃO MÍNIMA PARA FUNCIONAR

### **Variáveis Obrigatórias (mínimo):**

```env
NEXTAUTH_SECRET=qualquer-string-de-32-caracteres-minimo
NEXTAUTH_URL=https://agrovia-website-hub.vercel.app
DATABASE_URL=file:./prisma/dev.db
```

### **Variáveis Opcionais:**

```env
NEXT_PUBLIC_API_URL=https://5acfae47b7cd.ngrok-free.app/api
SITE_URL=https://agrovia-website-hub.vercel.app
```

---

## 🚨 SE AINDA NÃO FUNCIONAR

### **Verificar Logs da Vercel:**

1. **Vercel Dashboard** → **Functions** → **View Function Logs**
2. **Procure por erros** específicos
3. **Copie o erro** e me envie

### **Verificar se as variáveis foram aplicadas:**

1. **Deployments** → **Último deploy** → **View Build Logs**
2. **Procure por**: "Environment Variables loaded"
3. **Confirme** se suas variáveis aparecem

---

## 📋 CHECKLIST RÁPIDO

- [ ] Acessei vercel.com/dashboard
- [ ] Selecionei o projeto agrovia-website-hub
- [ ] Fui para Settings → Environment Variables
- [ ] Adicionei NEXTAUTH_SECRET
- [ ] Adicionei NEXTAUTH_URL com URL correta
- [ ] Adicionei DATABASE_URL
- [ ] Adicionei NEXT_PUBLIC_API_URL
- [ ] Adicionei SITE_URL
- [ ] Fiz redeploy
- [ ] Aguardei o deploy terminar
- [ ] Testei o site
- [ ] Erro 500 sumiu

---

## 💡 DICA IMPORTANTE

**O problema é 99% das vezes**: Variáveis de ambiente não configuradas ou com valores errados na Vercel.

**A solução é sempre**: Configurar corretamente + Redeploy.

---

## 🆘 URGENTE: Se nada funcionar

**Desabilite NextAuth temporariamente** editando o layout e fazendo push. Isso vai fazer o site funcionar imediatamente, e você pode configurar a autenticação depois.

**O importante é o site funcionar primeiro!** 🚀
