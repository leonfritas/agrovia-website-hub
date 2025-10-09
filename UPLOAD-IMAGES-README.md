# Sistema de Upload de Imagens - Agrovia Website

## 📋 Resumo das Implementações

### ✅ Banco de Dados
- **Campo `conteudo`**: Adicionado para armazenar o texto completo do post
- **Campo `imagemPost`**: Imagem principal do card (já existia, agora permite NULL)
- **Campo `imagemDestaque`**: Imagem de destaque para o topo do artigo
- **Campo `imagemConteudo`**: Imagem adicional para o corpo do conteúdo
- **Campos ajustados**: `nomePost` (200 chars) e `nomeCategoria` (100 chars)

### ✅ API Backend
#### Novos Recursos
- **Upload de Imagens**: Sistema com Multer configurado
- **Pasta de Uploads**: `/api/uploads` para armazenar imagens
- **Middleware de Upload**: Suporta múltiplos campos de imagem
- **Servir Arquivos**: Imagens acessíveis via `/uploads/[filename]`

#### Endpoints Atualizados
- **POST /api/posts**: Aceita FormData com imagens
- **PUT /api/posts/:id**: Aceita FormData com imagens  
- **GET /api/posts/secao/:nomeCategoria**: Busca posts por categoria

### ✅ Frontend Website
#### Nova Página
- **`/post/[id]`**: Página dinâmica para exibir conteúdo completo
  - Título e descrição do post
  - Imagem de destaque
  - Conteúdo completo (texto)
  - Imagem do conteúdo
  - Link externo (se houver)
  - Botão voltar

#### Componentes Atualizados
- **AgroviaEnsina**: Carrega posts do banco, imagens dinâmicas, link para `/post/[id]`
- **AgroviaLegal**: Carrega posts do banco, imagens dinâmicas, link para `/post/[id]`
- **AgroviaAtual**: Carrega posts do banco, imagens dinâmicas, link para `/post/[id]`

### ✅ Painel Administrativo
- **Interface de Upload**: Atualizada para permitir seleção de arquivos
- **Três campos de imagem**:
  1. Imagem Post (card)
  2. Imagem Destaque (topo do artigo)
  3. Imagem Conteúdo (corpo do artigo)
- **Preview de imagens** antes do envio
- **Campo de conteúdo** expandido para texto longo

## 🚀 Como Usar

### 1. Backend (API)

#### Iniciar o servidor:
```bash
cd api
npm install
npm start
```

O servidor estará rodando em `http://localhost:3001`

#### Pasta de uploads:
As imagens são salvas em: `api/uploads/`
Acessíveis via: `http://localhost:3001/uploads/[nome-do-arquivo]`

### 2. Frontend (Website)

#### Iniciar o servidor:
```bash
cd web
npm install
npm run dev
```

O site estará rodando em `http://localhost:3000`

#### Configuração:
Certifique-se de que a variável `NEXT_PUBLIC_API_URL` está configurada (padrão: `http://localhost:3001/api`)

### 3. Painel Administrativo

#### Iniciar o painel:
```bash
cd painelAdmin/painel-admin
npm install
npm run dev
```

O painel estará rodando em `http://localhost:3002`

#### Como adicionar um post com imagens:

1. Faça login no painel admin
2. Acesse "Posts" no menu lateral
3. Clique em "Novo Post"
4. Preencha os campos:
   - **Nome**: Título do post
   - **Descrição**: Resumo breve (aparece no card)
   - **Conteúdo**: Texto completo do artigo
   - **Categoria**: Selecione a seção (Agrovia Ensina, etc.)
   - **Usuário**: Autor do post
   - **Link Externo** (opcional)

5. **Selecione as imagens**:
   - **Imagem Post**: Clique no botão e escolha a imagem para o card
   - **Imagem Destaque**: Clique no botão e escolha a imagem de destaque
   - **Imagem Conteúdo**: Clique no botão e escolha a imagem do conteúdo

6. Clique em "Salvar"

