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

O site está disponível em `https://agrovia-website-hub.vercel.app/`

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

