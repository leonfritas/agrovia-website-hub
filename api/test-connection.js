const { connectDB, executeQuery } = require('./utils/database');

async function testConnection() {
  try {
    console.log('🔄 Testando conexão com SQL Server...');
    
    // Conectar ao banco
    await connectDB();
    
    // Testar query simples
    console.log('📊 Executando query de teste...');
    const result = await executeQuery('SELECT 1 as test, GETDATE() as currentTime');
    
    console.log('✅ Conexão bem-sucedida!');
    console.log('📋 Resultado do teste:', result.recordset[0]);
    
    // Testar se as tabelas existem
    console.log('\n🔍 Verificando tabelas...');
    
    const tables = ['Categoria', 'Post', 'Usuario', 'Video'];
    
    for (const table of tables) {
      try {
        const tableResult = await executeQuery(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`✅ Tabela ${table}: ${tableResult.recordset[0].count} registros`);
      } catch (error) {
        console.log(`❌ Tabela ${table}: ${error.message}`);
      }
    }
    
    console.log('\n🎉 Teste de conexão concluído!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Erro na conexão:', error.message);
    process.exit(1);
  }
}

// Executar teste
testConnection();
