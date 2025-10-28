// Configuração de conexão com SQL Server
import { ConnectionPool } from "mssql";

const config = {
  server: process.env.DB_SERVER || "",
  database: process.env.DB_DATABASE || "",
  user: process.env.DB_USER || "",
  password: process.env.DB_PASSWORD || "",
  port: parseInt(process.env.DB_PORT || "1433"),
  options: {
    encrypt: process.env.DB_ENCRYPT === "true",
    trustServerCertificate: process.env.DB_TRUST_CERT === "true",
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool: ConnectionPool | null = null;

// 🔹 Função para obter conexão
export async function getConnection(): Promise<ConnectionPool> {
  if (!pool) {
    pool = new ConnectionPool(config);
    await pool.connect();
    console.log("Conectado ao SQL Server");
  }
  return pool;
}

// 🔹 Função para executar queries
export async function executeQuery(query: string, params: Record<string, any> = {}): Promise<any> {
  try {
    const connection = await getConnection();
    const request = connection.request();

    // Adicionar parâmetros dinamicamente
    Object.entries(params).forEach(([key, value]) => {
      request.input(key, value);
    });

    const result = await request.query(query);
    return result;
  } catch (error) {
    const err = error instanceof Error ? error.message : String(error);
    console.error("Erro ao executar query:", err);
    throw new Error(err);
  }
}

// 🔹 Função para fechar conexão
export async function closeConnection(): Promise<void> {
  if (pool) {
    await pool.close();
    pool = null;
    console.log("Conexão com SQL Server fechada");
  }
}

// 🔹 Função para testar conexão
export async function testConnection(): Promise<boolean> {
  try {
    const connection = await getConnection();
    const result = await connection.request().query("SELECT 1 as test");
    console.log("Teste de conexão bem-sucedido:", result.recordset[0]);
    return true;
  } catch (error) {
    const err = error instanceof Error ? error.message : String(error);
    console.error("Erro no teste de conexão:", err);
    return false;
  }
}

// ✅ Evita o warning "import/no-anonymous-default-export"
const database = {
  getConnection,
  executeQuery,
  closeConnection,
  testConnection,
};

export default database;
