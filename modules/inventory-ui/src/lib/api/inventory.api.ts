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


  stockMovements: {
    getAll: async (filters?: { warehouseId?: string; productId?: string; type?: string }) => {
      const params = new URLSearchParams();
      if (filters?.warehouseId) params.append('warehouseId', filters.warehouseId);
      if (filters?.productId) params.append('productId', filters.productId);
      if (filters?.type) params.append('type', filters.type);
      return (await api.get(`/stock-movements?${params.toString()}`)).data;
    },
    getByWarehouse: async (warehouseId: string) =>
      (await api.get(`/stock-movements/warehouse/${warehouseId}`)).data,
    getByProduct: async (productId: string) =>
      (await api.get(`/stock-movements/product/${productId}`)).data,
  },

  settings: {
    get: async (companyId: string) =>
      (await api.get(`/inventory-settings/${companyId}`)).data,
    update: async (companyId: string, data: any) =>
      (await api.put(`/inventory-settings/${companyId}`, data)).data,
  },


  adjustments: {
    getAll: async (warehouseId?: string) => {
      const params = warehouseId ? `?warehouseId=${warehouseId}` : '';
      return (await api.get(`/stock-adjustments${params}`)).data;
    },
    create: async (data: any) => (await api.post('/stock-adjustments', data)).data,
    confirm: async (id: string) => (await api.patch(`/stock-adjustments/${id}/confirm`)).data,
  },
  reorderingRules: {
    getAll: async (warehouseId?: string) => {
      const params = warehouseId ? `?warehouseId=${warehouseId}` : '';
      return (await api.get(`/reordering-rules${params}`)).data;
    },
    upsert: async (data: any) => (await api.post('/reordering-rules', data)).data,
    delete: async (id: string) => (await api.delete(`/reordering-rules/${id}`)).data,
  },

  variants: {
    getByProduct: async (productId: string) =>
      (await api.get(`/product-variants/product/${productId}`)).data,
    create: async (data: any) => (await api.post('/product-variants', data)).data,
    update: async (id: string, data: any) => (await api.patch(`/product-variants/${id}`, data)).data,
    delete: async (id: string) => (await api.delete(`/product-variants/${id}`)).data,
  },
  priceHistory: {
    getByProduct: async (productId: string) =>
      (await api.get(`/product-price-history/${productId}`)).data,
  },

  lotNumbers: {
    getByProduct: async (productId: string, warehouseId?: string) => {
      const params = warehouseId ? `?warehouseId=${warehouseId}` : '';
      return (await api.get(`/lot-numbers/product/${productId}${params}`)).data;
    },
    search: async (lotNumber: string) =>
      (await api.get(`/lot-numbers/search/${lotNumber}`)).data,
    create: async (data: any) => (await api.post('/lot-numbers', data)).data,
  },
  serialNumbers: {
    getByProduct: async (productId: string, warehouseId?: string) => {
      const params = warehouseId ? `?warehouseId=${warehouseId}` : '';
      return (await api.get(`/serial-numbers/product/${productId}${params}`)).data;
    },
    search: async (serialNumber: string) =>
      (await api.get(`/serial-numbers/search/${serialNumber}`)).data,
    createMany: async (data: any) => (await api.post('/serial-numbers', data)).data,
    updateStatus: async (id: string, status: string) =>
      (await api.patch(`/serial-numbers/${id}/status`, { status })).data,
  },
  valuation: {
    get: async (warehouseId?: string) => {
      const params = warehouseId ? `?warehouseId=${warehouseId}` : '';
      return (await api.get(`/stock-valuation${params}`)).data;
    },
  },
};

