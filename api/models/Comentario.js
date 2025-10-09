const BaseModel = require('./BaseModel');

class Comentario extends BaseModel {
  constructor() {
    super('Comentario');
  }

  // Buscar comentário por ID
  async findById(id) {
    return super.findById(id, 'idComentario');
  }

  // Criar novo comentário
  async create(data) {
    const comentarioData = {
      idPost: data.idPost,
      nomeAutor: data.nomeAutor,
      textoComentario: data.textoComentario,
      dataComentario: data.dataComentario || new Date(),
      aprovado: data.aprovado || false,
      moderado: data.moderado || false,
      motivoRejeicao: data.motivoRejeicao || null
    };
    return super.create(comentarioData);
  }

  // Atualizar comentário
  async update(id, data) {
    const comentarioData = {
      aprovado: data.aprovado,
      moderado: data.moderado,
      motivoRejeicao: data.motivoRejeicao
    };
    return super.update(id, comentarioData, 'idComentario');
  }

  // Deletar comentário
  async delete(id) {
    return super.delete(id, 'idComentario');
  }

  // Buscar comentários por post
  async findByPost(idPost, options = {}) {
    const { limit = 50, offset = 0, apenasAprovados = true } = options;
    
    const whereClause = apenasAprovados ? 'WHERE c.idPost = @idPost AND c.aprovado = 1' : 'WHERE c.idPost = @idPost';
    
    const query = `
      SELECT 
        c.idComentario,
        c.idPost,
        c.nomeAutor,
        c.textoComentario,
        c.dataComentario,
        c.aprovado,
        c.moderado,
        c.motivoRejeicao
      FROM Comentario c
      ${whereClause}
      ORDER BY c.dataComentario DESC
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `;
    
    const result = await this.executeQuery(query, { idPost, offset, limit });
    return result.recordset;
  }

  // Buscar comentários pendentes de moderação
  async findPendingModeration(options = {}) {
    const { limit = 50, offset = 0 } = options;
    
    const query = `
      SELECT 
        c.idComentario,
        c.idPost,
        c.nomeAutor,
        c.textoComentario,
        c.dataComentario,
        c.aprovado,
        c.moderado,
        p.nomePost
      FROM Comentario c
      INNER JOIN Post p ON c.idPost = p.idPost
      WHERE c.moderado = 0
      ORDER BY c.dataComentario ASC
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `;
    
    const result = await this.executeQuery(query, { offset, limit });
    return result.recordset;
  }

  // Aprovar comentário
  async approve(id) {
    const query = `
      UPDATE Comentario 
      SET aprovado = 1, moderado = 1, motivoRejeicao = NULL
      WHERE idComentario = @id
    `;
    await this.executeQuery(query, { id });
    return this.findById(id);
  }

  // Rejeitar comentário
  async reject(id, motivo) {
    const query = `
      UPDATE Comentario 
      SET aprovado = 0, moderado = 1, motivoRejeicao = @motivo
      WHERE idComentario = @id
    `;
    await this.executeQuery(query, { id, motivo });
    return this.findById(id);
  }

  // Contar comentários por post
  async countByPost(idPost, apenasAprovados = true) {
    const whereClause = apenasAprovados ? 'WHERE idPost = @idPost AND aprovado = 1' : 'WHERE idPost = @idPost';
    
    const query = `
      SELECT COUNT(*) as total
      FROM Comentario
      ${whereClause}
    `;
    
    const result = await this.executeQuery(query, { idPost });
    return result.recordset[0].total;
  }

  // Executar query personalizada
  async executeQuery(query, params = {}) {
    const { executeQuery } = require('../utils/database');
    return executeQuery(query, params);
  }
}

module.exports = Comentario;
