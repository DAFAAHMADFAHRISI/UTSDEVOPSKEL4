const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'axon_user',
  password: process.env.DB_PASSWORD || 'axon_password_123',
  database: process.env.DB_NAME || 'axon_sales',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Helper function to test DB connection with retries
async function testConnection(retries = 5, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      const connection = await pool.getConnection();
      console.log(`[Database] Successfully connected to MySQL database: ${process.env.DB_NAME || 'axon_sales'} at ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306}`);
      connection.release();
      return true;
    } catch (error) {
      console.warn(`[Database] Connection attempt ${i + 1}/${retries} failed: ${error.message}`);
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  console.error('[Database] Could not connect to MySQL after several attempts. Waiting for database to be ready...');
  return false;
}

module.exports = {
  pool,
  testConnection,
};
