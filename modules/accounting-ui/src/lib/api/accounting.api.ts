import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const accountingApi = {
  taxes: {
    getAll: async (companyId: string) =>
      (await api.get(`/taxes?companyId=${companyId}`)).data,
    create: async (data: any) =>
      (await api.post('/taxes', data)).data,
    update: async (id: string, data: any) =>
      (await api.patch(`/taxes/${id}`, data)).data,
    delete: async (id: string) =>
      (await api.delete(`/taxes/${id}`)).data,
  },
  paymentTerms: {
    getAll: async (companyId: string) =>
      (await api.get(`/payment-terms?companyId=${companyId}`)).data,
    create: async (data: any) =>
      (await api.post('/payment-terms', data)).data,
    update: async (id: string, data: any) =>
      (await api.patch(`/payment-terms/${id}`, data)).data,
    delete: async (id: string) =>
      (await api.delete(`/payment-terms/${id}`)).data,
  },
  accounts: {
    getAll: async (companyId: string) =>
      (await api.get(`/chart-of-accounts?companyId=${companyId}`)).data,
    create: async (data: any) =>
      (await api.post('/chart-of-accounts', data)).data,
    update: async (id: string, data: any) =>
      (await api.patch(`/chart-of-accounts/${id}`, data)).data,
    delete: async (id: string) =>
      (await api.delete(`/chart-of-accounts/${id}`)).data,
  },
};