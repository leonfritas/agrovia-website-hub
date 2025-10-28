// Classe Video adaptada para Next.js/TypeScript
// Baseada na sua classe Video original

export interface VideoData {
  idVideo?: number;
  nomeVideo: string;
  urlArquivo?: string | null;
  urlExterno?: string | null;
  urlCapa?: string | null;
  descricao?: string | null;
  idUsuario: number;
  dataUpload?: Date;
  idCategoria: number;
  nomeAutor?: string | null;
  cargoAutor?: string | null;
}

export interface VideoWithDetails extends VideoData {
  nomeCategoria?: string;
  nomeUsuario?: string;
}

export interface VideoOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  order?: 'ASC' | 'DESC';
}

class Video {
  private tableName: string;

  constructor() {
    this.tableName = 'Video';
  }

  // Buscar video por ID
  async findById(id: number): Promise<VideoData | null> {
    try {
      // Implementar busca por ID usando sua lógica de banco
      const query = `
        SELECT v.*, c.nomeCategoria, u.nomeUsuario
        FROM Video v
        INNER JOIN Categoria c ON v.idCategoria = c.idCategoria
        INNER JOIN Usuario u ON v.idUsuario = u.idUsuario
        WHERE v.idVideo = @idVideo
      `;
      
      const result = await this.executeQuery(query, { idVideo: id });
      return result.recordset[0] || null;
    } catch (error) {
      console.error('Erro ao buscar video por ID:', error);
      throw error;
    }
  }

  // Criar novo video
  async create(data: VideoData): Promise<VideoData> {
    try {
      const query = `
        INSERT INTO Video (nomeVideo, urlArquivo, urlExterno, descricao, idUsuario, dataUpload, idCategoria, nomeAutor, cargoAutor)
        OUTPUT INSERTED.*
        VALUES (@nomeVideo, @urlArquivo, @urlExterno, @descricao, @idUsuario, @dataUpload, @idCategoria, @nomeAutor, @cargoAutor)
      `;
      
      const params = {
        nomeVideo: data.nomeVideo,
        urlArquivo: data.urlArquivo || null,
        urlExterno: data.urlExterno || null,
        descricao: data.descricao || null,
        idUsuario: data.idUsuario,
        dataUpload: data.dataUpload || new Date(),
        idCategoria: data.idCategoria,
        nomeAutor: data.nomeAutor || null,
        cargoAutor: data.cargoAutor || null
      };
      
      const result = await this.executeQuery(query, params);
      return result.recordset[0];
    } catch (error) {
      console.error('Erro ao criar video:', error);
      throw error;
    }
  }

  // Buscar videos por categoria
  async findByCategoria(idCategoria: number, options: VideoOptions = {}): Promise<VideoWithDetails[]> {
    try {
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
    } catch (error) {
      console.error('Erro ao buscar videos por categoria:', error);
      throw error;
    }
  }

  // Buscar videos por nome da categoria
  async findByCategoriaName(nomeCategoria: string, options: VideoOptions = {}): Promise<VideoWithDetails[]> {
    try {
      const { limit = 10, offset = 0 } = options;
      
      const query = `
        SELECT v.*, c.nomeCategoria, u.nomeUsuario
        FROM Video v
        INNER JOIN Categoria c ON v.idCategoria = c.idCategoria
        INNER JOIN Usuario u ON v.idUsuario = u.idUsuario
        WHERE c.nomeCategoria = @nomeCategoria
        ORDER BY v.dataUpload DESC
        OFFSET @offset ROWS
        FETCH NEXT @limit ROWS ONLY
      `;
      
      const result = await this.executeQuery(query, { 
        nomeCategoria, 
        offset, 
        limit 
      });
      return result.recordset;
    } catch (error) {
      console.error('Erro ao buscar videos por nome da categoria:', error);
      throw error;
    }
  }

  // Buscar videos com informações completas
  async findAllWithDetails(options: VideoOptions = {}): Promise<VideoWithDetails[]> {
    try {
      const { limit = 10, offset = 0, orderBy = 'v.dataUpload', order = 'DESC' } = options;
      
      const query = `
        SELECT 
          v.idVideo,
          v.nomeVideo,
          v.urlArquivo,
          v.urlExterno,
          v.urlCapa,
          v.descricao,
          v.dataUpload,
          v.nomeAutor,
          v.cargoAutor,
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
    } catch (error) {
      console.error('Erro ao buscar todos os videos:', error);
      throw error;
    }
  }

  // Buscar videos recentes
  async findRecent(limit: number = 5): Promise<VideoWithDetails[]> {
    try {
      const query = `
        SELECT TOP ${limit}
          v.idVideo,
          v.nomeVideo,
          v.urlArquivo,
          v.urlExterno,
          v.descricao,
          v.dataUpload,
          v.nomeAutor,
          v.cargoAutor,
          c.nomeCategoria,
          u.nomeUsuario
        FROM Video v
        INNER JOIN Categoria c ON v.idCategoria = c.idCategoria
        INNER JOIN Usuario u ON v.idUsuario = u.idUsuario
        ORDER BY v.dataUpload DESC
      `;
      
      const result = await this.executeQuery(query);
      return result.recordset;
    } catch (error) {
      console.error('Erro ao buscar videos recentes:', error);
      throw error;
    }
  }

  // Executar query personalizada
  private async executeQuery(query: string, params: any = {}): Promise<any> {
    try {
      // Usar mssql diretamente para conexão com SQL Server
      const sql = require('mssql');
      
      console.log('🔍 Executando query:', query);
      console.log('📋 Parâmetros:', params);
      
      // Verificar se todas as variáveis de ambiente necessárias estão definidas
      const requiredEnvVars = ['DB_SERVER', 'DB_DATABASE', 'DB_USER', 'DB_PASSWORD', 'DB_PORT'];
      const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
      
      if (missingVars.length > 0) {
        throw new Error(`Variáveis de ambiente obrigatórias não definidas: ${missingVars.join(', ')}`);
      }
      
      // Configuração da conexão usando apenas variáveis de ambiente
      const config = {
        server: process.env.DB_SERVER!,
        database: process.env.DB_DATABASE!,
        user: process.env.DB_USER!,
        password: process.env.DB_PASSWORD!,
        port: parseInt(process.env.DB_PORT!),
        options: {
          encrypt: process.env.DB_ENCRYPT === 'true',
          trustServerCertificate: process.env.DB_TRUST_CERT === 'true',
          enableArithAbort: true,
        }
      };
      
      console.log('🔌 Conectando ao banco:', config.server, config.database);
      
      const pool = await sql.connect(config);
      const request = pool.request();
      
      // Adicionar parâmetros
      Object.keys(params).forEach(key => {
        const value = params[key];
        if (typeof value === 'string') {
          request.input(key, sql.VarChar, value);
        } else if (typeof value === 'number') {
          request.input(key, sql.Int, value);
        } else if (value instanceof Date) {
          request.input(key, sql.DateTime, value);
        } else if (value === null || value === undefined) {
          request.input(key, sql.VarChar, null);
        } else {
          request.input(key, sql.VarChar, value);
        }
      });
      
      const result = await request.query(query);
      await pool.close();
      
      console.log('✅ Query executada com sucesso. Registros encontrados:', result.recordset.length);
      return result;
      
    } catch (error) {
      console.error('❌ Erro ao executar query:', error);
      console.error('📋 Query:', query);
      console.error('📋 Parâmetros:', params);
      throw error;
    }
  }
}

export default Video;
