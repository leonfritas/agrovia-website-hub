const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Instanciar o modelo Usuario
const usuarioModel = new Usuario();

// Middleware de autenticação
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({
        error: 'Token não fornecido',
        message: 'Acesso negado. Token de autorização necessário.'
      });
    }

    // Verificar se o header está no formato "Bearer <token>"
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    if (!token) {
      return res.status(401).json({
        error: 'Token não fornecido',
        message: 'Acesso negado. Token de autorização necessário.'
      });
    }

    // Verificar e decodificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar usuário no banco de dados
    const user = await usuarioModel.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        error: 'Token inválido',
        message: 'Usuário não encontrado.'
      });
    }

    // Adicionar informações do usuário ao request
    req.user = {
      userId: user.idUsuario,
      nomeUsuario: user.nomeUsuario,
      ativoAdm: user.ativoAdm
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Token inválido',
        message: 'Token de autorização inválido.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expirado',
        message: 'Token de autorização expirado. Faça login novamente.'
      });
    }

    console.error('Erro na autenticação:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Erro ao verificar autenticação.'
    });
  }
};

module.exports = authMiddleware;
