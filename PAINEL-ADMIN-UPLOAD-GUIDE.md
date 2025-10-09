# Guia de Upload de Imagens - Painel Admin

## 📸 Como Adicionar um Post com Imagens

### 1. Acesse o Painel Admin
- URL: `http://localhost:3002`
- Faça login com suas credenciais de administrador

### 2. Navegue até Posts
- No menu lateral, clique em **"Posts"**

### 3. Criar Novo Post
- Clique no botão **"Novo Post"** (canto superior direito)

### 4. Preencha os Campos

#### Campos de Texto:
- **Título do Post**: Nome que aparece no card e na página
- **Descrição**: Resumo breve (aparece no card)
- **Conteúdo Completo**: Texto completo do artigo (opcional)
- **Categoria**: Selecione a seção (Agrovia Ensina, Legal, etc.)
- **Autor**: Selecione o autor do post
- **Link Externo**: URL relacionada (opcional)

#### Campos de Imagem:

**🖼️ Imagem do Card**
- Aparece no card da seção
- Clique em "Escolher arquivo"
- Selecione uma imagem do seu computador
- Preview aparece automaticamente

**🖼️ Imagem de Destaque**
- Aparece no topo do artigo completo
- Clique em "Escolher arquivo"
- Selecione uma imagem do seu computador
- Preview aparece automaticamente

**🖼️ Imagem do Conteúdo**
- Aparece no meio do artigo
- Clique em "Escolher arquivo"
- Selecione uma imagem do seu computador
- Preview aparece automaticamente

### 5. Salvar
- Clique em **"Criar"** ou **"Atualizar"**
- As imagens serão:
  - ✅ Enviadas para o servidor
  - ✅ Salvas em `api/uploads/`
  - ✅ Caminhos salvos no banco de dados
  - ✅ Exibidas automaticamente no site

## 🎯 Onde as Imagens Aparecem

### No Site:
1. **Imagem do Card**: Aparece no card da seção
2. **Imagem de Destaque**: Topo da página do post
3. **Imagem do Conteúdo**: Meio do artigo

### Exemplo Visual:

```
┌─────────────────────────────────┐
│  [Imagem do Card]               │  ← imagemPost
│  Título do Post                 │
│  Descrição breve...             │
└─────────────────────────────────┘
      ↓ (clique)
┌─────────────────────────────────┐
│  [Voltar]                       │
│                                 │
│  [Imagem de Destaque]           │  ← imagemDestaque
│                                 │
│  # Título do Post               │
│                                 │
│  Descrição completa...          │
│                                 │
│  Conteúdo do artigo...          │
│                                 │
│  [Imagem do Conteúdo]           │  ← imagemConteudo
│                                 │
│  Mais conteúdo...               │
└─────────────────────────────────┘
```

## 📋 Filtrar Posts por Categoria

No topo da página de posts, há um filtro:
- **"Todas as categorias"**: Mostra todos os posts
- **Selecione uma categoria**: Mostra apenas posts daquela seção

Útil para gerenciar posts de seções específicas!

## 🔧 Especificações Técnicas

### Formatos Aceitos:
- JPEG / JPG
- PNG
- GIF
- WebP

### Tamanho Máximo:
- 5MB por imagem

### Armazenamento:
- Pasta: `api/uploads/`
- Nomes únicos gerados automaticamente
- Banco: Salva apenas o caminho (ex: `/uploads/imagem-123456.jpg`)

## ⚠️ Importante

1. **Todas as imagens são opcionais** - você pode criar um post sem imagens
2. **Preview instantâneo** - veja a imagem antes de salvar
3. **Substituir imagens** - ao editar, selecione nova imagem para substituir
4. **Imagens antigas** - não são deletadas automaticamente (economiza espaço)

## 🎨 Dicas de Uso

### Para melhor resultado:
- **Imagem do Card**: Use proporção 4:3 ou 16:9
- **Imagem de Destaque**: Use imagens largas (landscape)
- **Imagem do Conteúdo**: Qualquer proporção

### Recomendações:
- Otimize imagens antes do upload (reduza tamanho)
- Use nomes descritivos nos arquivos
- Mantenha qualidade boa mas tamanho razoável

## 🚀 Fluxo Completo

1. Admin faz upload → 2. Imagem salva em `/uploads/` → 3. Caminho no banco → 4. Site carrega automaticamente → 5. Usuário vê a imagem

**Tudo automático e integrado!** 🎉
