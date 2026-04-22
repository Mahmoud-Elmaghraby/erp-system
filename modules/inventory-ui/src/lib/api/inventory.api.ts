import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env['VITE_API_URL'] || 'http://localhost:3000/api'}/inventory`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('erp_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const inventoryApi = {
  products: {
    getAll: () => api.get('/products').then(r => r.data),
    getOne: (id: string) => api.get(`/products/${id}`).then(r => r.data),
    create: (data: any) => api.post('/products', data).then(r => r.data),
    update: (id: string, data: any) => api.patch(`/products/${id}`, data).then(r => r.data),
    delete: (id: string) => api.delete(`/products/${id}`).then(r => r.data),
  },

  warehouses: {
    getAll: () => api.get('/warehouses').then(r => r.data),
    getOne: (id: string) => api.get(`/warehouses/${id}`).then(r => r.data),
    create: (data: any) => api.post('/warehouses', data).then(r => r.data),
    update: (id: string, data: any) => api.patch(`/warehouses/${id}`, data).then(r => r.data),
    delete: (id: string) => api.delete(`/warehouses/${id}`).then(r => r.data),
  },

  stock: {
    getByWarehouse: (warehouseId: string) =>
      api.get(`/stock/warehouse/${warehouseId}`).then(r => r.data),
    add: (data: any) => api.post('/stock/add', data).then(r => r.data),
    remove: (data: any) => api.post('/stock/remove', data).then(r => r.data),
    transfer: (data: any) => api.post('/stock/transfer', data).then(r => r.data),
  },

  categories: {
    getAll: () => api.get('/categories').then(r => r.data),
    create: (data: any) => api.post('/categories', data).then(r => r.data),
    delete: (id: string) => api.delete(`/categories/${id}`).then(r => r.data),
  },

  units: {
    getAll: () => api.get('/units').then(r => r.data),
    create: (data: any) => api.post('/units', data).then(r => r.data),
    update: (id: string, data: any) => api.patch(`/units/${id}`, data).then(r => r.data),
    delete: (id: string) => api.delete(`/units/${id}`).then(r => r.data),
  },

  stockMovements: {
    getAll: (filters?: { warehouseId?: string; productId?: string; type?: string }) => {
      const params = new URLSearchParams();
      if (filters?.warehouseId) params.append('warehouseId', filters.warehouseId);
      if (filters?.productId) params.append('productId', filters.productId);
      if (filters?.type) params.append('type', filters.type);
      return api.get(`/stock-movements?${params.toString()}`).then(r => r.data);
    },
    getByWarehouse: (warehouseId: string) =>
      api.get(`/stock-movements/warehouse/${warehouseId}`).then(r => r.data),
    getByProduct: (productId: string) =>
      api.get(`/stock-movements/product/${productId}`).then(r => r.data),
  },

  settings: {
    get: () => api.get('/inventory-settings').then(r => r.data),
    update: (data: any) => api.put('/inventory-settings', data).then(r => r.data),
  },

  adjustments: {
    getAll: (warehouseId?: string) => {
      const params = warehouseId ? `?warehouseId=${warehouseId}` : '';
      return api.get(`/stock-adjustments${params}`).then(r => r.data);
    },
    create: (data: any) => api.post('/stock-adjustments', data).then(r => r.data),
    confirm: (id: string) => api.patch(`/stock-adjustments/${id}/confirm`).then(r => r.data),
  },

  reorderingRules: {
    getAll: (warehouseId?: string) => {
      const params = warehouseId ? `?warehouseId=${warehouseId}` : '';
      return api.get(`/reordering-rules${params}`).then(r => r.data);
    },
    upsert: (data: any) => api.post('/reordering-rules', data).then(r => r.data),
    delete: (id: string) => api.delete(`/reordering-rules/${id}`).then(r => r.data),
  },

  variants: {
    getByProduct: (productId: string) =>
      api.get(`/product-variants/product/${productId}`).then(r => r.data),
    create: (data: any) => api.post('/product-variants', data).then(r => r.data),
    update: (id: string, data: any) =>
      api.patch(`/product-variants/${id}`, data).then(r => r.data),
    delete: (id: string) => api.delete(`/product-variants/${id}`).then(r => r.data),
  },

  priceHistory: {
    getByProduct: (productId: string) =>
      api.get(`/product-price-history/${productId}`).then(r => r.data),
  },

  lotNumbers: {
    getByProduct: (productId: string, warehouseId?: string) => {
      const params = warehouseId ? `?warehouseId=${warehouseId}` : '';
      return api.get(`/lot-numbers/product/${productId}${params}`).then(r => r.data);
    },
    search: (lotNumber: string) =>
      api.get(`/lot-numbers/search/${lotNumber}`).then(r => r.data),
    create: (data: any) => api.post('/lot-numbers', data).then(r => r.data),
  },

  serialNumbers: {
    getByProduct: (productId: string, warehouseId?: string) => {
      const params = warehouseId ? `?warehouseId=${warehouseId}` : '';
      return api.get(`/serial-numbers/product/${productId}${params}`).then(r => r.data);
    },
    search: (serialNumber: string) =>
      api.get(`/serial-numbers/search/${serialNumber}`).then(r => r.data),
    createMany: (data: any) => api.post('/serial-numbers', data).then(r => r.data),
    updateStatus: (id: string, status: string) =>
      api.patch(`/serial-numbers/${id}/status`, { status }).then(r => r.data),
  },

  valuation: {
    get: (warehouseId?: string) => {
      const params = warehouseId ? `?warehouseId=${warehouseId}` : '';
      return api.get(`/stock-valuation${params}`).then(r => r.data);
    },
  },
};