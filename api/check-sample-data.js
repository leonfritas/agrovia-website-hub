const { connectDB, executeQuery } = require('./utils/database');

async function checkSampleData() {
  try {
    console.log('🔄 Conectando ao banco...');
    await connectDB();
    
    console.log('📊 Verificando dados inseridos...\n');
    
    // Verificar Usuários
    console.log('👥 USUÁRIOS:');
    const usuarios = await executeQuery(`
      SELECT idUsuario, nomeUsuario, ativoAdm
      FROM Usuario
      ORDER BY idUsuario
    `);
    
    usuarios.recordset.forEach(user => {
      console.log(`- ID: ${user.idUsuario} | Nome: ${user.nomeUsuario} | Admin: ${user.ativoAdm ? 'Sim' : 'Não'}`);
    });
    
    // Verificar Categorias
    console.log('\n📂 CATEGORIAS:');
    const categorias = await executeQuery(`
      SELECT idCategoria, nomeCategoria
      FROM Categoria
      ORDER BY idCategoria
    `);
    
    categorias.recordset.forEach(cat => {
      console.log(`- ID: ${cat.idCategoria} | Nome: ${cat.nomeCategoria}`);
    });
    
    // Verificar Posts
    console.log('\n📰 POSTS:');
    const posts = await executeQuery(`
      SELECT p.idPost, p.nomePost, p.descricao, c.nomeCategoria, u.nomeUsuario, p.dataPost
      FROM Post p
      INNER JOIN Categoria c ON p.idCategoria = c.idCategoria
      INNER JOIN Usuario u ON p.idUsuario = u.idUsuario
      ORDER BY p.idPost
    `);
    
    posts.recordset.forEach(post => {
      console.log(`- ID: ${post.idPost} | Título: ${post.nomePost}`);
      console.log(`  Categoria: ${post.nomeCategoria} | Autor: ${post.nomeUsuario}`);
      console.log(`  Data: ${new Date(post.dataPost).toLocaleDateString('pt-BR')}`);
      console.log(`  Descrição: ${post.descricao.substring(0, 100)}...`);
      console.log('');
    });
    
    // Verificar Vídeos
    console.log('🎥 VÍDEOS:');
    const videos = await executeQuery(`
      SELECT v.idVideo, v.nomeVideo, v.urlArquivo, v.urlExterno, v.descricao, c.nomeCategoria, u.nomeUsuario, v.dataUpload
      FROM Video v
      INNER JOIN Categoria c ON v.idCategoria = c.idCategoria
      INNER JOIN Usuario u ON v.idUsuario = u.idUsuario
      ORDER BY v.idVideo
    `);
    
    videos.recordset.forEach(video => {
      console.log(`- ID: ${video.idVideo} | Título: ${video.nomeVideo}`);
      console.log(`  Categoria: ${video.nomeCategoria} | Autor: ${video.nomeUsuario}`);
      console.log(`  Data: ${new Date(video.dataUpload).toLocaleDateString('pt-BR')}`);
      console.log(`  URL Arquivo: ${video.urlArquivo || 'N/A'}`);
      console.log(`  URL Externa: ${video.urlExterno || 'N/A'}`);
      console.log(`  Descrição: ${video.descricao.substring(0, 100)}...`);
      console.log('');
    });
    
    console.log('✅ Verificação concluída!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

checkSampleData();
