/**
 * admin.model.js
 * Database access for the admins table.
 */
const db = require('../database/db');

const AdminModel = {
    /**
     * Find an admin by username.
     * @param {string} username
     * @returns {Object|undefined}
     */
    findByUsername(username) {
        return db.prepare('SELECT * FROM admins WHERE username = ?').get(username);
    },
};

module.exports = AdminModel;
