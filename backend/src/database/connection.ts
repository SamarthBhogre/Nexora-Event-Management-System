import mysql from 'mysql2/promise';
import { Pool, PoolOptions, Connection } from 'mysql2/promise';

let pool: Pool;

export const initializeDatabase = async (): Promise<Pool> => {
  const poolOptions: PoolOptions = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'syncova',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };

  try {
    pool = mysql.createPool(poolOptions);
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    return pool;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

export const getConnection = async (): Promise<Connection> => {
  if (!pool) {
    throw new Error('Database pool not initialized');
  }
  return pool.getConnection();
};

export const getPool = (): Pool => {
  if (!pool) {
    throw new Error('Database pool not initialized');
  }
  return pool;
};

export const query = async (
  sql: string,
  values?: any[]
): Promise<[any, any]> => {
  const connection = await getConnection();
  try {
    const result = await connection.query(sql, values);
    return result;
  } finally {
    connection.release();
  }
};

export const closeDatabase = async (): Promise<void> => {
  if (pool) {
    await pool.end();
    console.log('📍 Database connection closed');
  }
};
