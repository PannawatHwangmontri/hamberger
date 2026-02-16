import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
});

// เพิ่ม token ในทุก request ถ้ามี
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==================== User APIs ====================

export const getProducts = () => api.get('/products');
export const getRecommendedProducts = () => api.get('/products/recommended');
export const getProduct = (id) => api.get(`/products/${id}`);
export const createOrder = (orderData) => api.post('/orders', orderData);
export const getOrder = (id) => api.get(`/orders/${id}`);

// ==================== Admin APIs ====================

export const adminLogin = (credentials) => api.post('/admin/login', credentials);

export const adminGetProducts = () => api.get('/admin/products');
export const adminCreateProduct = (productData) => api.post('/admin/products', productData);
export const adminUpdateProduct = (id, productData) => api.put(`/admin/products/${id}`, productData);
export const adminDeleteProduct = (id) => api.delete(`/admin/products/${id}`);

export const adminGetOrders = () => api.get('/admin/orders');
export const adminGetOrder = (id) => api.get(`/admin/orders/${id}`);
export const adminUpdateOrderStatus = (id, status) => api.put(`/admin/orders/${id}/status`, { status });
export const adminDeleteOrder = (id) => api.delete(`/admin/orders/${id}`);
