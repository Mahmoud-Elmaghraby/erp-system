import axios from 'axios';

const api = axios.create({
baseURL: `${import.meta.env['VITE_API_URL'] || 'http://localhost:3000/api'}`,
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

export const salesApi = {

customers: {
getAll:  () => api.get('/sales/customers').then(r => r.data),
getById: (id: string) => api.get(`/sales/customers/${id}`).then(r => r.data),
create:  (data: any) => api.post('/sales/customers', data).then(r => r.data),
update:  (id: string, data: any) => api.patch(`/sales/customers/${id}`, data).then(r => r.data),
delete:  (id: string) => api.delete(`/sales/customers/${id}`).then(r => r.data),
},

quotations: {
getAll:   () => api.get('/sales/quotations').then(r => r.data),
getById:  (id: string) => api.get(`/sales/quotations/${id}`).then(r => r.data),
create:   (data: any) => api.post('/sales/quotations', data).then(r => r.data),
update:   (id: string, data: any) => api.patch(`/sales/quotations/${id}`, data).then(r => r.data),
confirm:  (id: string) => api.patch(`/sales/quotations/${id}/confirm`).then(r => r.data),
send:     (id: string) => api.patch(`/sales/quotations/${id}/send`).then(r => r.data),
cancel:   (id: string) => api.patch(`/sales/quotations/${id}/cancel`).then(r => r.data),
delete:   (id: string) => api.delete(`/sales/quotations/${id}`).then(r => r.data),
},

orders: {
getAll:   () => api.get('/sales/orders').then(r => r.data),
getById:  (id: string) => api.get(`/sales/orders/${id}`).then(r => r.data),
create:   (data: any) => api.post('/sales/orders', data).then(r => r.data),
confirm:  (id: string) => api.patch(`/sales/orders/${id}/confirm`).then(r => r.data),
cancel:   (id: string) => api.patch(`/sales/orders/${id}/cancel`).then(r => r.data),
},

invoices: {
getAll: (orderId?: string) => {
const params = orderId ? `?orderId=${orderId}` : '';
return api.get(`/sales/invoices${params}`).then(r => r.data);
},
getById: (id: string) => api.get(`/sales/invoices/${id}`).then(r => r.data),
create:  (data: any) => api.post('/sales/invoices', data).then(r => r.data),
pay:     (id: string, data: any) => api.patch(`/sales/invoices/${id}/pay`, data).then(r => r.data),
cancel:  (id: string) => api.patch(`/sales/invoices/${id}/cancel`).then(r => r.data),
},

deliveries: {
getAll:    () => api.get('/sales/deliveries').then(r => r.data),
getByOrder:(orderId: string) => api.get(`/sales/deliveries?orderId=${orderId}`).then(r => r.data),
getById:   (id: string) => api.get(`/sales/deliveries/${id}`).then(r => r.data),
create:    (data: any) => api.post('/sales/deliveries', data).then(r => r.data),
confirm:   (id: string) => api.patch(`/sales/deliveries/${id}/confirm`).then(r => r.data),
},

returns: {
getAll:     () => api.get('/sales/sales-returns').then(r => r.data),
getByOrder: (orderId: string) => api.get(`/sales/sales-returns?orderId=${orderId}`).then(r => r.data),
getById:    (id: string) => api.get(`/sales/sales-returns/${id}`).then(r => r.data),
create:     (data: any) => api.post('/sales/sales-returns', data).then(r => r.data),
confirm:    (id: string) => api.patch(`/sales/sales-returns/${id}/confirm`).then(r => r.data),
cancel:     (id: string) => api.patch(`/sales/sales-returns/${id}/cancel`).then(r => r.data),
},

};
