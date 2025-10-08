const BaseModel = require('./BaseModel');

class Video extends BaseModel {
  constructor() {
    super('Video');
  }

  // Buscar video por ID
  async findById(id) {
    return super.findById(id, 'idVideo');
  }

  // Criar novo video
  async create(data) {
    const videoData = {
      nopmeVideo: data.nopmeVideo, // Mantendo o nome original da coluna
      urlArquivo: data.urlArquivo || null,
      urlExterno: data.urlExterno || null,
      descricao: data.descricao || null,
      idUsuario: data.idUsuario,
      dataUpload: data.dataUpload || new Date(),
      idCategoria: data.idCategoria
    };
    return super.create(videoData);
  }

  // Atualizar video
  async update(id, data) {
    const videoData = {
      nopmeVideo: data.nopmeVideo,
      urlArquivo: data.urlArquivo,
      urlExterno: data.urlExterno,
      descricao: data.descricao,
      idUsuario: data.idUsuario,
      dataUpload: data.dataUpload,
      idCategoria: data.idCategoria
    };
    return super.update(id, videoData, 'idVideo');
  }

  // Deletar video
  async delete(id) {
    return super.delete(id, 'idVideo');
  }

  // Buscar videos por categoria
  async findByCategoria(idCategoria, options = {}) {
    const { limit = 10, offset = 0 } = options;
    
    const query = `
      SELECT v.*, c.nomeCategoria, u.nomeUsuario
      FROM Video v
      INNER JOIN Categoria c ON v.idCategoria = c.idCategoria
      INNER JOIN Usuario u ON v.idUsuario = u.idUsuario
      WHERE v.idCategoria = @idCategoria
      ORDER BY v.dataUpload DESC
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `;
    
    const result = await this.executeQuery(query, { 
      idCategoria, 
      offset, 
      limit 
    });
    return result.recordset;
  }

  // Buscar videos por usuário
  async findByUsuario(idUsuario, options = {}) {
    const { limit = 10, offset = 0 } = options;
    
    const query = `
      SELECT v.*, c.nomeCategoria, u.nomeUsuario
      FROM Video v
      INNER JOIN Categoria c ON v.idCategoria = c.idCategoria
      INNER JOIN Usuario u ON v.idUsuario = u.idUsuario
      WHERE v.idUsuario = @idUsuario
      ORDER BY v.dataUpload DESC
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `;
    
    const result = await this.executeQuery(query, { 
      idUsuario, 
      offset, 
      limit 
    });
    return result.recordset;
  }

  // Buscar videos com informações completas
  async findAllWithDetails(options = {}) {
    const { limit = 10, offset = 0, orderBy = 'v.dataUpload', order = 'DESC' } = options;
    
    const query = `
      SELECT 
        v.idVideo,
        v.nomeVideo,
        v.urlArquivo,
        v.urlExterno,
        v.descricao,
        v.dataUpload,
        c.idCategoria,
        c.nomeCategoria,
        u.idUsuario,
        u.nomeUsuario
      FROM Video v
      INNER JOIN Categoria c ON v.idCategoria = c.idCategoria
      INNER JOIN Usuario u ON v.idUsuario = u.idUsuario
      ORDER BY ${orderBy} ${order}
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `;
    
    const result = await this.executeQuery(query, { offset, limit });
    return result.recordset;
  }

  // Buscar videos por texto (busca em nome e descrição)
  async search(searchTerm, options = {}) {
    const { limit = 10, offset = 0 } = options;
    
    const query = `
      SELECT v.*, c.nomeCategoria, u.nomeUsuario
      FROM Video v
      INNER JOIN Categoria c ON v.idCategoria = c.idCategoria
      INNER JOIN Usuario u ON v.idUsuario = u.idUsuario
      WHERE v.nopmeVideo LIKE @searchTerm 
         OR v.descricao LIKE @searchTerm
      ORDER BY v.dataUpload DESC
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `;
    
    const result = await this.executeQuery(query, { 
      searchTerm: `%${searchTerm}%`, 
      offset, 
      limit 
    });
    return result.recordset;
  }

  // Buscar videos recentes
  async findRecent(limit = 5) {
    const query = `
      SELECT TOP ${limit}
        v.idVideo,
        v.nomeVideo,
        v.urlArquivo,
        v.urlExterno,
        v.descricao,
        v.dataUpload,
        c.nomeCategoria,
        u.nomeUsuario
      FROM Video v
      INNER JOIN Categoria c ON v.idCategoria = c.idCategoria
      INNER JOIN Usuario u ON v.idUsuario = u.idUsuario
      ORDER BY v.dataUpload DESC
    `;
    
    const result = await this.executeQuery(query);
    return result.recordset;
  }

  // Buscar videos por tipo de URL
  async findByUrlType(urlType, options = {}) {
    const { limit = 10, offset = 0 } = options;
    
    let whereClause = '';
    if (urlType === 'arquivo') {
      whereClause = 'WHERE v.urlArquivo IS NOT NULL AND v.urlArquivo != \'\'';
    } else if (urlType === 'externo') {
      whereClause = 'WHERE v.urlExterno IS NOT NULL AND v.urlExterno != \'\'';
    }
    
    const query = `
      SELECT v.*, c.nomeCategoria, u.nomeUsuario
      FROM Video v
      INNER JOIN Categoria c ON v.idCategoria = c.idCategoria
      INNER JOIN Usuario u ON v.idUsuario = u.idUsuario
      ${whereClause}
      ORDER BY v.dataUpload DESC
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `;
    
    const result = await this.executeQuery(query, { offset, limit });
    return result.recordset;
  }

  // Estatísticas de videos
  async getStats() {
    const query = `
      SELECT 
        COUNT(*) as totalVideos,
        COUNT(DISTINCT idCategoria) as categoriasUsadas,
        COUNT(DISTINCT idUsuario) as usuariosAtivos,
        MAX(dataUpload) as ultimoVideo,
        SUM(CASE WHEN urlArquivo IS NOT NULL AND urlArquivo != '' THEN 1 ELSE 0 END) as videosComArquivo,
        SUM(CASE WHEN urlExterno IS NOT NULL AND urlExterno != '' THEN 1 ELSE 0 END) as videosExternos
      FROM Video
    `;
    
    const result = await this.executeQuery(query);
    return result.recordset[0];
  }

  // Buscar videos por período
  async findByDateRange(dataInicio, dataFim, options = {}) {
    const { limit = 10, offset = 0 } = options;
    
    const query = `
      SELECT v.*, c.nomeCategoria, u.nomeUsuario
      FROM Video v
      INNER JOIN Categoria c ON v.idCategoria = c.idCategoria
      INNER JOIN Usuario u ON v.idUsuario = u.idUsuario
      WHERE v.dataUpload BETWEEN @dataInicio AND @dataFim
      ORDER BY v.dataUpload DESC
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `;
    
    const result = await this.executeQuery(query, { 
      dataInicio, 
      dataFim, 
      offset, 
      limit 
    });
    return result.recordset;
  }

  // Executar query personalizada
  async executeQuery(query, params = {}) {
    const { executeQuery } = require('../utils/database');
    return executeQuery(query, params);
  }
}

module.exports = Video;
