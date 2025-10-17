# Sistema de Vídeos Dinâmico - Agrovia Website

## Visão Geral

Este sistema permite que as seções "Agrovia Conversa" e "Agrovia Inspira" sejam populadas dinamicamente através de dados do banco de dados, em vez de usar dados fixos no código.

## Estrutura do Banco de Dados

### Tabela Categoria
- `idCategoria`: ID único da categoria
- `nomeCategoria`: Nome da categoria (ex: "Agrovia Conversa", "Agrovia Inspira")
- `descricao`: Descrição opcional da categoria
- `createdAt`, `updatedAt`: Timestamps de criação e atualização

### Tabela Video
- `idVideo`: ID único do vídeo
- `nomeVideo`: Título do vídeo
- `descricao`: Descrição do vídeo
- `urlArquivo`: URL do arquivo local (ex: "/videos/video.mp4")
- `urlExterno`: URL externa (YouTube, Vimeo, etc.)
- `imagemThumb`: URL da imagem de thumbnail
- `nomeAutor`: Nome do autor/palestrante
- `cargoAutor`: Cargo do autor
- `ativo`: Se o vídeo está ativo (true/false)
- `ordem`: Ordem de exibição (opcional)
- `dataUpload`, `updatedAt`: Timestamps
- `categoriaId`: ID da categoria (relacionamento)

## Como Usar

### 1. Configurar o Banco de Dados

```bash
# Gerar o cliente Prisma
npx prisma generate

# Criar e aplicar as migrações
npx prisma migrate dev --name add-video-tables

# Popular com dados iniciais (opcional)
# Execute o arquivo prisma/seed.sql no seu banco de dados
```

### 2. Adicionar Novos Vídeos

#### Via SQL direto:
```sql
INSERT INTO "Video" (
  "nomeVideo", 
  "descricao", 
  "urlArquivo", 
  "imagemThumb", 
  "nomeAutor", 
  "cargoAutor", 
  "ativo", 
  "ordem", 
  "categoriaId"
) VALUES (
  'Título do Vídeo',
  'Descrição do vídeo',
  '/videos/meu-video.mp4',
  '/images/thumb.jpg',
  'Nome do Autor',
  'Cargo do Autor',
  true,
  1,
  (SELECT "idCategoria" FROM "Categoria" WHERE "nomeCategoria" = 'Agrovia Conversa')
);
```

#### Via Interface Admin (futuro):
Um painel administrativo pode ser criado para facilitar o gerenciamento.

### 3. Como o Sistema Funciona

1. **API Endpoint**: `/api/videos?categoria=Agrovia%20Conversa`
   - Busca vídeos do banco de dados
   - Se não encontrar dados, usa fallback com dados mockados
   - Retorna JSON com informações dos vídeos

2. **Componentes React**:
   - `AgroviaConversa`: Busca vídeos da categoria "Agrovia Conversa"
   - `AgroviaInspira`: Busca vídeos da categoria "Agrovia Inspira"
   - Renderiza automaticamente baseado na quantidade de registros

3. **Fallback System**:
   - Se o banco estiver indisponível ou vazio, usa dados mockados
   - Garante que o site sempre funcione

## Campos Obrigatórios vs Opcionais

### Obrigatórios:
- `nomeVideo`
- `categoriaId`

### Opcionais (com fallbacks):
- `descricao`: Usa texto padrão se não informado
- `imagemThumb`: Usa imagens padrão se não informado
- `nomeAutor`: Usa "Especialista" se não informado
- `cargoAutor`: Usa "Especialista" se não informado
- `urlArquivo` ou `urlExterno`: Pelo menos um deve estar preenchido

## Categorias Disponíveis

- **Agrovia Conversa**: Para entrevistas e diálogos com especialistas
- **Agrovia Inspira**: Para depoimentos e histórias inspiradoras

## Vantagens do Sistema

1. **Dinâmico**: Adicione/remova vídeos sem alterar código
2. **Flexível**: Suporte a arquivos locais e URLs externas
3. **Resiliente**: Sistema de fallback garante funcionamento
4. **Organizado**: Categorização e ordenação de vídeos
5. **Escalável**: Fácil adição de novas categorias

## Próximos Passos

1. Criar painel administrativo para gerenciar vídeos
2. Adicionar sistema de upload de arquivos
3. Implementar cache para melhor performance
4. Adicionar mais metadados (duração, tags, etc.)
