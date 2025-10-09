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
      conteudo: data.conteudo || null,
      idCategoria: data.idCategoria,
      dataPost: data.dataPost || new Date(),
      idUsuario: data.idUsuario,
      imagemPost: data.imagemPost || null,
      imagemDestaque: data.imagemDestaque || null,
      imagemConteudo: data.imagemConteudo || null,
      linkExterno: data.linkExterno || null
    };
    return super.create(postData);
  }

  // Atualizar post
  async update(id, data) {
    const postData = {};
    
    // Apenas adicionar campos que foram fornecidos
    if (data.nomePost !== undefined) postData.nomePost = data.nomePost;
    if (data.descricao !== undefined) postData.descricao = data.descricao;
    if (data.conteudo !== undefined) postData.conteudo = data.conteudo;
    if (data.idCategoria !== undefined) postData.idCategoria = data.idCategoria;
    if (data.idUsuario !== undefined) postData.idUsuario = data.idUsuario;
    if (data.imagemPost !== undefined) postData.imagemPost = data.imagemPost;
    if (data.imagemDestaque !== undefined) postData.imagemDestaque = data.imagemDestaque;
    if (data.imagemConteudo !== undefined) postData.imagemConteudo = data.imagemConteudo;
    if (data.linkExterno !== undefined) postData.linkExterno = data.linkExterno;
    // Nunca atualizar dataPost - manter a data original
    
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
        p.conteudo,
        p.dataPost,
        p.imagemPost,
        p.imagemDestaque,
        p.imagemConteudo,
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
