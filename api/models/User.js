const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    minlength: [2, 'Nome deve ter pelo menos 2 caracteres'],
    maxlength: [100, 'Nome deve ter no máximo 100 caracteres']
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  password: {
    type: String,
    required: [true, 'Senha é obrigatória'],
    minlength: [6, 'Senha deve ter pelo menos 6 caracteres']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    default: null
  },
  passwordResetToken: {
    type: String,
    default: null
  },
  passwordResetExpires: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.emailVerificationToken;
      delete ret.passwordResetToken;
      delete ret.passwordResetExpires;
      return ret;
    }
  }
});

// Índices para melhor performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });

// Middleware para atualizar lastLogin antes de salvar
userSchema.pre('save', function(next) {
  if (this.isModified('lastLogin')) {
    this.lastLogin = new Date();
  }
  next();
});

// Método para verificar senha
userSchema.methods.comparePassword = async function(candidatePassword) {
  const bcrypt = require('bcryptjs');
  return bcrypt.compare(candidatePassword, this.password);
};

// Método para gerar token de verificação de email
userSchema.methods.generateEmailVerificationToken = function() {
  const crypto = require('crypto');
  this.emailVerificationToken = crypto.randomBytes(32).toString('hex');
  return this.emailVerificationToken;
};

// Método para gerar token de reset de senha
userSchema.methods.generatePasswordResetToken = function() {
  const crypto = require('crypto');
  this.passwordResetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetExpires = Date.now() + 3600000; // 1 hora
  return this.passwordResetToken;
};

module.exports = mongoose.model('User', userSchema);



