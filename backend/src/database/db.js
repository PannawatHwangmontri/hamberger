/**
 * db.js
 * Singleton SQLite connection via node-sqlite3-wasm (pure WebAssembly).
 */
const { Database } = require('node-sqlite3-wasm');
const path = require('path');
const fs = require('fs');

// Ensure the data directory exists
const dataDir = path.join(__dirname, '..', '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'hamberger.db');

// Clean up any stale lock directory left by a previous crash
const lockPath = dbPath + '.lock';
if (fs.existsSync(lockPath)) {
  try { fs.rmdirSync(lockPath); } catch (_) { }
}

const db = new Database(dbPath);

// Enable foreign key enforcement only (skip WAL to avoid WASM locking issues)
db.run('PRAGMA foreign_keys = ON');

module.exports = db;
