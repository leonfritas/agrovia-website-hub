const { executeQuery, executeProcedure } = require('../utils/database');

class BaseModel {
  constructor(tableName) {
    this.tableName = tableName;
  }

  // Obter coluna padrão para ordenação
  getDefaultOrderColumn() {
    // Mapear nomes de tabelas para suas colunas de ID
    const idColumns = {
      'Usuario': 'idUsuario',
      'Categoria': 'idCategoria', 
      'Post': 'idPost',
      'Video': 'idVideo'
    };
    return idColumns[this.tableName] || 'id';
  }

  // Buscar todos os registros
  async findAll(options = {}) {
    const { limit = 10, offset = 0, orderBy = null, order = 'ASC' } = options;
    const orderByColumn = orderBy || this.getDefaultOrderColumn();
    
    const query = `
      SELECT * FROM ${this.tableName}
      ORDER BY ${orderByColumn} ${order}
      OFFSET ${offset} ROWS
      FETCH NEXT ${limit} ROWS ONLY
    `;
    
    const result = await executeQuery(query);
    return result.recordset;
  }

  // Buscar por ID
  async findById(id, idColumn = 'id') {
    const query = `SELECT * FROM ${this.tableName} WHERE ${idColumn} = @id`;
    const result = await executeQuery(query, { id });
    return result.recordset[0] || null;
  }

  // Criar novo registro
  async create(data) {
    const columns = Object.keys(data).join(', ');
    const values = Object.keys(data).map(key => `@${key}`).join(', ');
    
    const query = `
      INSERT INTO ${this.tableName} (${columns})
      OUTPUT INSERTED.*
      VALUES (${values})
    `;
    
    const result = await executeQuery(query, data);
    return result.recordset[0];
  }

  // Atualizar registro
  async update(id, data, idColumn = 'id') {
    const setClause = Object.keys(data)
      .map(key => `${key} = @${key}`)
      .join(', ');
    
    const query = `
      UPDATE ${this.tableName}
      SET ${setClause}
      OUTPUT INSERTED.*
      WHERE ${idColumn} = @id
    `;
    
    const params = { ...data, id };
    const result = await executeQuery(query, params);
    return result.recordset[0] || null;
  }

  // Deletar registro
  async delete(id, idColumn = 'id') {
    const query = `DELETE FROM ${this.tableName} WHERE ${idColumn} = @id`;
    const result = await executeQuery(query, { id });
    return result.rowsAffected[0] > 0;
  }

  // Contar registros
  async count(whereClause = '') {
    const query = `SELECT COUNT(*) as total FROM ${this.tableName} ${whereClause}`;
    const result = await executeQuery(query);
    return result.recordset[0].total;
  }

  // Buscar com condições personalizadas
  async findWhere(conditions, options = {}) {
    const { limit = 10, offset = 0, orderBy = null, order = 'ASC' } = options;
    const orderByColumn = orderBy || this.getDefaultOrderColumn();
    
    let whereClause = '';
    const params = {};
    
    if (conditions && Object.keys(conditions).length > 0) {
      const conditionsArray = Object.keys(conditions).map((key, index) => {
        params[key] = conditions[key];
        return `${key} = @${key}`;
      });
      whereClause = `WHERE ${conditionsArray.join(' AND ')}`;
    }
    
    const query = `
      SELECT * FROM ${this.tableName}
      ${whereClause}
      ORDER BY ${orderByColumn} ${order}
      OFFSET ${offset} ROWS
      FETCH NEXT ${limit} ROWS ONLY
    `;
    
    const result = await executeQuery(query, params);
    return result.recordset;
  }
}

module.exports = BaseModel;
