const BaseModel = require('./BaseModel');

class ContactMessage extends BaseModel {
  constructor() {
    super('ContactMessage');
  }

  // Criar nova mensagem de contato
  async create(data) {
    const messageData = {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      subject: data.subject,
      message: data.message,
      status: 'pending',
      ipAddress: data.ipAddress || '127.0.0.1',
      userAgent: data.userAgent || null,
      repliedAt: null,
      repliedBy: null,
      replyMessage: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return super.create(messageData);
  }

  // Marcar como lida
  async markAsRead(id) {
    const query = `
      UPDATE ContactMessage 
      SET status = 'read', updatedAt = @updatedAt
      WHERE id = @id
    `;
    const result = await this.executeQuery(query, { 
      id, 
      updatedAt: new Date() 
    });
    return result.rowsAffected[0] > 0;
  }

  // Marcar como respondida
  async markAsReplied(id, replyMessage, repliedBy) {
    const query = `
      UPDATE ContactMessage 
      SET status = 'replied', 
          repliedAt = @repliedAt, 
          repliedBy = @repliedBy, 
          replyMessage = @replyMessage,
          updatedAt = @updatedAt
      WHERE id = @id
    `;
    const result = await this.executeQuery(query, { 
      id, 
      repliedAt: new Date(),
      repliedBy,
      replyMessage,
      updatedAt: new Date()
    });
    return result.rowsAffected[0] > 0;
  }

  // Arquivar mensagem
  async archive(id) {
    const query = `
      UPDATE ContactMessage 
      SET status = 'archived', updatedAt = @updatedAt
      WHERE id = @id
    `;
    const result = await this.executeQuery(query, { 
      id, 
      updatedAt: new Date() 
    });
    return result.rowsAffected[0] > 0;
  }

  // Buscar mensagens por status
  async findByStatus(status, options = {}) {
    const { limit = 10, offset = 0 } = options;
    
    const query = `
      SELECT * FROM ContactMessage 
      WHERE status = @status
      ORDER BY createdAt DESC
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `;
    
    const result = await this.executeQuery(query, { 
      status, 
      offset, 
      limit 
    });
    return result.recordset;
  }

  // Buscar mensagens por email
  async findByEmail(email, options = {}) {
    const { limit = 10, offset = 0 } = options;
    
    const query = `
      SELECT * FROM ContactMessage 
      WHERE email = @email
      ORDER BY createdAt DESC
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `;
    
    const result = await this.executeQuery(query, { 
      email, 
      offset, 
      limit 
    });
    return result.recordset;
  }

  // Buscar mensagens por período
  async findByDateRange(startDate, endDate, options = {}) {
    const { limit = 10, offset = 0 } = options;
    
    const query = `
      SELECT * FROM ContactMessage 
      WHERE createdAt BETWEEN @startDate AND @endDate
      ORDER BY createdAt DESC
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `;
    
    const result = await this.executeQuery(query, { 
      startDate, 
      endDate, 
      offset, 
      limit 
    });
    return result.recordset;
  }

  // Estatísticas de mensagens
  async getStats() {
    const query = `
      SELECT 
        COUNT(*) as totalMessages,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pendingMessages,
        SUM(CASE WHEN status = 'read' THEN 1 ELSE 0 END) as readMessages,
        SUM(CASE WHEN status = 'replied' THEN 1 ELSE 0 END) as repliedMessages,
        SUM(CASE WHEN status = 'archived' THEN 1 ELSE 0 END) as archivedMessages,
        MAX(createdAt) as lastMessage
      FROM ContactMessage
    `;
    
    const result = await this.executeQuery(query);
    return result.recordset[0];
  }

  // Executar query personalizada
  async executeQuery(query, params = {}) {
    const { executeQuery } = require('../utils/database');
    return executeQuery(query, params);
  }
}

module.exports = ContactMessage;
