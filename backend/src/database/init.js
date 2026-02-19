/**
 * init.js
 * Runs the SQL schema and seeds an initial admin account.
 * Called once at server startup.
 */
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const db = require('./db');

function initDatabase() {
    // 1. Apply schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    db.exec(schema);

    // 2. Seed default admin (only if no admin exists)
    // node-sqlite3-wasm: .get() with single value binds to position 1 — OK
    const existing = db.prepare('SELECT id FROM admins LIMIT 1').get();
    if (!existing) {
        const hash = bcrypt.hashSync('admin1234', 10);
        // node-sqlite3-wasm: .run() takes an ARRAY for multiple positional params
        db.prepare('INSERT INTO admins (username, password) VALUES (?, ?)').run(['admin', hash]);
        console.log('[DB] Default admin created: admin / admin1234');
    }

    console.log('[DB] Database initialised successfully.');
}

module.exports = { initDatabase };
