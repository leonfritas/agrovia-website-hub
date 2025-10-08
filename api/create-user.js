const { connectDB, executeQuery } = require('./utils/database');
const bcrypt = require('bcryptjs');

async function createUser() {
  try {
    console.log('🔄 Conectando ao banco...');
    await connectDB();
    
    console.log('👤 Criando usuário administrador...');
    
    // Criptografar senha
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash('01042018', saltRounds);
    
    const result = await executeQuery(`
      INSERT INTO Usuario (nomeUsuario, senhaUsuario, ativoAdm)
      VALUES (@nomeUsuario, @senhaUsuario, @ativoAdm)
    `, { 
      nomeUsuario: 'admin', 
      senhaUsuario: hashedPassword,
      ativoAdm: 1
    });
    
    console.log('✅ Usuário criado com sucesso!');
    console.log('Nome: admin');
    console.log('Senha: 01042018');
    console.log('Admin: Sim');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

createUser();



