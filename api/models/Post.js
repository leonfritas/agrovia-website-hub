const BaseModel = require('./BaseModel');

class Post extends BaseModel {
  constructor() {
    super('Post');
  }

  // Buscar post por ID
  async findById(id) {
    return super.findById(id, 'idPost');
  }

  // Criar novo post
  async create(data) {
    const postData = {
      nomePost: data.nomePost,
      descricao: data.descricao,
      idCategoria: data.idCategoria,
      dataPost: data.dataPost || new Date(),
      idUsuario: data.idUsuario,
      imagemPost: data.imagemPost || null,
      linkExterno: data.linkExterno || null
    };
    return super.create(postData);
  }

  // Atualizar post
  async update(id, data) {
    const postData = {
      nomePost: data.nomePost,
      descricao: data.descricao,
      idCategoria: data.idCategoria,
      dataPost: data.dataPost,
      idUsuario: data.idUsuario,
      imagemPost: data.imagemPost,
      linkExterno: data.linkExterno
    };
    return super.update(id, postData, 'idPost');
  }

  // Deletar post
  async delete(id) {
    return super.delete(id, 'idPost');
  }

  // Buscar posts por categoria
  async findByCategoria(idCategoria, options = {}) {
    const { limit = 10, offset = 0 } = options;
    
    const query = `
      SELECT p.*, c.nomeCategoria, u.nomeUsuario
      FROM Post p
      INNER JOIN Categoria c ON p.idCategoria = c.idCategoria
      INNER JOIN Usuario u ON p.idUsuario = u.idUsuario
      WHERE p.idCategoria = @idCategoria
      ORDER BY p.dataPost DESC
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

  // Buscar posts por usuário
  async findByUsuario(idUsuario, options = {}) {
    const { limit = 10, offset = 0 } = options;
    
    const query = `
      SELECT p.*, c.nomeCategoria, u.nomeUsuario
      FROM Post p
      INNER JOIN Categoria c ON p.idCategoria = c.idCategoria
      INNER JOIN Usuario u ON p.idUsuario = u.idUsuario
      WHERE p.idUsuario = @idUsuario
      ORDER BY p.dataPost DESC
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

  // Buscar posts com informações completas
  async findAllWithDetails(options = {}) {
    const { limit = 10, offset = 0, orderBy = 'p.dataPost', order = 'DESC' } = options;
    
    const query = `
      SELECT 
        p.idPost,
        p.nomePost,
        p.descricao,
        p.dataPost,
        p.imagemPost,
        p.linkExterno,
        c.idCategoria,
        c.nomeCategoria,
        u.idUsuario,
        u.nomeUsuario
      FROM Post p
      INNER JOIN Categoria c ON p.idCategoria = c.idCategoria
      INNER JOIN Usuario u ON p.idUsuario = u.idUsuario
      ORDER BY ${orderBy} ${order}
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `;
    
    const result = await this.executeQuery(query, { offset, limit });
    return result.recordset;
  }

  // Buscar posts por texto (busca em nome e descrição)
  async search(searchTerm, options = {}) {
    const { limit = 10, offset = 0 } = options;
    
    const query = `
      SELECT p.*, c.nomeCategoria, u.nomeUsuario
      FROM Post p
      INNER JOIN Categoria c ON p.idCategoria = c.idCategoria
      INNER JOIN Usuario u ON p.idUsuario = u.idUsuario
      WHERE p.nomePost LIKE @searchTerm 
         OR p.descricao LIKE @searchTerm
      ORDER BY p.dataPost DESC
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

  // Buscar posts recentes
  async findRecent(limit = 5) {
    const query = `
      SELECT TOP ${limit}
        p.idPost,
        p.nomePost,
        p.descricao,
        p.dataPost,
        p.imagemPost,
        c.nomeCategoria,
        u.nomeUsuario
      FROM Post p
      INNER JOIN Categoria c ON p.idCategoria = c.idCategoria
      INNER JOIN Usuario u ON p.idUsuario = u.idUsuario
      ORDER BY p.dataPost DESC
    `;
    
    const result = await this.executeQuery(query);
    return result.recordset;
  }

  // Estatísticas de posts
  async getStats() {
    const query = `
      SELECT 
        COUNT(*) as totalPosts,
        COUNT(DISTINCT idCategoria) as categoriasUsadas,
        COUNT(DISTINCT idUsuario) as usuariosAtivos,
        MAX(dataPost) as ultimoPost
      FROM Post
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

module.exports = Post;