As imagens serão automaticamente:
- Enviadas para o servidor
- Salvas na pasta `api/uploads/`
- Referenciadas no banco de dados
- Exibidas no site

## 📁 Estrutura de Arquivos

### API
```
api/
├── uploads/               # Pasta para imagens enviadas
├── middleware/
│   └── upload.js         # Configuração do Multer
├── models/
│   └── Post.js           # Modelo atualizado com novos campos
├── controllers/
│   └── postController.js # Controlador com suporte a upload
└── routes/
    └── posts.js          # Rotas com middleware de upload
```

### Frontend
```
web/
├── src/
│   ├── app/
│   │   └── post/
│   │       └── [id]/
│   │           └── page.tsx  # Página dinâmica de post
│   ├── components/
│   │   ├── AgroviaEnsina/
│   │   ├── AgroviaLegal/
│   │   └── AgroviaAtual/
│   └── hooks/
│       └── usePosts.ts        # Hook atualizado
```

### Painel Admin
```
painelAdmin/painel-admin/
├── src/
│   ├── app/
│   │   └── posts/
│   │       └── page.tsx       # Página de posts com upload
│   └── lib/
│       └── api.ts             # API client atualizada
```

## 🔧 Configurações Técnicas

### Limites de Upload
- **Tamanho máximo**: 5MB por imagem
- **Formatos aceitos**: JPEG, PNG, GIF, WebP
- **Campos simultâneos**: 3 imagens por post

### Segurança
- Validação de tipo de arquivo
- Nomes de arquivo sanitizados
- Geração de nomes únicos (timestamp + random)

### Performance
- Imagens servidas estaticamente
- Cache configurado no servidor
- Otimização de Next.js Image

## 🐛 Troubleshooting

### Imagens não aparecem no site
1. Verifique se o servidor da API está rodando
2. Confirme que `NEXT_PUBLIC_API_URL` está configurado corretamente
3. Verifique se a pasta `api/uploads` existe e tem permissões adequadas

### Erro ao fazer upload
1. Verifique o tamanho da imagem (máx. 5MB)
2. Confirme o formato (JPEG, PNG, GIF, WebP)
3. Verifique os logs do servidor da API

### Posts não carregam
1. Verifique se as categorias foram criadas
2. Confirme que os posts estão associados a usuários válidos
3. Verifique a autenticação da API

## 📝 Exemplos de Uso

### Buscar posts por categoria (API)
```bash
GET http://localhost:3001/api/posts/secao/Agrovia%20Ensina
```

### Acessar imagem
```bash
GET http://localhost:3001/uploads/[nome-do-arquivo]
```

### Criar post com imagens (cURL)
```bash
curl -X POST http://localhost:3001/api/posts \
  -H "Authorization: Bearer [seu-token]" \
  -F "nomePost=Título do Post" \
  -F "descricao=Descrição breve" \
  -F "conteudo=Conteúdo completo..." \
  -F "idCategoria=1002" \
  -F "idUsuario=1" \
  -F "imagemPost=@/caminho/para/imagem1.jpg" \
  -F "imagemDestaque=@/caminho/para/imagem2.jpg" \
  -F "imagemConteudo=@/caminho/para/imagem3.jpg"
```

## 🎯 Próximos Passos

Para melhorias futuras, considere:

1. **Redimensionamento de imagens**: Implementar processamento automático
2. **CDN**: Servir imagens de uma CDN para melhor performance
3. **Compressão**: Otimizar imagens automaticamente no upload
4. **Múltiplas imagens**: Suportar galeria de imagens por post
5. **Editor rico**: Implementar editor WYSIWYG para o conteúdo
6. **Versionamento**: Sistema de revisões de posts

## 📞 Suporte

Para dúvidas ou problemas, verifique:
- Logs do servidor API: `api/logs/`
- Console do navegador (F12)
- Banco de dados: Verifique a estrutura da tabela Post

---

**Versão**: 1.0.0
**Data**: Janeiro 2025
**Autor**: Equipe Agrovia
