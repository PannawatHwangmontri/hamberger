const { Database } = require('node-sqlite3-wasm');

try {
    console.log('Attempting to open database...');
    const db = new Database(':memory:');
    console.log('Database opened successfully.');

    db.exec('CREATE TABLE foo (bar INT)');
    db.exec('INSERT INTO foo VALUES (1)');
    const row = db.prepare('SELECT * FROM foo').get();
    console.log('Row:', row);

    console.log('Test PASSED.');
} catch (err) {
    console.error('Test FAILED:', err);
}
