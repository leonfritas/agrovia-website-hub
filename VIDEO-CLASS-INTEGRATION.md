# Integração com Classe Video Personalizada

## Visão Geral

O sistema foi atualizado para usar sua classe Video personalizada em vez do Prisma, permitindo integração direta com sua estrutura de banco SQL Server existente.

## Arquivos Criados/Modificados

### 1. Nova API (`src/app/api/videos-v2/route.ts`)
- Endpoint que usa sua classe Video
- Busca vídeos por categoria usando `findByCategoriaName()`
- Sistema de fallback mantido
- Retorna dados no formato esperado pelos componentes

### 2. Classe Video TypeScript (`src/models/Video.ts`)
- Adaptação da sua classe Video para TypeScript/Next.js
- Métodos principais:
  - `findById()`: Buscar vídeo por ID
  - `create()`: Criar novo vídeo
  - `findByCategoria()`: Buscar por ID da categoria
  - `findByCategoriaName()`: Buscar por nome da categoria
  - `findAllWithDetails()`: Buscar todos com detalhes
  - `findRecent()`: Buscar vídeos recentes

### 3. Configuração de Banco (`src/lib/database.ts`)
- Configuração de conexão com SQL Server
- Funções para executar queries
- Pool de conexões para performance
- Configuração via variáveis de ambiente

### 4. Hook Atualizado (`src/hooks/useVideos.ts`)
- Agora usa `/api/videos-v2` em vez de `/api/videos`
- Mantém a mesma interface para os componentes

## Configuração Necessária

### 1. Variáveis de Ambiente
Adicione ao seu arquivo `.env`:

```env
# Configurações do Banco de Dados SQL Server
DB_SERVER=localhost
DB_DATABASE=Agrovia
DB_USER=sa
DB_PASSWORD=sua_senha_aqui
DB_PORT=1433
DB_ENCRYPT=false
DB_TRUST_CERT=true
```

### 2. Dependências
Instale a dependência do SQL Server:

```bash
npm install mssql
npm install @types/mssql --save-dev
```

### 3. Estrutura da Tabela Categoria
Certifique-se que sua tabela Categoria tem as categorias necessárias:

```sql
-- Verificar se existem as categorias
SELECT * FROM Categoria WHERE nomeCategoria IN ('Agrovia Conversa', 'Agrovia Inspira');

-- Se não existirem, criar:
INSERT INTO Categoria (nomeCategoria, descricao) VALUES
('Agrovia Conversa', 'Entrevistas e diálogos com especialistas'),
('Agrovia Inspira', 'Depoimentos e histórias inspiradoras');
```

## Como Usar

### 1. Adicionar Vídeos
```sql
-- Exemplo para Agrovia Conversa
INSERT INTO Video (
    nomeVideo, 
    descricao, 
    urlArquivo, 
    nomeAutor, 
    cargoAutor, 
    idUsuario, 
    dataUpload, 
    idCategoria
) VALUES (
    'Título do Vídeo',
    'Descrição do vídeo',
    '/videos/meu-video.mp4',
    'Nome do Autor',
    'Cargo do Autor',
    1, -- ID do usuário
    GETDATE(),
    (SELECT idCategoria FROM Categoria WHERE nomeCategoria = 'Agrovia Conversa')
);
```

### 2. Testar Conexão
```javascript
// Teste de conexão
import { testConnection } from '@/lib/database';

const isConnected = await testConnection();
console.log('Conectado:', isConnected);
```

## Métodos da Classe Video

### Buscar por Categoria
```javascript
const videoModel = new Video();

// Por nome da categoria
const videos = await videoModel.findByCategoriaName('Agrovia Conversa', {
  limit: 10,
  offset: 0
});

// Por ID da categoria
const videos = await videoModel.findByCategoria(1, {
  limit: 10,
  offset: 0
});
```

### Buscar Todos
```javascript
const videos = await videoModel.findAllWithDetails({
  limit: 50,
  offset: 0,
  orderBy: 'v.dataUpload',
  order: 'DESC'
});
```

### Buscar Recentes
```javascript
const recentVideos = await videoModel.findRecent(5);
```

## Vantagens da Nova Implementação

1. **Compatibilidade**: Usa sua estrutura de banco existente
2. **Performance**: Pool de conexões otimizado
3. **Flexibilidade**: Métodos específicos para suas necessidades
4. **Fallback**: Sistema de fallback mantido para garantir funcionamento
5. **TypeScript**: Tipagem completa para melhor desenvolvimento

## Troubleshooting

### Erro de Conexão
- Verifique as variáveis de ambiente
- Teste a conexão com `testConnection()`
- Verifique se o SQL Server está rodando

### Erro de Query
- Verifique se as tabelas existem
- Confirme os nomes das colunas
- Verifique as permissões do usuário

### Vídeos Não Aparecem
- Verifique se as categorias existem
- Confirme se há vídeos na tabela
- Verifique os logs da API

## Próximos Passos

1. **Configurar variáveis de ambiente**
2. **Instalar dependência mssql**
3. **Testar conexão com banco**
4. **Adicionar vídeos de teste**
5. **Verificar renderização nos componentes**

O sistema está pronto para usar sua classe Video existente!
