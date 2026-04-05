import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const inventoryApi = {
  products: {
    getAll: async () => (await api.get('/products')).data,
    create: async (data: {
      name: string;
      description?: string;
      barcode?: string;
      sku?: string;
      price?: number;
      cost?: number;
    }) => (await api.post('/products', data)).data,
    delete: async (id: string) => (await api.delete(`/products/${id}`)).data,
  },
 warehouses: {
    getAll: async (branchId?: string) => {
      const url = branchId ? `/warehouses/branch/${branchId}` : '/warehouses';
      return (await api.get(url)).data;
    },
    create: async (data: { name: string; branchId?: string; address?: string }) =>
      (await api.post('/warehouses', data)).data,
  },
  stock: {
    getByWarehouse: async (warehouseId: string) =>
      (await api.get(`/stock/warehouse/${warehouseId}`)).data,
    add: async (data: { warehouseId: string; productId: string; quantity: number; reason?: string }) =>
      (await api.post('/stock/add', data)).data,
    remove: async (data: { warehouseId: string; productId: string; quantity: number; reason?: string }) =>
      (await api.post('/stock/remove', data)).data,
    transfer: async (data: { fromWarehouseId: string; toWarehouseId: string; productId: string; quantity: number }) =>
      (await api.post('/stock/transfer', data)).data,
  },

  categories: {
    getAll: async () => (await api.get('/categories')).data,
    create: async (data: { name: string; parentId?: string }) =>
      (await api.post('/categories', data)).data,
    delete: async (id: string) => (await api.delete(`/categories/${id}`)).data,
  },
  units: {
    getAll: async () => (await api.get('/units')).data,
    create: async (data: { name: string; symbol: string }) =>
      (await api.post('/units', data)).data,
    delete: async (id: string) => (await api.delete(`/units/${id}`)).data,
  },
};