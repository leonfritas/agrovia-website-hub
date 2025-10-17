# Guia de Configuração do Banco de Dados

## ⚠️ Problema Identificado

O sistema está configurado para usar dados **reais do banco SQL Server**, mas precisa das configurações de conexão.

## 🔧 Configuração Necessária

### 1. Configurar Variáveis de Ambiente

Crie ou edite o arquivo `.env` na raiz do projeto com suas credenciais:

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

### 2. Exemplos de Configuração

#### SQL Server Local (Express):
```env
DB_SERVER=localhost\\SQLEXPRESS
DB_DATABASE=Agrovia
DB_USER=sa
DB_PASSWORD=123456
DB_PORT=1433
DB_ENCRYPT=false
DB_TRUST_CERT=true
```

#### SQL Server na Rede:
```env
DB_SERVER=192.168.1.100
DB_DATABASE=Agrovia
DB_USER=agrovia_user
DB_PASSWORD=senha_forte
DB_PORT=1433
DB_ENCRYPT=true
DB_TRUST_CERT=false
```

#### SQL Server Azure:
```env
DB_SERVER=seu-servidor.database.windows.net
DB_DATABASE=Agrovia
DB_USER=seu-usuario
DB_PASSWORD=sua-senha
DB_PORT=1433
DB_ENCRYPT=true
DB_TRUST_CERT=false
```

## 🧪 Testar Conexão

Após configurar as variáveis de ambiente, teste a conexão:

1. **Acesse**: http://localhost:3001/api/test-db
2. **Verifique a resposta**:
   - ✅ Se funcionar: Verá os dados do banco
   - ❌ Se falhar: Verá o erro e dicas de configuração

## 📋 Verificar Estrutura do Banco

Certifique-se que sua tabela Video tem a estrutura correta:

```sql
-- Verificar estrutura
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Video';

-- Verificar se existem as categorias
SELECT * FROM Categoria WHERE nomeCategoria IN ('Agrovia Conversa', 'Agrovia Inspira');

-- Se não existirem, criar:
INSERT INTO Categoria (nomeCategoria, descricao) VALUES
('Agrovia Conversa', 'Entrevistas e diálogos com especialistas do agronegócio'),
('Agrovia Inspira', 'Depoimentos e histórias inspiradoras de produtores rurais');
```

## 🔍 Logs de Debug

Quando configurado corretamente, você verá no console do servidor:

```
🔌 Conectando ao banco: localhost Agrovia
🔍 Executando query: SELECT v.*, c.nomeCategoria, u.nomeUsuario FROM Video v...
📋 Parâmetros: { nomeCategoria: 'Agrovia Conversa', offset: 0, limit: 50 }
✅ Query executada com sucesso. Registros encontrados: 2
```

## ❌ Problemas Comuns

### 1. Erro de Conexão
```
❌ Erro ao executar query: Login failed for user 'sa'
```
**Solução**: Verifique usuário e senha no `.env`

### 2. Banco Não Encontrado
```
❌ Erro ao executar query: Cannot open database "Agrovia"
```
**Solução**: Verifique se o banco existe e o nome está correto

### 3. Servidor Não Encontrado
```
❌ Erro ao executar query: connect ECONNREFUSED
```
**Solução**: Verifique se o SQL Server está rodando

### 4. Tabela Não Existe
```
❌ Erro ao executar query: Invalid object name 'Video'
```
**Solução**: Verifique se a tabela Video existe no banco

## 🚀 Próximos Passos

1. **Configure o arquivo .env** com suas credenciais
2. **Teste a conexão** em http://localhost:3001/api/test-db
3. **Verifique os logs** no console do servidor
4. **Acesse o site** para ver os dados reais do banco

## 📞 Suporte

Se tiver problemas:
1. Verifique os logs do servidor
2. Teste a conexão com `/api/test-db`
3. Confirme as configurações do SQL Server
4. Verifique se as tabelas existem

O sistema está pronto para usar dados reais do banco!
