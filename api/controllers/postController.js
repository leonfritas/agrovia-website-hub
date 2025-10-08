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
    const { nomePost, descricao, idCategoria, idUsuario, imagemPost, linkExterno } = req.body;

    // Validações
    if (!nomePost || !descricao || !idCategoria || !idUsuario) {
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

    const post = await postModel.create({
      nomePost,
      descricao,
      idCategoria: parseInt(idCategoria),
      idUsuario: parseInt(idUsuario),
      imagemPost,
      linkExterno
    });

    res.status(201).json({
      message: 'Post criado com sucesso',
      post
    });
  } catch (error) {
    console.error('Erro ao criar post:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível criar o post'
    });
  }
};

// Atualizar post
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { nomePost, descricao, idCategoria, idUsuario, imagemPost, linkExterno } = req.body;

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
    if (idCategoria) updateData.idCategoria = parseInt(idCategoria);
    if (idUsuario) updateData.idUsuario = parseInt(idUsuario);
    if (imagemPost !== undefined) updateData.imagemPost = imagemPost;
    if (linkExterno !== undefined) updateData.linkExterno = linkExterno;

    const post = await postModel.update(id, updateData);

    if (!post) {
      return res.status(404).json({
        error: 'Post não encontrado',
        message: 'Post não existe'
      });
    }

    res.json({
      message: 'Post atualizado com sucesso',
      post
    });
  } catch (error) {
    console.error('Erro ao atualizar post:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível atualizar o post'
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
  getPostsByUsuario,
  searchPosts,
  getRecentPosts,
  getPostStats
};



