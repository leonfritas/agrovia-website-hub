const { connectDB, executeQuery } = require('./utils/database');

async function checkTableStructure() {
  try {
    console.log('🔄 Conectando ao banco...');
    await connectDB();
    
    console.log('📋 Verificando estrutura da tabela Usuario...');
    const result = await executeQuery(`
      SELECT 
        COLUMN_NAME,
        DATA_TYPE,
        CHARACTER_MAXIMUM_LENGTH,
        IS_NULLABLE
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'Usuario'
      ORDER BY ORDINAL_POSITION
    `);
    
    console.log('Estrutura da tabela Usuario:');
    result.recordset.forEach(col => {
      console.log(`- ${col.COLUMN_NAME}: ${col.DATA_TYPE}(${col.CHARACTER_MAXIMUM_LENGTH || 'N/A'}) - Nullable: ${col.IS_NULLABLE}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

checkTableStructure();




