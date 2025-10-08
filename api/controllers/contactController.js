const ContactMessage = require('../models/ContactMessage');
const { validateEmail } = require('../utils/validation');

// Enviar mensagem de contato
const sendMessage = async (req, res) => {
  try {
    const { name, email, subject, message, phone } = req.body;

    // Validações
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        error: 'Dados obrigatórios',
        message: 'Nome, email, assunto e mensagem são obrigatórios'
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        error: 'Email inválido',
        message: 'Por favor, forneça um email válido'
      });
    }

    // Criar mensagem
    const contactMessage = new ContactMessage({
      name,
      email,
      subject,
      message,
      phone: phone || null,
      status: 'pending'
    });

    await contactMessage.save();

    // Aqui você implementaria o envio de email de notificação
    // Por enquanto, apenas retornamos sucesso

    res.status(201).json({
      message: 'Mensagem enviada com sucesso',
      contactId: contactMessage._id
    });
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível enviar a mensagem'
    });
  }
};

// Obter todas as mensagens (apenas admin)
const getAllMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    const filter = {};
    if (status) {
      filter.status = status;
    }

    const messages = await ContactMessage.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ContactMessage.countDocuments(filter);

    res.json({
      messages,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalMessages: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Erro ao obter mensagens:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível obter as mensagens'
    });
  }
};

// Obter mensagem por ID (apenas admin)
const getMessageById = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await ContactMessage.findById(id);
    if (!message) {
      return res.status(404).json({
        error: 'Mensagem não encontrada',
        message: 'Mensagem não existe'
      });
    }

    res.json({ message });
  } catch (error) {
    console.error('Erro ao obter mensagem:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível obter a mensagem'
    });
  }
};

// Atualizar status da mensagem (apenas admin)
const updateMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'read', 'replied', 'archived'].includes(status)) {
      return res.status(400).json({
        error: 'Status inválido',
        message: 'Status deve ser: pending, read, replied ou archived'
      });
    }

    const message = await ContactMessage.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        error: 'Mensagem não encontrada',
        message: 'Mensagem não existe'
      });
    }

    res.json({
      message: 'Status atualizado com sucesso',
      contactMessage: message
    });
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível atualizar o status'
    });
  }
};

// Deletar mensagem (apenas admin)
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await ContactMessage.findByIdAndDelete(id);
    if (!message) {
      return res.status(404).json({
        error: 'Mensagem não encontrada',
        message: 'Mensagem não existe'
      });
    }

    res.json({
      message: 'Mensagem deletada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar mensagem:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível deletar a mensagem'
    });
  }
};

module.exports = {
  sendMessage,
  getAllMessages,
  getMessageById,
  updateMessageStatus,
  deleteMessage
};



