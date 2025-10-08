const { connectDB, executeQuery } = require('./utils/database');

async function checkUser() {
  try {
    console.log('🔄 Conectando ao banco...');
    await connectDB();
    
    console.log('👤 Verificando usuário admin...');
    const result = await executeQuery(`
      SELECT idUsuario, nomeUsuario, senhaUsuario, ativoAdm 
      FROM Usuario 
      WHERE nomeUsuario = @nomeUsuario
    `, { nomeUsuario: 'admin' });
    
    if (result.recordset.length > 0) {
      const user = result.recordset[0];
      console.log('✅ Usuário encontrado:');
      console.log('ID:', user.idUsuario);
      console.log('Nome:', user.nomeUsuario);
      console.log('Senha (hash):', user.senhaUsuario);
      console.log('Admin:', user.ativoAdm);
      console.log('Tamanho da senha:', user.senhaUsuario ? user.senhaUsuario.length : 'null');
    } else {
      console.log('❌ Usuário não encontrado');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

checkUser();



