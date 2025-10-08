const sql = require('mssql');

// Configuração do SQL Server
const config = {
  user: process.env.DB_USER || 'leonardo',
  password: process.env.DB_PASSWORD || '01042018',
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME || 'agrovia',
  port: parseInt(process.env.DB_PORT) || 1433,
  options: {
    encrypt: false, // Para SQL Server local
    trustServerCertificate: true, // Para SQL Server local
    enableArithAbort: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

let pool;

// Conectar ao SQL Server
const connectDB = async () => {
  try {
    pool = await sql.connect(config);
    console.log('📊 SQL Server conectado com sucesso!');
    console.log(`🔗 Servidor: ${config.server}:${config.port}`);
    console.log(`🗄️  Database: ${config.database}`);
    
    // Testar a conexão
    const result = await pool.request().query('SELECT 1 as test');
    console.log('✅ Conexão testada com sucesso');
    
    return pool;
  } catch (error) {
    console.error('❌ Erro ao conectar com SQL Server:', error.message);
    throw error;
  }
};

// Obter pool de conexão
const getPool = () => {
  if (!pool) {
    throw new Error('Pool de conexão não inicializado. Chame connectDB() primeiro.');
  }
  return pool;
};

// Fechar conexão
const closeDB = async () => {
  try {
    if (pool) {
      await pool.close();
      console.log('🔌 Conexão SQL Server fechada');
    }
  } catch (error) {
    console.error('❌ Erro ao fechar conexão:', error.message);
  }
};

// Verificar se está conectado
const isConnected = () => {
  return pool && pool.connected;
};

// Executar query
const executeQuery = async (query, params = {}) => {
  try {
    const pool = getPool();
    const request = pool.request();
    
    // Adicionar parâmetros se fornecidos
    Object.keys(params).forEach(key => {
      request.input(key, params[key]);
    });
    
    const result = await request.query(query);
    return result;
  } catch (error) {
    console.error('❌ Erro ao executar query:', error.message);
    throw error;
  }
};

// Executar stored procedure
const executeProcedure = async (procedureName, params = {}) => {
  try {
    const pool = getPool();
    const request = pool.request();
    
    // Adicionar parâmetros se fornecidos
    Object.keys(params).forEach(key => {
      request.input(key, params[key]);
    });
    
    const result = await request.execute(procedureName);
    return result;
  } catch (error) {
    console.error('❌ Erro ao executar stored procedure:', error.message);
    throw error;
  }
};

// Função para obter estatísticas da conexão
const getConnectionStats = () => {
  return {
    state: pool ? (pool.connected ? 'connected' : 'disconnected') : 'not initialized',
    host: config.server,
    port: config.port,
    database: config.database,
    connected: pool ? pool.connected : false
  };
};

// Função para limpar dados de teste (apenas em desenvolvimento)
const clearTestData = async () => {
  if (process.env.NODE_ENV === 'test') {
    try {
      const tables = ['Video', 'Post', 'Categoria', 'Usuario'];
      
      for (const table of tables) {
        await executeQuery(`DELETE FROM ${table}`);
      }
      
      console.log('🧹 Dados de teste limpos');
    } catch (error) {
      console.error('❌ Erro ao limpar dados de teste:', error.message);
    }
  }
};

// Função para criar índices (SQL Server)
const createIndexes = async () => {
  try {
    // Índices para Usuario
    await executeQuery(`
      IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Usuario_nomeUsuario')
      CREATE INDEX IX_Usuario_nomeUsuario ON Usuario(nomeUsuario)
    `);
    
    await executeQuery(`
      IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Usuario_ativoAdm')
      CREATE INDEX IX_Usuario_ativoAdm ON Usuario(ativoAdm)
    `);

    // Índices para Categoria
    await executeQuery(`
      IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Categoria_nomeCategoria')
      CREATE INDEX IX_Categoria_nomeCategoria ON Categoria(nomeCategoria)
    `);

    // Índices para Post
    await executeQuery(`
      IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Post_idCategoria')
      CREATE INDEX IX_Post_idCategoria ON Post(idCategoria)
    `);
    
    await executeQuery(`
      IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Post_idUsuario')
      CREATE INDEX IX_Post_idUsuario ON Post(idUsuario)
    `);
    
    await executeQuery(`
      IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Post_dataPost')
      CREATE INDEX IX_Post_dataPost ON Post(dataPost)
    `);

    // Índices para Video
    await executeQuery(`
      IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Video_idCategoria')
      CREATE INDEX IX_Video_idCategoria ON Video(idCategoria)
    `);
    
    await executeQuery(`
      IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Video_idUsuario')
      CREATE INDEX IX_Video_idUsuario ON Video(idUsuario)
    `);
    
    await executeQuery(`
      IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Video_dataUpload')
      CREATE INDEX IX_Video_dataUpload ON Video(dataUpload)
    `);

    console.log('📇 Índices criados com sucesso');
  } catch (error) {
    console.error('❌ Erro ao criar índices:', error);
  }
};

// Função para backup dos dados
const backupData = async () => {
  try {
    const tables = ['Usuario', 'Categoria', 'Post', 'Video'];
    const backup = {};

    for (const tableName of tables) {
      const result = await executeQuery(`SELECT * FROM ${tableName}`);
      backup[tableName] = result.recordset;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fs = require('fs');
    const path = require('path');
    
    const backupDir = path.join(__dirname, '..', 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const backupFile = path.join(backupDir, `backup-${timestamp}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));

    console.log(`💾 Backup criado: ${backupFile}`);
    return backupFile;
  } catch (error) {
    console.error('❌ Erro ao criar backup:', error);
    throw error;
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Encerrando aplicação...');
  await closeDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🛑 Encerrando aplicação...');
  await closeDB();
  process.exit(0);
});

module.exports = {
  connectDB,
  getPool,
  closeDB,
  isConnected,
  executeQuery,
  executeProcedure,
  getConnectionStats,
  clearTestData,
  createIndexes,
  backupData
};
