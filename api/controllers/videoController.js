const Video = require('../models/Video');

// Instanciar o modelo Video
const videoModel = new Video();

// Obter todos os vídeos
const getAllVideos = async (req, res) => {
  try {
    const { page = 1, limit = 10, orderBy = 'dataUpload', order = 'DESC' } = req.query;
    const offset = (page - 1) * limit;

    const videos = await videoModel.findAllWithDetails({
      limit: parseInt(limit),
      offset,
      orderBy,
      order
    });

    const total = await videoModel.count();

    res.json({
      videos,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalVideos: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Erro ao obter vídeos:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível obter os vídeos'
    });
  }
};

// Obter vídeo por ID
const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await videoModel.findById(id);

    if (!video) {
      return res.status(404).json({
        error: 'Vídeo não encontrado',
        message: 'Vídeo não existe'
      });
    }

    res.json({ video });
  } catch (error) {
    console.error('Erro ao obter vídeo:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível obter o vídeo'
    });
  }
};

// Criar novo vídeo
const createVideo = async (req, res) => {
  try {
    const { nopmeVideo, urlArquivo, urlExterno, descricao, idUsuario, idCategoria } = req.body;

    // Validações
    if (!nopmeVideo || !idUsuario || !idCategoria) {
      return res.status(400).json({
        error: 'Dados obrigatórios',
        message: 'Nome do vídeo, usuário e categoria são obrigatórios'
      });
    }

    if (nopmeVideo.length < 3) {
      return res.status(400).json({
        error: 'Nome inválido',
        message: 'Nome do vídeo deve ter pelo menos 3 caracteres'
      });
    }

    if (!urlArquivo && !urlExterno) {
      return res.status(400).json({
        error: 'URL obrigatória',
        message: 'Pelo menos uma URL (arquivo ou externa) deve ser fornecida'
      });
    }

    const video = await videoModel.create({
      nopmeVideo,
      urlArquivo,
      urlExterno,
      descricao,
      idUsuario: parseInt(idUsuario),
      idCategoria: parseInt(idCategoria)
    });

    res.status(201).json({
      message: 'Vídeo criado com sucesso',
      video
    });
  } catch (error) {
    console.error('Erro ao criar vídeo:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível criar o vídeo'
    });
  }
};

// Atualizar vídeo
const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { nopmeVideo, urlArquivo, urlExterno, descricao, idUsuario, idCategoria } = req.body;

    // Validações
    if (nopmeVideo && nopmeVideo.length < 3) {
      return res.status(400).json({
        error: 'Nome inválido',
        message: 'Nome do vídeo deve ter pelo menos 3 caracteres'
      });
    }

    const updateData = {};
    if (nopmeVideo) updateData.nopmeVideo = nopmeVideo;
    if (urlArquivo !== undefined) updateData.urlArquivo = urlArquivo;
    if (urlExterno !== undefined) updateData.urlExterno = urlExterno;
    if (descricao !== undefined) updateData.descricao = descricao;
    if (idUsuario) updateData.idUsuario = parseInt(idUsuario);
    if (idCategoria) updateData.idCategoria = parseInt(idCategoria);

    const video = await videoModel.update(id, updateData);

    if (!video) {
      return res.status(404).json({
        error: 'Vídeo não encontrado',
        message: 'Vídeo não existe'
      });
    }

    res.json({
      message: 'Vídeo atualizado com sucesso',
      video
    });
  } catch (error) {
    console.error('Erro ao atualizar vídeo:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível atualizar o vídeo'
    });
  }
};

// Deletar vídeo
const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await videoModel.delete(id);

    if (!deleted) {
      return res.status(404).json({
        error: 'Vídeo não encontrado',
        message: 'Vídeo não existe'
      });
    }

    res.json({
      message: 'Vídeo deletado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar vídeo:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível deletar o vídeo'
    });
  }
};

// Obter vídeos por categoria
const getVideosByCategoria = async (req, res) => {
  try {
    const { idCategoria } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const videos = await videoModel.findByCategoria(idCategoria, {
      limit: parseInt(limit),
      offset
    });

    res.json({ videos });
  } catch (error) {
    console.error('Erro ao obter vídeos por categoria:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível obter os vídeos'
    });
  }
};

// Obter vídeos por usuário
const getVideosByUsuario = async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const videos = await videoModel.findByUsuario(idUsuario, {
      limit: parseInt(limit),
      offset
    });

    res.json({ videos });
  } catch (error) {
    console.error('Erro ao obter vídeos por usuário:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível obter os vídeos'
    });
  }
};

// Buscar vídeos
const searchVideos = async (req, res) => {
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

    const videos = await videoModel.search(q, {
      limit: parseInt(limit),
      offset
    });

    res.json({ videos });
  } catch (error) {
    console.error('Erro ao buscar vídeos:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível buscar os vídeos'
    });
  }
};

// Obter vídeos recentes
const getRecentVideos = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const videos = await videoModel.findRecent(parseInt(limit));

    res.json({ videos });
  } catch (error) {
    console.error('Erro ao obter vídeos recentes:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível obter os vídeos recentes'
    });
  }
};

// Obter vídeos por tipo de URL
const getVideosByUrlType = async (req, res) => {
  try {
    const { type } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    if (!['arquivo', 'externo'].includes(type)) {
      return res.status(400).json({
        error: 'Tipo inválido',
        message: 'Tipo deve ser "arquivo" ou "externo"'
      });
    }

    const videos = await videoModel.findByUrlType(type, {
      limit: parseInt(limit),
      offset
    });

    res.json({ videos });
  } catch (error) {
    console.error('Erro ao obter vídeos por tipo:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível obter os vídeos'
    });
  }
};

// Obter vídeos por período
const getVideosByDateRange = async (req, res) => {
  try {
    const { dataInicio, dataFim } = req.query;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    if (!dataInicio || !dataFim) {
      return res.status(400).json({
        error: 'Parâmetros obrigatórios',
        message: 'Data de início e data de fim são obrigatórias'
      });
    }

    const videos = await videoModel.findByDateRange(dataInicio, dataFim, {
      limit: parseInt(limit),
      offset
    });

    res.json({ videos });
  } catch (error) {
    console.error('Erro ao obter vídeos por período:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível obter os vídeos'
    });
  }
};

// Obter estatísticas de vídeos
const getVideoStats = async (req, res) => {
  try {
    const stats = await videoModel.getStats();

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
  getAllVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
  getVideosByCategoria,
  getVideosByUsuario,
  searchVideos,
  getRecentVideos,
  getVideosByUrlType,
  getVideosByDateRange,
  getVideoStats
};



