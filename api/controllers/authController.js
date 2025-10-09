const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validateEmail } = require('../utils/validation');

// Registro de usuário
const register = async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;

    // Validações
    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Dados obrigatórios',
        message: 'Nome, email e senha são obrigatórios'
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        error: 'Email inválido',
        message: 'Por favor, forneça um email válido'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Senha muito curta',
        message: 'A senha deve ter pelo menos 6 caracteres'
      });
    }

    // Verificar se usuário já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        error: 'Usuário já existe',
        message: 'Já existe um usuário com este email'
      });
    }

    // Hash da senha
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Criar usuário
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    await user.save();

    // Gerar token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      },
      token
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível criar o usuário'
    });
  }
};

// Login de usuário
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validações
    if (!email || !password) {
      return res.status(400).json({
        error: 'Dados obrigatórios',
        message: 'Email e senha são obrigatórios'
      });
    }

    // Buscar usuário
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        error: 'Credenciais inválidas',
        message: 'Email ou senha incorretos'
      });
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Credenciais inválidas',
        message: 'Email ou senha incorretos'
      });
    }

    // Gerar token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login realizado com sucesso',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: new Date()
      },
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

// Logout
const logout = async (req, res) => {
  try {
    // Em uma implementação mais robusta, você poderia adicionar o token a uma blacklist
    res.json({
      message: 'Logout realizado com sucesso'
    });
  } catch (error) {
    console.error('Erro no logout:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível fazer logout'
    });
  }
};

// Obter perfil do usuário
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({
        error: 'Usuário não encontrado',
        message: 'Usuário não existe'
      });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Erro ao obter perfil:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível obter o perfil'
    });
  }
};

// Atualizar perfil do usuário
const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.user.userId;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) {
      if (!validateEmail(email)) {
        return res.status(400).json({
          error: 'Email inválido',
          message: 'Por favor, forneça um email válido'
        });
      }
      updateData.email = email;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        error: 'Usuário não encontrado',
        message: 'Usuário não existe'
      });
    }

    res.json({
      message: 'Perfil atualizado com sucesso',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível atualizar o perfil'
    });
  }
};

// Esqueci minha senha
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: 'Email obrigatório',
        message: 'Por favor, forneça seu email'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Por segurança, não revelar se o email existe ou não
      return res.json({
        message: 'Se o email existir, você receberá instruções para redefinir sua senha'
      });
    }

    // Gerar token de reset
    const resetToken = jwt.sign(
      { userId: user._id, type: 'password_reset' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Aqui você implementaria o envio de email
    // Por enquanto, apenas retornamos o token (em produção, não faça isso)
    res.json({
      message: 'Token de reset gerado',
      resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
    });
  } catch (error) {
    console.error('Erro ao solicitar reset de senha:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível processar a solicitação'
    });
  }
};

// Redefinir senha
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        error: 'Dados obrigatórios',
        message: 'Token e nova senha são obrigatórios'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: 'Senha muito curta',
        message: 'A senha deve ter pelo menos 6 caracteres'
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== 'password_reset') {
      return res.status(400).json({
        error: 'Token inválido',
        message: 'Token de reset inválido'
      });
    }

    // Buscar usuário
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        error: 'Usuário não encontrado',
        message: 'Usuário não existe'
      });
    }

    // Hash da nova senha
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Atualizar senha
    user.password = hashedPassword;
    await user.save();

    res.json({
      message: 'Senha redefinida com sucesso'
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({
        error: 'Token inválido',
        message: 'Token de reset inválido ou expirado'
      });
    }
    console.error('Erro ao redefinir senha:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível redefinir a senha'
    });
  }
};

// Refresh token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        error: 'Token obrigatório',
        message: 'Refresh token é obrigatório'
      });
    }

    // Verificar refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    
    // Buscar usuário
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        error: 'Usuário não encontrado',
        message: 'Usuário não existe'
      });
    }

    // Gerar novo token
    const newToken = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Token renovado com sucesso',
      token: newToken
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({
        error: 'Token inválido',
        message: 'Refresh token inválido ou expirado'
      });
    }
    console.error('Erro ao renovar token:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível renovar o token'
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
  refreshToken
};




