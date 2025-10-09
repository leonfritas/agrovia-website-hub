const Post = require('../models/Post');

// Instanciar o modelo Post
const postModel = new Post();

// Obter todos os posts
const getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, orderBy = 'dataPost', order = 'DESC' } = req.query;
    const offset = (page - 1) * limit;

    const posts = await postModel.findAllWithDetails({
      limit: parseInt(limit),
      offset,
      orderBy,
      order
    });

    const total = await postModel.count();

    res.json({
      posts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Erro ao obter posts:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível obter os posts'
    });
  }
};

// Obter post por ID
const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await postModel.findById(id);

    if (!post) {
      return res.status(404).json({
        error: 'Post não encontrado',
        message: 'Post não existe'
      });
    }

    res.json({ post });
  } catch (error) {
    console.error('Erro ao obter post:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível obter o post'
    });
  }
};

// Criar novo post
const createPost = async (req, res) => {
  try {
    const { nomePost, descricao, conteudo, idCategoria, idUsuario, linkExterno } = req.body;

    console.log('📝 Criando novo post');
    console.log('📦 Body recebido:', req.body);
    console.log('🖼️ Arquivos recebidos:', req.files);

    // Validações
    if (!nomePost || !descricao || !idCategoria || !idUsuario) {
      console.log('❌ Validação falhou - campos obrigatórios faltando');
      return res.status(400).json({
        error: 'Dados obrigatórios',
        message: 'Nome, descrição, categoria e usuário são obrigatórios'
      });
    }

    if (nomePost.length < 3) {
      return res.status(400).json({
        error: 'Nome inválido',
        message: 'Nome do post deve ter pelo menos 3 caracteres'
      });
    }

    if (descricao.length < 10) {
      return res.status(400).json({
        error: 'Descrição inválida',
        message: 'Descrição deve ter pelo menos 10 caracteres'
      });
    }

    // Obter caminhos das imagens enviadas
    const imagemDestaque = req.files?.imagemDestaque ? `/uploads/${req.files.imagemDestaque[0].filename}` : null;
    const imagemConteudo = req.files?.imagemConteudo ? `/uploads/${req.files.imagemConteudo[0].filename}` : null;

    console.log('🖼️ Imagem de destaque:', imagemDestaque);
    console.log('🖼️ Imagem de conteúdo:', imagemConteudo);

    const postData = {
      nomePost,
      descricao,
      conteudo,
      idCategoria: parseInt(idCategoria),
      idUsuario: parseInt(idUsuario),
      imagemPost: null, // Não usado mais
      imagemDestaque,
      imagemConteudo,
      linkExterno
    };

    console.log('📋 Dados para criar:', postData);

    const post = await postModel.create(postData);

    console.log('✅ Post criado com sucesso:', post);

    res.status(201).json({
      message: 'Post criado com sucesso',
      post
    });
  } catch (error) {
    console.error('❌ Erro ao criar post:', error);
    console.error('❌ Stack trace:', error.stack);
    console.error('❌ Mensagem:', error.message);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message || 'Não foi possível criar o post',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Atualizar post
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { nomePost, descricao, conteudo, idCategoria, idUsuario, linkExterno } = req.body;

    console.log('📝 Atualizando post ID:', id);
    console.log('📦 Body recebido:', req.body);
    console.log('🖼️ Arquivos recebidos:', req.files);

    // Validações
    if (nomePost && nomePost.length < 3) {
      return res.status(400).json({
        error: 'Nome inválido',
        message: 'Nome do post deve ter pelo menos 3 caracteres'
      });
    }

    if (descricao && descricao.length < 10) {
      return res.status(400).json({
        error: 'Descrição inválida',
        message: 'Descrição deve ter pelo menos 10 caracteres'
      });
    }

    const updateData = {};
    if (nomePost) updateData.nomePost = nomePost;
    if (descricao) updateData.descricao = descricao;
    if (conteudo !== undefined) updateData.conteudo = conteudo;
    if (idCategoria) updateData.idCategoria = parseInt(idCategoria);
    if (idUsuario) updateData.idUsuario = parseInt(idUsuario);
    if (linkExterno !== undefined) updateData.linkExterno = linkExterno;
    // Não atualizar dataPost - manter a data original
    
    // Atualizar imagens se foram enviadas
    if (req.files?.imagemDestaque) {
      updateData.imagemDestaque = `/uploads/${req.files.imagemDestaque[0].filename}`;
      console.log('✅ Imagem de destaque:', updateData.imagemDestaque);
    }
    if (req.files?.imagemConteudo) {
      updateData.imagemConteudo = `/uploads/${req.files.imagemConteudo[0].filename}`;
      console.log('✅ Imagem de conteúdo:', updateData.imagemConteudo);
    }

    console.log('📋 Dados para atualizar:', updateData);

    const post = await postModel.update(id, updateData);

    if (!post) {
      return res.status(404).json({
        error: 'Post não encontrado',
        message: 'Post não existe'
      });
    }

    console.log('✅ Post atualizado com sucesso');

    res.json({
      message: 'Post atualizado com sucesso',
      post
    });
  } catch (error) {
    console.error('❌ Erro ao atualizar post:', error);
    console.error('❌ Stack trace:', error.stack);
    console.error('❌ Mensagem:', error.message);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message || 'Não foi possível atualizar o post',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Deletar post
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await postModel.delete(id);

    if (!deleted) {
      return res.status(404).json({
        error: 'Post não encontrado',
        message: 'Post não existe'
      });
    }

    res.json({
      message: 'Post deletado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar post:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível deletar o post'
    });
  }
};

