const { connectDB, executeQuery } = require('./utils/database');

async function fixPasswordField() {
  try {
    console.log('🔄 Conectando ao banco...');
    await connectDB();
    
    console.log('🔧 Alterando tamanho do campo senhaUsuario...');
    
    // Alterar o campo senhaUsuario para suportar hash bcrypt (60+ caracteres)
    await executeQuery(`
      ALTER TABLE Usuario 
      ALTER COLUMN senhaUsuario VARCHAR(255) NOT NULL
    `);
    
    console.log('✅ Campo senhaUsuario alterado para VARCHAR(255)');
    
    // Também vou aumentar o nomeUsuario para ser mais flexível
    await executeQuery(`
      ALTER TABLE Usuario 
      ALTER COLUMN nomeUsuario VARCHAR(100) NOT NULL
    `);
    
    console.log('✅ Campo nomeUsuario alterado para VARCHAR(100)');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

fixPasswordField();




