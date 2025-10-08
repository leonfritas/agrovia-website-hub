// Middleware para verificar se o usuário é administrador
const adminMiddleware = (req, res, next) => {
  try {
    // Verificar se o usuário está autenticado
    if (!req.user) {
      return res.status(401).json({
        error: 'Não autenticado',
        message: 'Acesso negado. Faça login primeiro.'
      });
    }

    // Verificar se o usuário é administrador
    if (!req.user.ativoAdm) {
      return res.status(403).json({
        error: 'Acesso negado',
        message: 'Apenas administradores podem acessar este recurso.'
      });
    }

    next();
  } catch (error) {
    console.error('Erro no middleware de admin:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Erro ao verificar permissões de administrador.'
    });
  }
};

module.exports = adminMiddleware;
