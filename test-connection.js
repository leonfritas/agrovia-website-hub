// Script para testar conexão com banco de dados
const sql = require('mssql');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  try {
    console.log('🧪 Testando conexão com banco de dados...\n');
    
    // Verificar variáveis de ambiente
    console.log('📋 Variáveis de ambiente:');
    console.log(`DB_SERVER: ${process.env.DB_SERVER || 'NÃO DEFINIDA'}`);
    console.log(`DB_DATABASE: ${process.env.DB_DATABASE || 'NÃO DEFINIDA'}`);
    console.log(`DB_USER: ${process.env.DB_USER || 'NÃO DEFINIDA'}`);
    console.log(`DB_PASSWORD: ${process.env.DB_PASSWORD ? 'DEFINIDA' : 'NÃO DEFINIDA'}`);
    console.log(`DB_PORT: ${process.env.DB_PORT || 'NÃO DEFINIDA'}`);
    console.log(`DB_ENCRYPT: ${process.env.DB_ENCRYPT || 'NÃO DEFINIDA'}`);
    console.log(`DB_TRUST_CERT: ${process.env.DB_TRUST_CERT || 'NÃO DEFINIDA'}`);
    
    // Verificar se todas as variáveis necessárias estão definidas
    const requiredVars = ['DB_SERVER', 'DB_DATABASE', 'DB_USER', 'DB_PASSWORD', 'DB_PORT'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.log(`\n❌ Variáveis obrigatórias não definidas: ${missingVars.join(', ')}`);
      return;
    }
    
    console.log('\n🔌 Tentando conectar ao banco...');
    
    const config = {
      server: process.env.DB_SERVER,
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT),
      options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: process.env.DB_TRUST_CERT === 'true',
        enableArithAbort: true,
      }
    };
    
    const pool = await sql.connect(config);
    console.log('✅ Conexão estabelecida com sucesso!');
    
    // Testar query
    console.log('\n📊 Testando query...');
    const result = await pool.request().query('SELECT COUNT(*) as total FROM Video');
    console.log(`✅ Query executada com sucesso! Total de vídeos: ${result.recordset[0].total}`);
    
    // Testar query específica
    const videosResult = await pool.request().query(`
      SELECT v.idVideo, v.nomeVideo, c.nomeCategoria 
      FROM Video v 
      INNER JOIN Categoria c ON v.idCategoria = c.idCategoria 
      WHERE c.nomeCategoria IN ('Agrovia Conversa', 'Agrovia Inspira')
    `);
    
    console.log(`\n📹 Vídeos encontrados: ${videosResult.recordset.length}`);
    videosResult.recordset.forEach(video => {
      console.log(`- ${video.nomeVideo} (${video.nomeCategoria})`);
    });
    
    await pool.close();
    console.log('\n✅ Teste concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro na conexão:', error.message);
  }
}

testConnection();
