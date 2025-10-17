# Configuração de Conexão com Banco de Dados

## Status Atual
✅ **Sistema funcionando com dados mockados**
- A aplicação está rodando com dados simulados
- Todas as funcionalidades estão operacionais
- Os componentes renderizam corretamente

## Para Conectar com o Banco Real

### 1. Configurar Variáveis de Ambiente
Crie/edite o arquivo `.env` na raiz do projeto:

```env
# Configurações do Banco de Dados SQL Server
DB_SERVER=seu_servidor_sql
DB_DATABASE=Agrovia
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_PORT=1433
DB_ENCRYPT=false
DB_TRUST_CERT=true

# Outras configurações existentes...
DATABASE_URL=your_database_url_here
SHADOW_DATABASE_URL=your_shadow_database_url_here
```

### 2. Ativar Conexão Real
Edite o arquivo `src/app/api/videos-v2/route.ts`:

```typescript
// Comentar a linha mock
// import VideoMock from '@/models/VideoMock';

// Descomentar a linha real
import Video from '@/models/Video';
```

E alterar a instanciação:
```typescript
// Comentar
// const videoModel = new VideoMock();

// Descomentar
const videoModel = new Video();
```

### 3. Verificar Estrutura do Banco
Certifique-se que sua tabela Video tem a estrutura correta:

```sql
-- Verificar estrutura da tabela Video
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Video';

-- Verificar se existem as categorias necessárias
SELECT * FROM Categoria WHERE nomeCategoria IN ('Agrovia Conversa', 'Agrovia Inspira');

-- Se não existirem, criar:
INSERT INTO Categoria (nomeCategoria, descricao) VALUES
('Agrovia Conversa', 'Entrevistas e diálogos com especialistas do agronegócio'),
('Agrovia Inspira', 'Depoimentos e histórias inspiradoras de produtores rurais');
```

### 4. Testar Conexão
Você pode testar a conexão criando um endpoint de teste:

```typescript
// src/app/api/test-db/route.ts
import { NextResponse } from 'next/server';
import { testConnection } from '@/lib/database';

export async function GET() {
  try {
    const isConnected = await testConnection();
    return NextResponse.json({ 
      connected: isConnected,
      message: isConnected ? 'Conexão OK' : 'Erro na conexão'
    });
  } catch (error) {
    return NextResponse.json({ 
      connected: false,
      error: error.message 
    });
  }
}
```

## Dados Mockados Atuais

O sistema está usando estes dados simulados:

### Agrovia Conversa:
- Eng. Florestal Carlos Prado - Reflorestamento e mercado de carbono
- Profa. Marina Souza - ILPF no Centro-Oeste

### Agrovia Inspira:
- Seu João e os filhos - 40 anos de produção familiar
- Dona Maria e a cooperativa - Histórias de superação

## Vantagens do Sistema Atual

1. **Funcionamento Imediato**: Não precisa configurar banco para testar
2. **Desenvolvimento Rápido**: Pode desenvolver e testar sem dependências
3. **Migração Fácil**: Troca simples entre mock e banco real
4. **Dados Consistentes**: Sempre retorna dados válidos

## Quando Migrar para Banco Real

- ✅ Quando quiser persistir dados
- ✅ Quando tiver usuários reais
- ✅ Quando precisar de funcionalidades de CRUD completas
- ✅ Quando estiver em produção

## Logs de Debug

O sistema atual mostra logs no console:
- 🔧 Usando VideoMock - dados simulados
- 🔍 Buscando vídeos por categoria: "Agrovia Conversa"
- 📊 Calculando estatísticas dos vídeos

Isso ajuda a entender o que está acontecendo durante o desenvolvimento.
