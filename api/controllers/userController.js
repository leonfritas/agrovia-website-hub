const User = require('../models/User');

// Obter todos os usuários (apenas admin)
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.json({
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
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
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    // Usuários só podem ver seu próprio perfil, exceto admins
    if (id !== userId && userRole !== 'admin') {
      return res.status(403).json({
        error: 'Acesso negado',
        message: 'Você só pode ver seu próprio perfil'
      });
    }

    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({
        error: 'Usuário não encontrado',
        message: 'Usuário não existe'
      });
    }

    res.json({ user });
  } catch (error) {
    console.error('Erro ao obter usuário:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível obter o usuário'
    });
  }
};

// Atualizar usuário
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;
    const { name, email, role } = req.body;

    // Usuários só podem atualizar seu próprio perfil, exceto admins
    if (id !== userId && userRole !== 'admin') {
      return res.status(403).json({
        error: 'Acesso negado',
        message: 'Você só pode atualizar seu próprio perfil'
      });
    }

    // Apenas admins podem alterar roles
    if (role && userRole !== 'admin') {
      return res.status(403).json({
        error: 'Acesso negado',
        message: 'Apenas administradores podem alterar roles'
      });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role && userRole === 'admin') updateData.role = role;

    const user = await User.findByIdAndUpdate(
      id,
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
      message: 'Usuário atualizado com sucesso',
      user
    });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível atualizar o usuário'
    });
  }
};

// Deletar usuário (apenas admin)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Não permitir que usuário delete a si mesmo
    if (id === userId) {
      return res.status(400).json({
        error: 'Ação inválida',
        message: 'Você não pode deletar sua própria conta'
      });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
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

// Estatísticas de usuários (apenas admin)
const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalRegularUsers = await User.countDocuments({ role: 'user' });
    
    // Usuários criados nos últimos 30 dias
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newUsersLast30Days = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Usuários criados nos últimos 7 dias
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newUsersLast7Days = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    res.json({
      overview: {
        totalUsers,
        totalAdmins,
        totalRegularUsers,
        newUsersLast30Days,
        newUsersLast7Days
      }
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível obter as estatísticas'
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats
};



