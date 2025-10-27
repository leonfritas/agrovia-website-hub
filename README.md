# 🌾 Agrovia Website

Website institucional da Agrovia construído com Next.js, React, TypeScript e TailwindCSS.

## 🚀 Tecnologias

- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **TailwindCSS**
- **Prisma** (ORM)
- **NextAuth** (Autenticação)
- **Stripe** (Pagamentos)

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Banco de dados compatível com Prisma

## ⚙️ Configuração

<<<<<<< HEAD
### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# URL da API Externa
# IMPORTANTE: Ao usar ngrok, certifique-se de usar apenas UMA barra antes de /api
NEXT_PUBLIC_API_URL=https://93c44447ef94.ngrok-free.app/api

# Database URL (Prisma)
DATABASE_URL=

# NextAuth
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

# Site URL (para emails de reset de senha)
SITE_URL=http://localhost:3000

# Stripe (para pagamentos)
STRIPE_SECRET_KEY=

# Facebook API (para integração de posts)
FACEBOOK_TOKEN=
FACEBOOK_PAGE_ID=
```

### 3. Executar em desenvolvimento

```bash
npm run dev
```

O site estará disponível em `http://localhost:3000`

## 🔧 Integração com API Externa via Ngrok

### ⚠️ Configuração Importante

Quando usar ngrok para expor sua API externa, siga estas orientações:

1. **URL correta**: Use apenas UMA barra antes de `/api`
   - ✅ Correto: `https://abc123.ngrok-free.app/api`
   - ❌ Errado: `https://abc123.ngrok-free.app//api`

2. **Headers necessários**: O código já está configurado com os headers necessários:
   - `ngrok-skip-browser-warning: true` - Evita página de aviso do ngrok
   - `Accept: application/json` - Garante resposta em JSON
   - `Content-Type: application/json` - Define tipo do conteúdo

3. **Arquivos configurados**:
   - `src/lib/postsStore.ts` - Gerenciamento de posts com cache
   - `src/hooks/usePosts.ts` - Hook para buscar posts e categorias
   - `src/app/post/[id]/page.tsx` - Página individual de post
   - `src/components/AgroviaAtual/index.tsx` - Seção Agrovia Atual com comentários
=======
O site está disponível em `https://agrovia-website-hub.vercel.app/`
>>>>>>> d5b04fc891083ee29ce7db2c7c4900a2117928ae

## 📁 Estrutura do Projeto

```
agrovia-website/
├── src/
│   ├── app/              # App Router (Next.js 14)
│   │   ├── (site)/       # Rotas públicas
│   │   ├── api/          # API Routes
│   │   └── post/         # Páginas de posts
│   ├── components/       # Componentes React
│   │   ├── AgroviaAtual/
│   │   ├── AgroviaEnsina/
│   │   ├── AgroviaInspira/
│   │   ├── AgroviaLegal/
│   │   └── ...
│   ├── hooks/            # Custom Hooks
│   ├── lib/              # Bibliotecas e utilitários
│   ├── styles/           # Estilos globais
│   └── types/            # TypeScript types
├── public/               # Arquivos estáticos
│   ├── images/
│   └── videos/
└── prisma/              # Schema do banco de dados
```

### Cache de Posts

O sistema possui um cache inteligente de 60 segundos para reduzir requisições:

```typescript
// Limpar cache manualmente se necessário
import { postsStore } from '@/lib/postsStore';
postsStore.clearCache(); // Limpa todo o cache
postsStore.clearCache('Agrovia Ensina'); // Limpa cache específico
```

## 📝 Scripts Disponíveis

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Inicia servidor de produção
npm run lint         # Executa linter
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

