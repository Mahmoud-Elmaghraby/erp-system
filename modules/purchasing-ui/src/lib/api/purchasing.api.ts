import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const purchasingApi = {
  suppliers: {
    getAll: async () => (await api.get('/suppliers')).data,
    getById: async (id: string) => (await api.get(`/suppliers/${id}`)).data,
    create: async (data: any) => (await api.post('/suppliers', data)).data,
    update: async (id: string, data: any) => (await api.patch(`/suppliers/${id}`, data)).data,
    delete: async (id: string) => (await api.delete(`/suppliers/${id}`)).data,
  },
  orders: {
    getAll: async (branchId?: string) => {
      const params = branchId ? `?branchId=${branchId}` : '';
      return (await api.get(`/purchase-orders${params}`)).data;
    },
    getById: async (id: string) => (await api.get(`/purchase-orders/${id}`)).data,
    create: async (data: any) => (await api.post('/purchase-orders', data)).data,
    confirm: async (id: string) => (await api.patch(`/purchase-orders/${id}/confirm`)).data,
  },
  receipts: {
    getByOrder: async (orderId: string) =>
      (await api.get(`/purchase-receipts/order/${orderId}`)).data,
    create: async (data: any) => (await api.post('/purchase-receipts', data)).data,
  },
  bills: {
    getByOrder: async (orderId: string) =>
      (await api.get(`/vendor-bills/order/${orderId}`)).data,
    create: async (data: any) => (await api.post('/vendor-bills', data)).data,
    pay: async (id: string, amount: number) =>
      (await api.patch(`/vendor-bills/${id}/pay`, { amount })).data,
  },
};