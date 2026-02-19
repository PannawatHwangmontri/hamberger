/**
 * db.js
 * Singleton SQLite connection via better-sqlite3.
 * Enables WAL mode and foreign-key enforcement.
 */
const Database = require('better-sqlite3');
const path = require('path');
const fs   = require('fs');

// Ensure the data directory exists
const dataDir = path.join(__dirname, '..', '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'hamberger.db');
const db     = new Database(dbPath);

// Performance & integrity settings
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

module.exports = db;
