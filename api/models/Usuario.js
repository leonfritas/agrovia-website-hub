const BaseModel = require('./BaseModel');
const bcrypt = require('bcryptjs');

class Usuario extends BaseModel {
  constructor() {
    super('Usuario');
  }

  // Buscar usuário por ID
  async findById(id) {
    return super.findById(id, 'idUsuario');
  }

  // Criar novo usuário
  async create(data) {
    // Criptografar senha
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(data.senhaUsuario, saltRounds);
    
    const usuarioData = {
      nomeUsuario: data.nomeUsuario,
      senhaUsuario: hashedPassword,
      ativoAdm: data.ativoAdm || false
    };
    return super.create(usuarioData);
  }

  // Atualizar usuário
  async update(id, data) {
    const usuarioData = {
      nomeUsuario: data.nomeUsuario,
      ativoAdm: data.ativoAdm
    };
    
    // Se uma nova senha foi fornecida, criptografar
    if (data.senhaUsuario) {
      const saltRounds = 12;
      usuarioData.senhaUsuario = await bcrypt.hash(data.senhaUsuario, saltRounds);
    }
    
    return super.update(id, usuarioData, 'idUsuario');
  }

  // Deletar usuário
  async delete(id) {
    return super.delete(id, 'idUsuario');
  }

  // Buscar usuário por nome
  async findByName(nomeUsuario) {
    const query = `
      SELECT * FROM Usuario 
      WHERE nomeUsuario LIKE @nomeUsuario
    `;
    const result = await this.executeQuery(query, { 
      nomeUsuario: `%${nomeUsuario}%` 
    });
    return result.recordset;
  }

  // Buscar usuários administradores
  async findAdmins() {
    const query = `
      SELECT idUsuario, nomeUsuario, ativoAdm
      FROM Usuario 
      WHERE ativoAdm = 1
      ORDER BY nomeUsuario
    `;
    const result = await this.executeQuery(query);
    return result.recordset;
  }

  // Buscar usuários comuns
  async findRegularUsers() {
    const query = `
      SELECT idUsuario, nomeUsuario, ativoAdm
      FROM Usuario 
      WHERE ativoAdm = 0
      ORDER BY nomeUsuario
    `;
    const result = await this.executeQuery(query);
    return result.recordset;
  }

  // Verificar credenciais de login
  async authenticate(nomeUsuario, senhaUsuario) {
    const query = `
      SELECT idUsuario, nomeUsuario, senhaUsuario, ativoAdm
      FROM Usuario 
      WHERE nomeUsuario = @nomeUsuario
    `;
    
    const result = await this.executeQuery(query, { nomeUsuario });
    const user = result.recordset[0];
    
    if (!user) {
      return null;
    }
    
    // Verificar senha
    const isPasswordValid = await bcrypt.compare(senhaUsuario, user.senhaUsuario);
    if (!isPasswordValid) {
      return null;
    }
    
    // Retornar usuário sem a senha
    const { senhaUsuario: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Alterar senha
  async changePassword(id, newPassword) {
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    const query = `
      UPDATE Usuario 
      SET senhaUsuario = @senhaUsuario
      WHERE idUsuario = @id
    `;
    
    const result = await this.executeQuery(query, { 
      id, 
      senhaUsuario: hashedPassword 
    });
    
    return result.rowsAffected[0] > 0;
  }

  // Ativar/Desativar usuário admin
  async toggleAdmin(id) {
    const query = `
      UPDATE Usuario 
      SET ativoAdm = CASE WHEN ativoAdm = 1 THEN 0 ELSE 1 END
      OUTPUT INSERTED.*
      WHERE idUsuario = @id
    `;
    
    const result = await this.executeQuery(query, { id });
    return result.recordset[0] || null;
  }

  // Buscar usuários com estatísticas
  async findWithStats() {
    const query = `
      SELECT 
        u.idUsuario,
        u.nomeUsuario,
        u.ativoAdm,
        COUNT(p.idPost) as totalPosts,
        COUNT(v.idVideo) as totalVideos
      FROM Usuario u
      LEFT JOIN Post p ON u.idUsuario = p.idUsuario
      LEFT JOIN Video v ON u.idUsuario = v.idUsuario
      GROUP BY u.idUsuario, u.nomeUsuario, u.ativoAdm
      ORDER BY u.nomeUsuario
    `;
    
    const result = await this.executeQuery(query);
    return result.recordset;
  }

  // Verificar se usuário pode ser deletado (não tem posts ou videos)
  async canDelete(id) {
    const query = `
      SELECT 
        (SELECT COUNT(*) FROM Post WHERE idUsuario = @id) as totalPosts,
        (SELECT COUNT(*) FROM Video WHERE idUsuario = @id) as totalVideos
    `;
    
    const result = await this.executeQuery(query, { id });
    const stats = result.recordset[0];
    
    return stats.totalPosts === 0 && stats.totalVideos === 0;
  }

  // Estatísticas gerais de usuários
  async getStats() {
    const query = `
      SELECT 
        COUNT(*) as totalUsuarios,
        SUM(CASE WHEN ativoAdm = 1 THEN 1 ELSE 0 END) as totalAdmins,
        SUM(CASE WHEN ativoAdm = 0 THEN 1 ELSE 0 END) as totalUsuariosComuns
      FROM Usuario
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

module.exports = Usuario;
