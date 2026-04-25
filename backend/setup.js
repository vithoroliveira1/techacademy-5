const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();

async function setup() {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });
    console.log('Connected to MySQL. Creating DB...');
    const sql = fs.readFileSync('database_schema.sql', 'utf8');
    const queries = sql.split(';').map(q => q.trim()).filter(q => q.length > 0);
    for (const query of queries) {
      await conn.query(query);
    }
    console.log('DATABASE AND TABLES CREATED SUCESSFULLY!');
    await conn.end();
  } catch(e) {
    console.error('ERROR:', e.message);
  }
}
setup();
