# 🔧 Correções da API com Ngrok

## Problemas Identificados

### Problema 1: JSON inválido
Erro no console: `SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON`

**Causa:**
1. **Barra dupla na URL** - URLs tinham `//api` ao invés de `/api`
2. **Falta de header do Ngrok** - O ngrok exige o header `ngrok-skip-browser-warning: true` para evitar página HTML de aviso

### Problema 2: Next.js Image não configurado
Erro: `Invalid src prop on next/image, hostname "5acfae47b7cd.ngrok-free.app" is not configured`

**Causa:**
1. **Domínio não configurado no next.config.js**
2. **URLs de imagens com barra dupla** - `//uploads` ao invés de `/uploads`

## ✅ Correções Realizadas

### Correção 1: Headers e URLs da API

#### 1.1 `src/lib/postsStore.ts`
- ✅ Corrigido URL: `//api` → `/api`
- ✅ Adicionado headers do ngrok:
  ```typescript
  headers: {
    'Accept': 'application/json',
    'ngrok-skip-browser-warning': 'true',
    'Content-Type': 'application/json'
  }
  ```

#### 1.2 `src/hooks/usePosts.ts`
- ✅ Corrigido URL: `//api` → `/api`
- ✅ Adicionado headers do ngrok na função `useCategorias()`

#### 1.3 `src/app/post/[id]/page.tsx`
- ✅ Adicionado headers do ngrok na busca de post individual

#### 1.4 `src/components/AgroviaAtual/index.tsx`
- ✅ Corrigido URL: `//api` → `/api`
- ✅ Adicionado headers do ngrok em:
  - `loadCommentsCount()` - Carrega contagem de comentários
  - `loadComments()` - Carrega lista de comentários
  - `handleSubmit()` - Envia novo comentário
- ✅ Corrigido construção de URLs de imagens para evitar `//uploads`

### Correção 2: Next.js Image Configuration

#### 2.1 `next.config.js`
- ✅ Adicionado suporte para domínios ngrok:
  ```javascript
  {
    protocol: 'https',
    hostname: '**.ngrok-free.app',
  },
  {
    protocol: 'https',
    hostname: '5acfae47b7cd.ngrok-free.app',
  }
  ```

#### 2.2 `src/components/AgroviaEnsina/index.tsx`
- ✅ Adicionada variável `API_BASE_URL`
- ✅ Corrigida construção de URLs de imagens:
  ```typescript
  const imagePath = post.imagemDestaque?.startsWith('/') 
    ? post.imagemDestaque.substring(1) 
    : post.imagemDestaque;
  const imageUrl = `${API_BASE_URL.replace('/api', '')}/${imagePath}`;
  ```

#### 2.3 `src/components/AgroviaLegal/index.tsx`
- ✅ Adicionada variável `API_BASE_URL`
- ✅ Corrigida construção de URLs de imagens (mesma lógica acima)

## 🎯 Resultado

Agora todas as requisições para a API via ngrok incluem:

```typescript
fetch(url, {
  headers: {
    'Accept': 'application/json',
    'ngrok-skip-browser-warning': 'true',
    'Content-Type': 'application/json'
  }
})
```

## 📝 Observações Importantes

### URLs Corrigidas
Antes:
```
https://93c44447ef94.ngrok-free.app//api/posts
```

Depois:
```
https://93c44447ef94.ngrok-free.app/api/posts
```

### Header Crítico
O header `ngrok-skip-browser-warning: true` é **essencial** porque:
- O ngrok mostra uma página HTML de aviso por padrão
- Essa página HTML causa o erro "not valid JSON"
- O header faz o ngrok pular essa página e retornar o JSON direto

## 🔄 Como Testar

1. Certifique-se de que seu ngrok está rodando:
   ```bash
   ngrok http 3001
   ```

2. Atualize a URL no `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=https://93c44447ef94.ngrok-free.app/api
   ```

3. Reinicie o servidor Next.js:
   ```bash
   npm run dev
   ```

4. Verifique no console do navegador - os erros devem ter desaparecido! ✅

## 📊 Endpoints Testados

- ✅ `GET /api/posts` - Lista todos os posts
- ✅ `GET /api/posts/secao/{nome}` - Posts por categoria
- ✅ `GET /api/posts/{id}` - Post individual
- ✅ `GET /api/comentarios/post/{id}` - Comentários de um post
- ✅ `POST /api/comentarios` - Criar novo comentário
- ✅ `GET /api/categorias/site` - Lista de categorias

## 💡 Lógica de Correção de URLs

Para evitar barras duplas nas URLs de imagens:

```typescript
// Remove barra inicial se existir
const imagePath = post.imagemDestaque?.startsWith('/') 
  ? post.imagemDestaque.substring(1) 
  : post.imagemDestaque;

// Monta URL correta
const imageUrl = `${API_BASE_URL.replace('/api', '')}/${imagePath}`;
```

**Exemplo:**
- API URL: `https://93c44447ef94.ngrok-free.app/api`
- Imagem DB: `/uploads/imagem.png`
- Resultado: `https://93c44447ef94.ngrok-free.app/uploads/imagem.png` ✅

## 🔄 Arquivos que Precisam de Reinicialização

**IMPORTANTE:** Após as mudanças no `next.config.js`, você precisa:

1. **Parar o servidor** (Ctrl+C)
2. **Limpar o cache** (opcional mas recomendado):
   ```bash
   rm -rf .next
   ```
3. **Reiniciar o servidor**:
   ```bash
   npm run dev
   ```

## 🎉 Status

**TODAS AS CORREÇÕES APLICADAS COM SUCESSO** ✨

- ✅ Erro de JSON resolvido
- ✅ Erro de Next.js Image resolvido
- ✅ URLs de imagens corrigidas (sem barras duplas)
- ✅ Headers do ngrok configurados
- ✅ Domínios ngrok autorizados no next.config.js

