import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env['VITE_API_URL'] || 'http://localhost:3000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const accountingApi = {
  taxes: {
    getAll: (params?: { scope?: string }) =>
      api.get('/accounting/taxes', { params }).then(r => r.data),
    getOne: (id: string) =>
      api.get(`/accounting/taxes/${id}`).then(r => r.data.data),
    create: (data: any) =>
      api.post('/accounting/taxes', data).then(r => r.data.data),
    update: (id: string, data: any) =>
      api.patch(`/accounting/taxes/${id}`, data).then(r => r.data.data),
    delete: (id: string) =>
      api.delete(`/accounting/taxes/${id}`).then(r => r.data.data),
  },

  paymentTerms: {
    getAll: () =>
      api.get('/accounting/payment-terms').then(r => r.data),
    getOne: (id: string) =>
      api.get(`/accounting/payment-terms/${id}`).then(r => r.data.data),
    create: (data: any) =>
      api.post('/accounting/payment-terms', data).then(r => r.data.data),
    update: (id: string, data: any) =>
      api.patch(`/accounting/payment-terms/${id}`, data).then(r => r.data.data),
    delete: (id: string) =>
      api.delete(`/accounting/payment-terms/${id}`).then(r => r.data.data),
  },

  accounts: {
    getAll: (params?: { type?: string }) =>
      api.get('/accounting/chart-of-accounts', { params }).then(r => r.data),
    getOne: (id: string) =>
      api.get(`/accounting/chart-of-accounts/${id}`).then(r => r.data.data),
    create: (data: any) =>
      api.post('/accounting/chart-of-accounts', data).then(r => r.data.data),
    update: (id: string, data: any) =>
      api.patch(`/accounting/chart-of-accounts/${id}`, data).then(r => r.data.data),
    delete: (id: string) =>
      api.delete(`/accounting/chart-of-accounts/${id}`).then(r => r.data.data),
  },

  journals: {
    getAll: () =>
      api.get('/accounting/journals').then(r => r.data),
    getOne: (id: string) =>
      api.get(`/accounting/journals/${id}`).then(r => r.data.data),
    create: (data: any) =>
      api.post('/accounting/journals', data).then(r => r.data.data),
    update: (id: string, data: any) =>
      api.patch(`/accounting/journals/${id}`, data).then(r => r.data.data),
    delete: (id: string) =>
      api.delete(`/accounting/journals/${id}`).then(r => r.data.data),
  },

  journalEntries: {
    getAll: (params?: { page?: number; limit?: number; search?: string }) =>
      api.get('/accounting/journal-entries', { params }).then(r => r.data),
    getOne: (id: string) =>
      api.get(`/accounting/journal-entries/${id}`).then(r => r.data.data),
    create: (data: any) =>
      api.post('/accounting/journal-entries', data).then(r => r.data.data),
    post: (id: string) =>
      api.patch(`/accounting/journal-entries/${id}/post`).then(r => r.data.data),
    cancel: (id: string) =>
      api.patch(`/accounting/journal-entries/${id}/cancel`).then(r => r.data.data),
  },

  fiscalYears: {
    getAll: () =>
      api.get('/accounting/fiscal-years').then(r => r.data),
    getOne: (id: string) =>
      api.get(`/accounting/fiscal-years/${id}`).then(r => r.data.data),
    create: (data: any) =>
      api.post('/accounting/fiscal-years', data).then(r => r.data.data),
    close: (id: string) =>
      api.post(`/accounting/fiscal-years/${id}/close`).then(r => r.data.data),
    lock: (id: string) =>
      api.post(`/accounting/fiscal-years/${id}/lock`).then(r => r.data.data),
    updatePeriodStatus: (periodId: string, status: string) =>
      api.patch(`/accounting/fiscal-years/periods/${periodId}/status`, { status }).then(r => r.data.data),
  },

  settings: {
    get: () =>
      api.get('/accounting/settings').then(r => r.data.data),
    update: (data: any) =>
      api.patch('/accounting/settings', data).then(r => r.data.data),
  },
};