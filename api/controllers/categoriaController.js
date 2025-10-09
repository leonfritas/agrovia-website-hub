const Categoria = require('../models/Categoria');

// Instanciar o modelo Categoria
const categoriaModel = new Categoria();

// Obter todas as categorias
const getAllCategorias = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    let categorias;
    if (search) {
      categorias = await categoriaModel.findByName(search);
    } else {
      categorias = await categoriaModel.findAll({ limit: parseInt(limit), offset });
    }

    const total = await categoriaModel.count();

    res.json({
      categorias,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalCategorias: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Erro ao obter categorias:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível obter as categorias'
    });
  }
};

// Obter categoria por ID
const getCategoriaById = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await categoriaModel.findById(id);

    if (!categoria) {
      return res.status(404).json({
        error: 'Categoria não encontrada',
        message: 'Categoria não existe'
      });
    }

    res.json({ categoria });
  } catch (error) {
    console.error('Erro ao obter categoria:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível obter a categoria'
    });
  }
};

// Criar nova categoria
const createCategoria = async (req, res) => {
  try {
    const { nomeCategoria } = req.body;

    // Validações
    if (!nomeCategoria) {
      return res.status(400).json({
        error: 'Dados obrigatórios',
        message: 'Nome da categoria é obrigatório'
      });
    }

    if (nomeCategoria.length < 2) {
      return res.status(400).json({
        error: 'Nome inválido',
        message: 'Nome da categoria deve ter pelo menos 2 caracteres'
      });
    }

    const categoria = await categoriaModel.create({ nomeCategoria });

    res.status(201).json({
      message: 'Categoria criada com sucesso',
      categoria
    });
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível criar a categoria'
    });
  }
};

// Atualizar categoria
const updateCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nomeCategoria } = req.body;

    // Validações
    if (!nomeCategoria) {
      return res.status(400).json({
        error: 'Dados obrigatórios',
        message: 'Nome da categoria é obrigatório'
      });
    }

    if (nomeCategoria.length < 2) {
      return res.status(400).json({
        error: 'Nome inválido',
        message: 'Nome da categoria deve ter pelo menos 2 caracteres'
      });
    }

    const categoria = await categoriaModel.update(id, { nomeCategoria });

    if (!categoria) {
      return res.status(404).json({
        error: 'Categoria não encontrada',
        message: 'Categoria não existe'
      });
    }

    res.json({
      message: 'Categoria atualizada com sucesso',
      categoria
    });
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível atualizar a categoria'
    });
  }
};

// Deletar categoria
const deleteCategoria = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se categoria pode ser deletada
    const canDelete = await categoriaModel.canDelete(id);
    if (!canDelete) {
      return res.status(400).json({
        error: 'Não é possível deletar',
        message: 'Esta categoria possui posts associados e não pode ser deletada'
      });
    }

    const deleted = await categoriaModel.delete(id);

    if (!deleted) {
      return res.status(404).json({
        error: 'Categoria não encontrada',
        message: 'Categoria não existe'
      });
    }

    res.json({
      message: 'Categoria deletada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível deletar a categoria'
    });
  }
};

// Obter categorias com posts
const getCategoriasWithPosts = async (req, res) => {
  try {
    const categorias = await categoriaModel.findWithPosts();

    res.json({ categorias });
  } catch (error) {
    console.error('Erro ao obter categorias com posts:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível obter as categorias'
    });
  }
};

// Buscar categorias por nome
const searchCategorias = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        error: 'Parâmetro obrigatório',
        message: 'Parâmetro de busca (q) é obrigatório'
      });
    }

    const categorias = await categoriaModel.findByName(q);

    res.json({ categorias });
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível buscar as categorias'
    });
  }
};

// Obter todas as categorias (seções) para o frontend
const getAllCategoriasForSite = async (req, res) => {
  try {
    const categorias = await categoriaModel.findAll();
    res.json({ categorias });
  } catch (error) {
    console.error('Erro ao obter categorias para o site:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível obter as categorias'
    });
  }
};

module.exports = {
  getAllCategorias,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria,
  getCategoriasWithPosts,
  searchCategorias,
  getAllCategoriasForSite
};



