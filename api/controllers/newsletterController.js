const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const { validateEmail } = require('../utils/validation');

// Inscrever no newsletter
const subscribe = async (req, res) => {
  try {
    const { email, name } = req.body;

    // Validações
    if (!email) {
      return res.status(400).json({
        error: 'Email obrigatório',
        message: 'Email é obrigatório para se inscrever'
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        error: 'Email inválido',
        message: 'Por favor, forneça um email válido'
      });
    }

    // Verificar se já está inscrito
    const existingSubscriber = await NewsletterSubscriber.findOne({ email });
    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return res.status(409).json({
          error: 'Já inscrito',
          message: 'Este email já está inscrito no newsletter'
        });
      } else {
        // Reativar inscrição
        existingSubscriber.isActive = true;
        existingSubscriber.name = name || existingSubscriber.name;
        existingSubscriber.subscribedAt = new Date();
        await existingSubscriber.save();

        return res.json({
          message: 'Inscrição reativada com sucesso',
          subscriber: {
            email: existingSubscriber.email,
            name: existingSubscriber.name
          }
        });
      }
    }

    // Criar nova inscrição
    const subscriber = new NewsletterSubscriber({
      email,
      name: name || null,
      isActive: true
    });

    await subscriber.save();

    res.status(201).json({
      message: 'Inscrição realizada com sucesso',
      subscriber: {
        email: subscriber.email,
        name: subscriber.name
      }
    });
  } catch (error) {
    console.error('Erro ao inscrever no newsletter:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível realizar a inscrição'
    });
  }
};

// Cancelar inscrição no newsletter
const unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: 'Email obrigatório',
        message: 'Email é obrigatório para cancelar a inscrição'
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        error: 'Email inválido',
        message: 'Por favor, forneça um email válido'
      });
    }

    const subscriber = await NewsletterSubscriber.findOne({ email });
    if (!subscriber) {
      return res.status(404).json({
        error: 'Inscrição não encontrada',
        message: 'Este email não está inscrito no newsletter'
      });
    }

    if (!subscriber.isActive) {
      return res.status(409).json({
        error: 'Já cancelado',
        message: 'Esta inscrição já foi cancelada'
      });
    }

    subscriber.isActive = false;
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();

    res.json({
      message: 'Inscrição cancelada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao cancelar inscrição:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível cancelar a inscrição'
    });
  }
};

// Obter todos os inscritos (apenas admin)
const getAllSubscribers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status; // active, inactive, all

    const filter = {};
    if (status === 'active') {
      filter.isActive = true;
    } else if (status === 'inactive') {
      filter.isActive = false;
    }

    const subscribers = await NewsletterSubscriber.find(filter)
      .sort({ subscribedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await NewsletterSubscriber.countDocuments(filter);

    res.json({
      subscribers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalSubscribers: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Erro ao obter inscritos:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível obter os inscritos'
    });
  }
};

// Obter inscrito por ID (apenas admin)
const getSubscriberById = async (req, res) => {
  try {
    const { id } = req.params;

    const subscriber = await NewsletterSubscriber.findById(id);
    if (!subscriber) {
      return res.status(404).json({
        error: 'Inscrito não encontrado',
        message: 'Inscrito não existe'
      });
    }

    res.json({ subscriber });
  } catch (error) {
    console.error('Erro ao obter inscrito:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível obter o inscrito'
    });
  }
};

// Deletar inscrito (apenas admin)
const deleteSubscriber = async (req, res) => {
  try {
    const { id } = req.params;

    const subscriber = await NewsletterSubscriber.findByIdAndDelete(id);
    if (!subscriber) {
      return res.status(404).json({
        error: 'Inscrito não encontrado',
        message: 'Inscrito não existe'
      });
    }

    res.json({
      message: 'Inscrito deletado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar inscrito:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível deletar o inscrito'
    });
  }
};

// Enviar newsletter (apenas admin)
const sendNewsletter = async (req, res) => {
  try {
    const { subject, content, template } = req.body;

    if (!subject || !content) {
      return res.status(400).json({
        error: 'Dados obrigatórios',
        message: 'Assunto e conteúdo são obrigatórios'
      });
    }

    // Buscar todos os inscritos ativos
    const activeSubscribers = await NewsletterSubscriber.find({ isActive: true });
    
    if (activeSubscribers.length === 0) {
      return res.status(404).json({
        error: 'Nenhum inscrito ativo',
        message: 'Não há inscritos ativos para enviar o newsletter'
      });
    }

    // Aqui você implementaria o envio real do email
    // Por enquanto, apenas simulamos o envio

    const newsletterData = {
      subject,
      content,
      template: template || 'default',
      sentAt: new Date(),
      recipientsCount: activeSubscribers.length,
      recipients: activeSubscribers.map(sub => sub.email)
    };

    res.json({
      message: 'Newsletter enviado com sucesso',
      newsletter: newsletterData
    });
  } catch (error) {
    console.error('Erro ao enviar newsletter:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível enviar o newsletter'
    });
  }
};

module.exports = {
  subscribe,
  unsubscribe,
  getAllSubscribers,
  getSubscriberById,
  deleteSubscriber,
  sendNewsletter
};