// Obter posts por categoria
const getPostsByCategoria = async (req, res) => {
  try {
    const { idCategoria } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const posts = await postModel.findByCategoria(idCategoria, {
      limit: parseInt(limit),
      offset
    });

    res.json({ posts });
  } catch (error) {
    console.error('Erro ao obter posts por categoria:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível obter os posts'
    });
  }
};

// Obter posts por nome da categoria (seção)
const getPostsByCategoriaName = async (req, res) => {
  try {
    const { nomeCategoria } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const query = `
      SELECT p.*, c.nomeCategoria, u.nomeUsuario
      FROM Post p
      INNER JOIN Categoria c ON p.idCategoria = c.idCategoria
      INNER JOIN Usuario u ON p.idUsuario = u.idUsuario
      WHERE c.nomeCategoria = @nomeCategoria
      ORDER BY p.dataPost DESC
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `;
    
    const result = await postModel.executeQuery(query, { 
      nomeCategoria, 
      offset, 
      limit 
    });

    res.json({ posts: result.recordset });
  } catch (error) {
    console.error('Erro ao obter posts por nome da categoria:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível obter os posts'
    });
  }
};

// Obter posts por usuário
const getPostsByUsuario = async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const posts = await postModel.findByUsuario(idUsuario, {
      limit: parseInt(limit),
      offset
    });

    res.json({ posts });
  } catch (error) {
    console.error('Erro ao obter posts por usuário:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível obter os posts'
    });
  }
};

// Buscar posts
const searchPosts = async (req, res) => {
  try {
    const { q } = req.query;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    if (!q) {
      return res.status(400).json({
        error: 'Parâmetro obrigatório',
        message: 'Parâmetro de busca (q) é obrigatório'
      });
    }

    const posts = await postModel.search(q, {
      limit: parseInt(limit),
      offset
    });

    res.json({ posts });
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível buscar os posts'
    });
  }
};

// Obter posts recentes
const getRecentPosts = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const posts = await postModel.findRecent(parseInt(limit));

    res.json({ posts });
  } catch (error) {
    console.error('Erro ao obter posts recentes:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível obter os posts recentes'
    });
  }
};

// Obter estatísticas de posts
const getPostStats = async (req, res) => {
  try {
    const stats = await postModel.getStats();

    res.json({ stats });
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível obter as estatísticas'
    });
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getPostsByCategoria,
  getPostsByCategoriaName,
  getPostsByUsuario,
  searchPosts,
  getRecentPosts,
  getPostStats
};



