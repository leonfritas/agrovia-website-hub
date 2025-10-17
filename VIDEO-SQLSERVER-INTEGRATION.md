# Integração com Tabela Video SQL Server Existente

## Estrutura da Tabela Video

A tabela Video já existe no banco SQL Server com a seguinte estrutura:

```sql
CREATE TABLE [dbo].[Video](
    [idVideo] [int] IDENTITY(1,1) NOT NULL,
    [nomeVideo] [varchar](50) NOT NULL,
    [urlArquivo] [varchar](500) NULL,
    [urlExterno] [varchar](500) NULL,
    [descricao] [varchar](max) NOT NULL,
    [idUsuario] [int] NOT NULL,
    [dataUpload] [datetime] NOT NULL,
    [idCategoria] [int] NOT NULL,
    [nomeAutor] [varchar](255) NULL,
    [cargoAutor] [varchar](255) NULL,
    CONSTRAINT [PK_Video] PRIMARY KEY ([idVideo])
)
```

## Campos Utilizados pelos Componentes

### Agrovia Conversa:
- `nomeVideo` → Título da conversa
- `descricao` → Resumo da conversa
- `nomeAutor` → Nome do especialista
- `cargoAutor` → Cargo do especialista
- `urlArquivo` ou `urlExterno` → URL do vídeo

### Agrovia Inspira:
- `nomeVideo` → Título do depoimento
- `descricao` → Texto do depoimento
- `nomeAutor` → Nome do produtor
- `urlArquivo` ou `urlExterno` → URL do vídeo

## Categorias Necessárias

Para que os componentes funcionem, você precisa ter categorias com os nomes exatos:

1. **"Agrovia Conversa"** - Para vídeos de entrevistas e diálogos
2. **"Agrovia Inspira"** - Para vídeos de depoimentos inspiradores

## Como Adicionar Vídeos

### Exemplo para Agrovia Conversa:
```sql
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
    'Eng. Florestal Carlos Prado fala sobre reflorestamento',
    'Entrevista sobre reflorestamento e mercado de carbono no Brasil.',
    '/videos/entrevista-carlos-prado.mp4',
    'Carlos Prado',
    'Eng. Florestal',
    1, -- ID do usuário
    GETDATE(),
    1  -- ID da categoria "Agrovia Conversa"
);
```

### Exemplo para Agrovia Inspira:
```sql
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
    'Seu João e os filhos - 40 anos de produção familiar',
    'História inspiradora de uma família que mantém a tradição agrícola.',
    '/videos/depoimento-seu-joao.mp4',
    'Jorge Santos',
    'Produtor Rural',
    1, -- ID do usuário
    GETDATE(),
    2  -- ID da categoria "Agrovia Inspira"
);
```

## Como o Sistema Funciona

1. **API Endpoint**: `/api/videos?categoria=Agrovia%20Conversa`
   - Busca vídeos do banco SQL Server via Prisma
   - Filtra por categoria usando o campo `idCategoria`
   - Retorna JSON com os dados dos vídeos

2. **Componentes React**:
   - **AgroviaConversa**: Busca vídeos da categoria "Agrovia Conversa"
   - **AgroviaInspira**: Busca vídeos da categoria "Agrovia Inspira"
   - Renderiza automaticamente baseado na quantidade de registros

3. **Sistema de Fallback**:
   - Se não encontrar vídeos no banco, usa dados mockados
   - Garante que o site sempre funcione

## Campos Opcionais e Fallbacks

- **descricao**: Se vazio, usa texto padrão
- **nomeAutor**: Se vazio, usa "Especialista" ou "Produtor Rural"
- **cargoAutor**: Se vazio, usa "Especialista"
- **urlArquivo/urlExterno**: Pelo menos um deve estar preenchido

## Imagens

Como a tabela não tem campo para imagem de thumbnail, o sistema usa imagens padrão:
- Agrovia Conversa: `/images/agrovia-conversa1.jpg`, `/images/agrovia-conversa2.jpg`
- Agrovia Inspira: `/images/agrovia-inspira1.jpg`, `/images/agrovia-inspira2.jpg`

As imagens alternam baseado no índice do vídeo.

## Próximos Passos

1. **Verificar conexão com banco**: Certifique-se que o Prisma está conectado ao SQL Server
2. **Popular categorias**: Adicione as categorias "Agrovia Conversa" e "Agrovia Inspira"
3. **Adicionar vídeos**: Use os exemplos SQL acima para adicionar vídeos
4. **Testar**: Verifique se os componentes estão renderizando os dados do banco

## Troubleshooting

- Se os vídeos não aparecem, verifique se as categorias existem com os nomes exatos
- Se há erro de conexão, verifique as configurações do Prisma no arquivo `.env`
- Se o Prisma não consegue gerar o cliente, tente executar como administrador
