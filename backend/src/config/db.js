require('dotenv').config();

const DIALECT = (process.env.DB_DIALECT || 'mysql').toLowerCase();

function createSqliteDb() {
  const path = require('path');
  const fs = require('fs');
  const Database = require('better-sqlite3');

  const dbPath = process.env.SQLITE_DB_PATH
    ? path.resolve(process.cwd(), process.env.SQLITE_DB_PATH)
    : path.resolve(process.cwd(), 'dev.sqlite');

  const sqlite = new Database(dbPath);
  sqlite.pragma('foreign_keys = ON');

  // Initialize schema on first run
  const schemaPath = path.resolve(__dirname, 'schema.sqlite.sql');
  if (fs.existsSync(schemaPath)) {
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    sqlite.exec(schemaSql);
  }

  return {
    async query(sql, params = []) {
      const trimmed = String(sql).trim();
      const isSelect = /^select\b/i.test(trimmed) || /^pragma\b/i.test(trimmed) || /^with\b/i.test(trimmed);

      if (isSelect) {
        const rows = sqlite.prepare(sql).all(params);
        return [rows];
      }

      const info = sqlite.prepare(sql).run(params);
      return [
        {
          insertId: Number(info.lastInsertRowid || 0),
          affectedRows: info.changes || 0
        }
      ];
    }
  };
}

function createMysqlDb() {
  const mysql2 = require('mysql2/promise');
  return mysql2.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'lms_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
}

module.exports = DIALECT === 'sqlite' ? createSqliteDb() : createMysqlDb();
