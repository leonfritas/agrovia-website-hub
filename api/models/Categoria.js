const BaseModel = require('./BaseModel');

class Categoria extends BaseModel {
  constructor() {
    super('Categoria');
  }

  // Buscar categoria por ID
  async findById(id) {
    return super.findById(id, 'idCategoria');
  }

  // Criar nova categoria
  async create(data) {
    const categoriaData = {
      nomeCategoria: data.nomeCategoria
    };
    return super.create(categoriaData);
  }

  // Atualizar categoria
  async update(id, data) {
    const categoriaData = {
      nomeCategoria: data.nomeCategoria
    };
    return super.update(id, categoriaData, 'idCategoria');
  }

  // Deletar categoria
  async delete(id) {
    return super.delete(id, 'idCategoria');
  }

  // Buscar categoria por nome
  async findByName(nomeCategoria) {
    const query = `
      SELECT * FROM Categoria 
      WHERE nomeCategoria LIKE @nomeCategoria
    `;
    const result = await this.executeQuery(query, { 
      nomeCategoria: `%${nomeCategoria}%` 
    });
    return result.recordset;
  }

  // Buscar categorias com posts
  async findWithPosts() {
    const query = `
      SELECT c.idCategoria, c.nomeCategoria, COUNT(p.idPost) as totalPosts
      FROM Categoria c
      LEFT JOIN Post p ON c.idCategoria = p.idCategoria
      GROUP BY c.idCategoria, c.nomeCategoria
      ORDER BY c.nomeCategoria
    `;
    const result = await this.executeQuery(query);
    return result.recordset;
  }

  // Verificar se categoria pode ser deletada (não tem posts associados)
  async canDelete(id) {
    const query = `
      SELECT COUNT(*) as totalPosts
      FROM Post 
      WHERE idCategoria = @id
    `;
    const result = await this.executeQuery(query, { id });
    return result.recordset[0].totalPosts === 0;
  }

  // Executar query personalizada
  async executeQuery(query, params = {}) {
    const { executeQuery } = require('../utils/database');
    return executeQuery(query, params);
  }
}

module.exports = Categoria;
