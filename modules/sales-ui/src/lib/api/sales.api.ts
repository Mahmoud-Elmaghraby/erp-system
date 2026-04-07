import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const salesApi = {
  customers: {
    getAll: async () => (await api.get('/customers')).data,
    create: async (data: { name: string; email?: string; phone?: string; address?: string }) =>
      (await api.post('/customers', data)).data,
    update: async (id: string, data: any) => (await api.patch(`/customers/${id}`, data)).data,
    delete: async (id: string) => (await api.delete(`/customers/${id}`)).data,
  },
  orders: {
    getAll: async (branchId: string) => (await api.get(`/orders/branch/${branchId}`)).data,
    getById: async (id: string) => (await api.get(`/orders/${id}`)).data,
    create: async (data: any) => (await api.post('/orders', data)).data,
    confirm: async (id: string) => (await api.patch(`/orders/${id}/confirm`)).data,
  },
  invoices: {
    getByOrder: async (orderId: string) => (await api.get(`/invoices/order/${orderId}`)).data,
    create: async (data: { orderId: string; dueDate?: Date }) =>
      (await api.post('/invoices', data)).data,
    pay: async (id: string, amount: number) =>
      (await api.patch(`/invoices/${id}/pay`, { amount })).data,
  },
};