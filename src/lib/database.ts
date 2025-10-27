// Configuração de conexão com SQL Server
// Adapte conforme sua configuração de banco de dados

import { ConnectionPool } from 'mssql';

// Configuração da conexão
const config = {
  server: process.env.DB_SERVER || '',
  database: process.env.DB_DATABASE || '',
  user: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '1433'),
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true', // Use true for azure
    trustServerCertificate: process.env.DB_TRUST_CERT === 'true', // Use true for local dev
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

let pool: ConnectionPool | null = null;

// Função para obter conexão
export async function getConnection(): Promise<ConnectionPool> {
  if (!pool) {
    pool = new ConnectionPool(config);
    await pool.connect();
    console.log('Conectado ao SQL Server');
  }
  return pool;
}

// Função para executar queries
export async function executeQuery(query: string, params: any = {}): Promise<any> {
  try {
    const connection = await getConnection();
    const request = connection.request();
    
    // Adicionar parâmetros
    Object.keys(params).forEach(key => {
      const value = params[key];
      if (typeof value === 'string') {
        request.input(key, value);
      } else if (typeof value === 'number') {
        request.input(key, value);
      } else if (value instanceof Date) {
        request.input(key, value);
      } else if (value === null || value === undefined) {
        request.input(key, null);
      } else {
        request.input(key, value);
      }
    });
    
    const result = await request.query(query);
    return result;
  } catch (error) {
    console.error('Erro ao executar query:', error);
    throw error;
  }
}

// Função para fechar conexão
export async function closeConnection(): Promise<void> {
  if (pool) {
    await pool.close();
    pool = null;
    console.log('Conexão com SQL Server fechada');
  }
}

// Função para testar conexão
export async function testConnection(): Promise<boolean> {
  try {
    const connection = await getConnection();
    const result = await connection.request().query('SELECT 1 as test');
    console.log('Teste de conexão bem-sucedido:', result.recordset[0]);
    return true;
  } catch (error) {
    console.error('Erro no teste de conexão:', error);
    return false;
  }
}

export default {
  getConnection,
  executeQuery,
  closeConnection,
  testConnection
};
