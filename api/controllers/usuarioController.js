const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

// Instanciar o modelo Usuario
const usuarioModel = new Usuario();

// Obter todos os usuários
const getAllUsuarios = async (req, res) => {
  try {
    const { page = 1, limit = 10, type } = req.query;
    const offset = (page - 1) * limit;

    let usuarios;
    if (type === 'admins') {
      usuarios = await usuarioModel.findAdmins();
    } else if (type === 'regular') {
      usuarios = await usuarioModel.findRegularUsers();
    } else if (type === 'withStats') {
      usuarios = await usuarioModel.findWithStats();
    } else {
      usuarios = await usuarioModel.findAll({ limit: parseInt(limit), offset });
    }

    const total = await usuarioModel.count();

    res.json({
      usuarios,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalUsuarios: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Erro ao obter usuários:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível obter os usuários'
    });
  }
};

// Obter usuário por ID
const getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await usuarioModel.findById(id);

    if (!usuario) {
      return res.status(404).json({
        error: 'Usuário não encontrado',
        message: 'Usuário não existe'
      });
    }

    // Remover senha da resposta
    const { senhaUsuario, ...usuarioWithoutPassword } = usuario;

    res.json({ usuario: usuarioWithoutPassword });
  } catch (error) {
    console.error('Erro ao obter usuário:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível obter o usuário'
    });
  }
};

// Criar novo usuário
const createUsuario = async (req, res) => {
  try {
    const { nomeUsuario, senhaUsuario, ativoAdm = false } = req.body;

    // Validações
    if (!nomeUsuario || !senhaUsuario) {
      return res.status(400).json({
        error: 'Dados obrigatórios',
        message: 'Nome de usuário e senha são obrigatórios'
      });
    }

    if (nomeUsuario.length < 3) {
      return res.status(400).json({
        error: 'Nome inválido',
        message: 'Nome de usuário deve ter pelo menos 3 caracteres'
      });
    }

    if (senhaUsuario.length < 6) {
      return res.status(400).json({
        error: 'Senha inválida',
        message: 'Senha deve ter pelo menos 6 caracteres'
      });
    }

    const usuario = await usuarioModel.create({
      nomeUsuario,
      senhaUsuario,
      ativoAdm: Boolean(ativoAdm)
    });

    // Remover senha da resposta
    const { senhaUsuario: _, ...usuarioWithoutPassword } = usuario;

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      usuario: usuarioWithoutPassword
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível criar o usuário'
    });
  }
};

// Atualizar usuário
const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nomeUsuario, senhaUsuario, ativoAdm } = req.body;

    // Validações
    if (nomeUsuario && nomeUsuario.length < 3) {
      return res.status(400).json({
        error: 'Nome inválido',
        message: 'Nome de usuário deve ter pelo menos 3 caracteres'
      });
    }

    if (senhaUsuario && senhaUsuario.length < 6) {
      return res.status(400).json({
        error: 'Senha inválida',
        message: 'Senha deve ter pelo menos 6 caracteres'
      });
    }

    const updateData = {};
    if (nomeUsuario) updateData.nomeUsuario = nomeUsuario;
    if (senhaUsuario) updateData.senhaUsuario = senhaUsuario;
    if (ativoAdm !== undefined) updateData.ativoAdm = Boolean(ativoAdm);

    const usuario = await usuarioModel.update(id, updateData);

    if (!usuario) {
      return res.status(404).json({
        error: 'Usuário não encontrado',
        message: 'Usuário não existe'
      });
    }

    // Remover senha da resposta
    const { senhaUsuario: _, ...usuarioWithoutPassword } = usuario;

    res.json({
      message: 'Usuário atualizado com sucesso',
      usuario: usuarioWithoutPassword
    });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível atualizar o usuário'
    });
  }
};

// Deletar usuário
const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se usuário pode ser deletado
    const canDelete = await usuarioModel.canDelete(id);
    if (!canDelete) {
      return res.status(400).json({
        error: 'Não é possível deletar',
        message: 'Este usuário possui posts ou vídeos associados e não pode ser deletado'
      });
    }

    const deleted = await usuarioModel.delete(id);

    if (!deleted) {
      return res.status(404).json({
        error: 'Usuário não encontrado',
        message: 'Usuário não existe'
      });
    }

    res.json({
      message: 'Usuário deletado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível deletar o usuário'
    });
  }
};

// Login de usuário
const loginUsuario = async (req, res) => {
  try {
    const { nomeUsuario, senhaUsuario } = req.body;

    // Validações
    if (!nomeUsuario || !senhaUsuario) {
      return res.status(400).json({
        error: 'Dados obrigatórios',
        message: 'Nome de usuário e senha são obrigatórios'
      });
    }

    const usuario = await usuarioModel.authenticate(nomeUsuario, senhaUsuario);

    if (!usuario) {
      return res.status(401).json({
        error: 'Credenciais inválidas',
        message: 'Nome de usuário ou senha incorretos'
      });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { 
        userId: usuario.idUsuario, 
        nomeUsuario: usuario.nomeUsuario, 
        ativoAdm: usuario.ativoAdm 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login realizado com sucesso',
      usuario,
      token
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível fazer login'
    });
  }
};

// Alterar senha
const changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        error: 'Dados obrigatórios',
        message: 'Nova senha é obrigatória'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: 'Senha inválida',
        message: 'Senha deve ter pelo menos 6 caracteres'
      });
    }

    const success = await usuarioModel.changePassword(id, newPassword);

    if (!success) {
      return res.status(404).json({
        error: 'Usuário não encontrado',
        message: 'Usuário não existe'
      });
    }

    res.json({
      message: 'Senha alterada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível alterar a senha'
    });
  }
};

// Toggle admin status
const toggleAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await usuarioModel.toggleAdmin(id);

    if (!usuario) {
      return res.status(404).json({
        error: 'Usuário não encontrado',
        message: 'Usuário não existe'
      });
    }

    // Remover senha da resposta
    const { senhaUsuario: _, ...usuarioWithoutPassword } = usuario;

    res.json({
      message: 'Status de admin alterado com sucesso',
      usuario: usuarioWithoutPassword
    });
  } catch (error) {
    console.error('Erro ao alterar status de admin:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível alterar o status de admin'
    });
  }
};

// Buscar usuários por nome
const searchUsuarios = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        error: 'Parâmetro obrigatório',
        message: 'Parâmetro de busca (q) é obrigatório'
      });
    }

    const usuarios = await usuarioModel.findByName(q);

    // Remover senhas das respostas
    const usuariosWithoutPasswords = usuarios.map(usuario => {
      const { senhaUsuario, ...usuarioWithoutPassword } = usuario;
      return usuarioWithoutPassword;
    });

    res.json({ usuarios: usuariosWithoutPasswords });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível buscar os usuários'
    });
  }
};

// Obter estatísticas de usuários
const getUsuarioStats = async (req, res) => {
  try {
    const stats = await usuarioModel.getStats();

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
  getAllUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  loginUsuario,
  changePassword,
  toggleAdmin,
  searchUsuarios,
  getUsuarioStats
};



