# 🍔 Hamberger — Restaurant Ordering System

A full-stack restaurant ordering web application built with **Next.js** (frontend) and **Cloudflare Workers + Hono** (backend), using **Cloudflare D1** as the database and **Cloudflare R2** for image storage.

---

## 📁 Project Structure

```
hamberger/
├── frontend/          # Next.js 15 frontend (customer & admin UI)
└── backend-cf/        # Cloudflare Workers backend (REST API)
```

---

## ✨ Features

### 👤 Customer Side
- Browse available menu items with images and prices
- Add items to cart and place orders by table number
- Track order status in real-time

### 🔐 Admin Side
- Secure login with JWT authentication
- Manage products (create, update, delete, toggle availability)
- Upload product images directly to Cloudflare R2
- View and manage all orders, update order status

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS |
| Backend | Cloudflare Workers, Hono v4, TypeScript |
| Database | Cloudflare D1 (SQLite) |
| Storage | Cloudflare R2 |
| Auth | JWT (signed via Web Crypto API), bcryptjs |

---

## 🗄️ Database Schema

```
admins       — Admin user accounts
products     — Menu items (name, price, image, availability)
orders       — Customer orders (table number, status, total price)
order_items  — Line items per order (product, quantity, price snapshot)
```

Order statuses: `pending` → `cooking` → `completed` / `cancelled`

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) (`npm install -g wrangler`)
- A Cloudflare account with D1 and R2 set up

---

### Backend (Cloudflare Workers)

```bash
cd backend-cf
npm install
```

**Configure** `wrangler.toml` with your D1 database ID and R2 bucket name.

**Initialize the database:**
```bash
wrangler d1 execute hamberger-db --file=src/db/schema.sql
wrangler d1 execute hamberger-db --file=seed.sql
wrangler d1 execute hamberger-db --file=seed-products.sql
```

**Run locally:**
```bash
npm run dev
# → http://localhost:8787
```

**Deploy to Cloudflare:**
```bash
npm run deploy
```

---

### Frontend (Next.js)

```bash
cd frontend
npm install
```

**Set environment variables** in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8787
```

> For production, replace with your deployed Cloudflare Workers URL.

**Run locally:**
```bash
npm run dev
# → http://localhost:3000
```

**Build for production:**
```bash
npm run build
npm run start
```

---

## 🔌 API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/products` | List all products |
| `GET` | `/api/products/:id` | Get product by ID |
| `POST` | `/api/orders` | Place a new order |
| `GET` | `/api/orders/:id` | Get order status |
| `POST` | `/api/admin/login` | Admin login |

### Admin (requires JWT)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/products` | Create product |
| `PUT` | `/api/products/:id` | Update product |
| `DELETE` | `/api/products/:id` | Delete product |
| `GET` | `/api/orders` | List all orders |
| `PUT` | `/api/orders/:id/status` | Update order status |
| `DELETE` | `/api/orders/:id` | Delete order |
| `POST` | `/api/upload` | Upload product image to R2 |

---

## 📄 Pages

### Customer
- `/` — Home / Menu page
- `/user/checkout` — Checkout (select table, confirm order)
- `/user/status` — Order status tracker

### Admin
- `/admin/login` — Admin login
- `/admin/products` — Manage menu items
- `/admin/orders` — Manage orders

---

## 🔑 Default Admin Credentials

After running the seed SQL file:

| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `admin1234` |

> ⚠️ **Change the default password immediately after first login in a production environment.**

---

## ☁️ Deployment

| Service | Platform |
|---------|----------|
| Frontend | [Vercel](https://vercel.com) |
| Backend | [Cloudflare Workers](https://workers.cloudflare.com) |
| Database | Cloudflare D1 |
| Images | Cloudflare R2 |