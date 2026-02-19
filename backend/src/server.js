/**
 * server.js
 * Express application entry point.
 *
 * Architecture overview:
 *  ┌─────────────┐    ┌─────────────────┐    ┌──────────────┐
 *  │   Client    │───▶│  Express Router │───▶│  Controller  │
 *  └─────────────┘    └─────────────────┘    └──────┬───────┘
 *                                                   │
 *                                            ┌──────▼───────┐
 *                                            │    Model     │
 *                                            └──────┬───────┘
 *                                                   │
 *                                            ┌──────▼───────┐
 *                                            │  SQLite DB   │
 *                                            └──────────────┘
 *
 * Public endpoints  : no authentication required
 * Admin endpoints   : require JWT (Authorization: Bearer <token>)
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDatabase } = require('./database/init');

const adminRoutes = require('./routes/admin.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');

// ─── Initialise Database ────────────────────────────────────────────────────
initDatabase();

// ─── Express App ────────────────────────────────────────────────────────────
const app = express();

app.use(cors());
app.use(express.json());

// ─── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
    res.status(404).json({ message: 'Route not found.' });
});

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
    console.error('[Unhandled Error]', err);
    res.status(500).json({ message: 'Internal server error.' });
});

// ─── Start ───────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`[Server] Hamburger backend running on http://localhost:${PORT}`);
    console.log(`[Server] Health check: http://localhost:${PORT}/api/health`);
});
