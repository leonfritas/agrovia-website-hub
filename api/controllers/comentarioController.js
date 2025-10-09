const Comentario = require('../models/Comentario');
const { shouldAutoApprove, moderateContent } = require('../utils/contentModeration');

// Instanciar o modelo Comentario
const comentarioModel = new Comentario();

// Criar novo comentário
const createComentario = async (req, res) => {
  try {
    const { idPost, nomeAutor, textoComentario } = req.body;

    // Validações
    if (!idPost || !nomeAutor || !textoComentario) {
      return res.status(400).json({
        error: 'Dados obrigatórios',
        message: 'Post, nome do autor e texto são obrigatórios'
      });
    }

    if (nomeAutor.length < 2) {
      return res.status(400).json({
        error: 'Nome inválido',
        message: 'Nome deve ter pelo menos 2 caracteres'
      });
    }

    if (textoComentario.length < 5) {
      return res.status(400).json({
        error: 'Comentário inválido',
        message: 'Comentário deve ter pelo menos 5 caracteres'
      });
    }

    if (textoComentario.length > 1000) {
      return res.status(400).json({
        error: 'Comentário muito longo',
        message: 'Comentário deve ter no máximo 1000 caracteres'
      });
    }

    // Moderação automática
    const moderationResult = shouldAutoApprove(textoComentario, nomeAutor);
    
    const comentarioData = {
      idPost: parseInt(idPost),
      nomeAutor: nomeAutor.trim(),
      textoComentario: textoComentario.trim(),
      aprovado: moderationResult.autoApprove,
      moderado: moderationResult.autoApprove,
      motivoRejeicao: moderationResult.autoApprove ? null : moderationResult.reason
    };

    const comentario = await comentarioModel.create(comentarioData);

    // Resposta diferente se aprovado automaticamente ou pendente
    if (moderationResult.autoApprove) {
      res.status(201).json({
        message: 'Comentário publicado com sucesso',
        comentario,
        status: 'aprovado'
      });
    } else {
      res.status(201).json({
        message: 'Comentário enviado para moderação',
        comentario: {
          ...comentario,
          textoComentario: undefined // Não retornar o texto para comentários pendentes
        },
        status: 'pendente',
        motivo: moderationResult.reason
      });
    }
  } catch (error) {
    console.error('Erro ao criar comentário:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível criar o comentário'
    });
  }
};

// Obter comentários de um post (apenas aprovados)
const getComentariosByPost = async (req, res) => {
  try {
    const { idPost } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const comentarios = await comentarioModel.findByPost(parseInt(idPost), {
      limit: parseInt(limit),
      offset,
      apenasAprovados: true
    });

    const total = await comentarioModel.countByPost(parseInt(idPost), true);

    res.json({
      comentarios,
      total,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Erro ao obter comentários:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível obter os comentários'
    });
  }
};

// Obter comentários pendentes de moderação (admin)
const getPendingComentarios = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const comentarios = await comentarioModel.findPendingModeration({
      limit: parseInt(limit),
      offset
    });

    res.json({
      comentarios,
      total: comentarios.length
    });
  } catch (error) {
    console.error('Erro ao obter comentários pendentes:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível obter os comentários pendentes'
    });
  }
};

// Aprovar comentário (admin)
const approveComentario = async (req, res) => {
  try {
    const { id } = req.params;

    const comentario = await comentarioModel.approve(parseInt(id));

    if (!comentario) {
      return res.status(404).json({
        error: 'Comentário não encontrado',
        message: 'Comentário não existe'
      });
    }

    res.json({
      message: 'Comentário aprovado com sucesso',
      comentario
    });
  } catch (error) {
    console.error('Erro ao aprovar comentário:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível aprovar o comentário'
    });
  }
};

// Rejeitar comentário (admin)
const rejectComentario = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo } = req.body;

    if (!motivo) {
      return res.status(400).json({
        error: 'Motivo obrigatório',
        message: 'É necessário informar o motivo da rejeição'
      });
    }

    const comentario = await comentarioModel.reject(parseInt(id), motivo);

    if (!comentario) {
      return res.status(404).json({
        error: 'Comentário não encontrado',
        message: 'Comentário não existe'
      });
    }

    res.json({
      message: 'Comentário rejeitado com sucesso',
      comentario
    });
  } catch (error) {
    console.error('Erro ao rejeitar comentário:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível rejeitar o comentário'
    });
  }
};

// Deletar comentário (admin)
const deleteComentario = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await comentarioModel.delete(parseInt(id));

    if (!deleted) {
      return res.status(404).json({
        error: 'Comentário não encontrado',
        message: 'Comentário não existe'
      });
    }

    res.json({
      message: 'Comentário deletado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar comentário:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível deletar o comentário'
    });
  }
};

// Testar moderação de conteúdo (admin/desenvolvimento)
const testModeration = async (req, res) => {
  try {
    const { texto, autor } = req.body;

    if (!texto) {
      return res.status(400).json({
        error: 'Texto obrigatório',
        message: 'É necessário informar um texto para testar'
      });
    }

    const moderationResult = shouldAutoApprove(texto, autor || 'Teste');

    res.json({
      texto,
      autor: autor || 'Teste',
      resultado: moderationResult
    });
  } catch (error) {
    console.error('Erro ao testar moderação:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível testar a moderação'
    });
  }
};

module.exports = {
  createComentario,
  getComentariosByPost,
  getPendingComentarios,
  approveComentario,
  rejectComentario,
  deleteComentario,
  testModeration
};
