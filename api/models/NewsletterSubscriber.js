const BaseModel = require('./BaseModel');

class NewsletterSubscriber extends BaseModel {
  constructor() {
    super('NewsletterSubscriber');
  }

  // Criar nova inscrição
  async create(data) {
    const crypto = require('crypto');
    const subscriberData = {
      email: data.email.toLowerCase().trim(),
      name: data.name || null,
      isActive: true,
      subscribedAt: new Date(),
      unsubscribedAt: null,
      unsubscribeToken: crypto.randomBytes(32).toString('hex'),
      ipAddress: data.ipAddress || null,
      userAgent: data.userAgent || null,
      source: data.source || 'website',
      tags: data.tags ? JSON.stringify(data.tags) : null,
      preferences: data.preferences ? JSON.stringify(data.preferences) : JSON.stringify({
        frequency: 'weekly',
        categories: []
      }),
      lastEmailSent: null,
      emailCount: 0,
      bounceCount: 0,
      isBounced: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return super.create(subscriberData);
  }

  // Desativar inscrição
  async unsubscribe(email) {
    const query = `
      UPDATE NewsletterSubscriber 
      SET isActive = 0, unsubscribedAt = @unsubscribedAt, updatedAt = @updatedAt
      WHERE email = @email
    `;
    const result = await this.executeQuery(query, { 
      email, 
      unsubscribedAt: new Date(),
      updatedAt: new Date()
    });
    return result.rowsAffected[0] > 0;
  }

  // Reativar inscrição
  async resubscribe(email) {
    const query = `
      UPDATE NewsletterSubscriber 
      SET isActive = 1, unsubscribedAt = NULL, bounceCount = 0, isBounced = 0, updatedAt = @updatedAt
      WHERE email = @email
    `;
    const result = await this.executeQuery(query, { 
      email, 
      updatedAt: new Date()
    });
    return result.rowsAffected[0] > 0;
  }

  // Registrar envio de email
  async recordEmailSent(email) {
    const query = `
      UPDATE NewsletterSubscriber 
      SET lastEmailSent = @lastEmailSent, emailCount = emailCount + 1, updatedAt = @updatedAt
      WHERE email = @email
    `;
    const result = await this.executeQuery(query, { 
      email, 
      lastEmailSent: new Date(),
      updatedAt: new Date()
    });
    return result.rowsAffected[0] > 0;
  }

  // Registrar bounce
  async recordBounce(email) {
    const query = `
      UPDATE NewsletterSubscriber 
      SET bounceCount = bounceCount + 1, 
          isBounced = CASE WHEN bounceCount + 1 >= 3 THEN 1 ELSE 0 END,
          isActive = CASE WHEN bounceCount + 1 >= 3 THEN 0 ELSE isActive END,
          updatedAt = @updatedAt
      WHERE email = @email
    `;
    const result = await this.executeQuery(query, { 
      email, 
      updatedAt: new Date()
    });
    return result.rowsAffected[0] > 0;
  }

  // Buscar por email
  async findByEmail(email) {
    const query = `SELECT * FROM NewsletterSubscriber WHERE email = @email`;
    const result = await this.executeQuery(query, { email });
    return result.recordset[0] || null;
  }

  // Buscar inscritos ativos
  async findActive(options = {}) {
    const { limit = 10, offset = 0 } = options;
    
    const query = `
      SELECT * FROM NewsletterSubscriber 
      WHERE isActive = 1
      ORDER BY subscribedAt DESC
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `;
    
    const result = await this.executeQuery(query, { offset, limit });
    return result.recordset;
  }

  // Buscar por status
  async findByStatus(isActive, options = {}) {
    const { limit = 10, offset = 0 } = options;
    
    const query = `
      SELECT * FROM NewsletterSubscriber 
      WHERE isActive = @isActive
      ORDER BY subscribedAt DESC
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `;
    
    const result = await this.executeQuery(query, { 
      isActive: isActive ? 1 : 0, 
      offset, 
      limit 
    });
    return result.recordset;
  }

  // Buscar por período de inscrição
  async findByDateRange(startDate, endDate, options = {}) {
    const { limit = 10, offset = 0 } = options;
    
    const query = `
      SELECT * FROM NewsletterSubscriber 
      WHERE subscribedAt BETWEEN @startDate AND @endDate
      ORDER BY subscribedAt DESC
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

  // Estatísticas de inscritos
  async getStats() {
    const query = `
      SELECT 
        COUNT(*) as totalSubscribers,
        SUM(CASE WHEN isActive = 1 THEN 1 ELSE 0 END) as activeSubscribers,
        SUM(CASE WHEN isActive = 0 THEN 1 ELSE 0 END) as inactiveSubscribers,
        SUM(CASE WHEN isBounced = 1 THEN 1 ELSE 0 END) as bouncedSubscribers,
        MAX(subscribedAt) as lastSubscription,
        AVG(CAST(emailCount AS FLOAT)) as avgEmailsSent
      FROM NewsletterSubscriber
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

module.exports = NewsletterSubscriber;
