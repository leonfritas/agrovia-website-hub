const { connectDB, executeQuery } = require('./utils/database');
const bcrypt = require('bcryptjs');

async function insertSampleData() {
  try {
    console.log('🔄 Conectando ao banco...');
    await connectDB();
    
    console.log('📝 Inserindo dados simulados...\n');
    
    // 1. Inserir Categorias
    console.log('📂 Inserindo categorias...');
    const categorias = [
      { nome: 'Agricultura Sustentável' },
      { nome: 'Tecnologia Rural' }
    ];
    
    for (const categoria of categorias) {
      try {
        await executeQuery(`
          INSERT INTO Categoria (nomeCategoria)
          VALUES (@nomeCategoria)
        `, { nomeCategoria: categoria.nome });
        console.log(`✅ Categoria inserida: ${categoria.nome}`);
      } catch (error) {
        console.log(`⚠️  Categoria já existe ou erro: ${categoria.nome}`);
      }
    }
    
    // 2. Inserir Usuários adicionais
    console.log('\n👥 Inserindo usuários...');
    const usuarios = [
      { nome: 'maria_silva', senha: 'senha123', admin: false },
      { nome: 'joao_santos', senha: 'admin456', admin: true }
    ];
    
    for (const usuario of usuarios) {
      try {
        const hashedPassword = await bcrypt.hash(usuario.senha, 12);
        await executeQuery(`
          INSERT INTO Usuario (nomeUsuario, senhaUsuario, ativoAdm)
          VALUES (@nomeUsuario, @senhaUsuario, @ativoAdm)
        `, { 
          nomeUsuario: usuario.nome,
          senhaUsuario: hashedPassword,
          ativoAdm: usuario.admin
        });
        console.log(`✅ Usuário inserido: ${usuario.nome}`);
      } catch (error) {
        console.log(`⚠️  Usuário já existe ou erro: ${usuario.nome}`);
      }
    }
    
    // 3. Inserir Posts
    console.log('\n📰 Inserindo posts...');
    const posts = [
      {
        nome: 'Técnicas de Plantio Orgânico',
        descricao: 'Descubra as melhores práticas para um plantio 100% orgânico, sem uso de agrotóxicos. Aprenda sobre rotação de culturas, compostagem e controle biológico de pragas.',
        categoria: 1,
        usuario: 1,
        imagem: 'https://exemplo.com/imagens/plantio-organico.jpg'
      },
      {
        nome: 'IoT na Agricultura',
        descricao: 'Como a Internet das Coisas está revolucionando o campo. Sensores inteligentes, monitoramento em tempo real e automação de processos agrícolas.',
        categoria: 2,
        usuario: 2,
        imagem: 'https://exemplo.com/imagens/iot-agricultura.jpg'
      }
    ];
    
    for (const post of posts) {
      try {
        await executeQuery(`
          INSERT INTO Post (nomePost, descricao, idCategoria, dataPost, idUsuario, imagemPost)
          VALUES (@nomePost, @descricao, @idCategoria, @dataPost, @idUsuario, @imagemPost)
        `, {
          nomePost: post.nome,
          descricao: post.descricao,
          idCategoria: post.categoria,
          dataPost: new Date(),
          idUsuario: post.usuario,
          imagemPost: post.imagem
        });
        console.log(`✅ Post inserido: ${post.nome}`);
      } catch (error) {
        console.log(`⚠️  Erro ao inserir post: ${post.nome} - ${error.message}`);
      }
    }
    
    // 4. Inserir Vídeos
    console.log('\n🎥 Inserindo vídeos...');
    const videos = [
      {
        nome: 'Como Fazer Compostagem',
        urlArquivo: 'https://exemplo.com/videos/compostagem.mp4',
        urlExterno: null,
        descricao: 'Tutorial completo sobre como fazer compostagem caseira para adubar suas plantas de forma natural e sustentável.',
        usuario: 1,
        categoria: 1
      },
      {
        nome: 'Drones na Agricultura',
        urlArquivo: null,
        urlExterno: 'https://youtube.com/watch?v=exemplo-drones',
        descricao: 'Veja como os drones estão sendo utilizados para monitoramento de plantações, pulverização precisa e mapeamento de áreas agrícolas.',
        usuario: 2,
        categoria: 2
      }
    ];
    
    for (const video of videos) {
      try {
        await executeQuery(`
          INSERT INTO Video (nomeVideo, urlArquivo, urlExterno, descricao, idUsuario, dataUpload, idCategoria)
          VALUES (@nomeVideo, @urlArquivo, @urlExterno, @descricao, @idUsuario, @dataUpload, @idCategoria)
        `, {
          nomeVideo: video.nome,
          urlArquivo: video.urlArquivo,
          urlExterno: video.urlExterno,
          descricao: video.descricao,
          idUsuario: video.usuario,
          dataUpload: new Date(),
          idCategoria: video.categoria
        });
        console.log(`✅ Vídeo inserido: ${video.nome}`);
      } catch (error) {
        console.log(`⚠️  Erro ao inserir vídeo: ${video.nome} - ${error.message}`);
      }
    }
    
    console.log('\n🎉 Dados simulados inseridos com sucesso!');
    
    // Mostrar resumo
    console.log('\n📊 Resumo dos dados inseridos:');
    const tables = ['Usuario', 'Categoria', 'Post', 'Video'];
    
    for (const table of tables) {
      try {
        const result = await executeQuery(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`- ${table}: ${result.recordset[0].count} registros`);
      } catch (error) {
        console.log(`- ${table}: Erro ao contar registros`);
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

insertSampleData();
