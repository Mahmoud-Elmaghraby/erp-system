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

export type SalesSettingsStatus = 'active' | 'inactive';

export interface SalesPriceList {
	id: string;
	name: string;
	status: SalesSettingsStatus;
	createdAt?: string;
	updatedAt?: string;
}

export interface SavePriceListPayload {
	name: string;
	status?: SalesSettingsStatus;
}

export interface BulkUpdatePriceListsPayload {
	sourceType: 'BASE_PRICE' | 'OTHER_LIST';
	sourceListId?: string;
	adjustmentType: 'VALUE' | 'PERCENTAGE';
	adjustmentValue: number;
}

export interface SalesOrderSource {
	id: string;
	name: string;
	status: SalesSettingsStatus;
	createdAt?: string;
	updatedAt?: string;
}

export interface OrderSourcesConfig {
	sources: SalesOrderSource[];
	defaultSourceId: string | null;
	isMandatory: boolean;
}

export interface SaveOrderSourcesPayload {
	sources: Array<{
		id?: string;
		name: string;
		status?: SalesSettingsStatus;
	}>;
	defaultSourceId: string | null;
	isMandatory: boolean;
}

export interface ShippingConfig {
	isEnabled: boolean;
	codFeeItemId: string | null;
}

export interface SalesShippingOption {
	id: string;
	name: string;
	status: SalesSettingsStatus;
	createdAt?: string;
	updatedAt?: string;
}

export interface SaveShippingOptionPayload {
	name: string;
	status?: SalesSettingsStatus;
}

export interface SalesPriceOffer {
	id: string;
	name: string;
	validFrom: string | null;
	validTo: string | null;
	requiredQty: number;
	type: string;
	discountValue: number;
	discountType: string;
	customerScope: string;
	unitType: string;
	isActive: boolean;
	createdAt?: string;
	updatedAt?: string;
}

export interface SavePriceOfferPayload {
	name: string;
	validFrom?: string;
	validTo?: string;
	requiredQty?: number;
	type?: string;
	discountValue: number;
	discountType?: string;
	customerScope?: string;
	unitType?: string;
	isActive?: boolean;
}

export const salesApi = {

customers: {
getAll:  () => api.get('/sales/customers').then(r => r.data),
getById: (id: string) => api.get(`/sales/customers/${id}`).then(r => r.data),
create:  (data: unknown) => api.post('/sales/customers', data).then(r => r.data),
update:  (id: string, data: unknown) => api.patch(`/sales/customers/${id}`, data).then(r => r.data),
delete:  (id: string) => api.delete(`/sales/customers/${id}`).then(r => r.data),
},

quotations: {
getAll:   () => api.get('/sales/quotations').then(r => r.data),
getById:  (id: string) => api.get(`/sales/quotations/${id}`).then(r => r.data),
create:   (data: unknown) => api.post('/sales/quotations', data).then(r => r.data),
update:   (id: string, data: unknown) => api.patch(`/sales/quotations/${id}`, data).then(r => r.data),
confirm:  (id: string) => api.patch(`/sales/quotations/${id}/confirm`).then(r => r.data),
send:     (id: string) => api.patch(`/sales/quotations/${id}/send`).then(r => r.data),
cancel:   (id: string) => api.patch(`/sales/quotations/${id}/cancel`).then(r => r.data),
delete:   (id: string) => api.delete(`/sales/quotations/${id}`).then(r => r.data),
},

orders: {
getAll:   () => api.get('/sales/orders').then(r => r.data),
getById:  (id: string) => api.get(`/sales/orders/${id}`).then(r => r.data),
create:   (data: unknown) => api.post('/sales/orders', data).then(r => r.data),
confirm:  (id: string) => api.patch(`/sales/orders/${id}/confirm`).then(r => r.data),
cancel:   (id: string) => api.patch(`/sales/orders/${id}/cancel`).then(r => r.data),
},

invoices: {
getAll: (orderId?: string) => {
const params = orderId ? `?orderId=${orderId}` : '';
return api.get(`/sales/invoices${params}`).then(r => r.data);
},
getById: (id: string) => api.get(`/sales/invoices/${id}`).then(r => r.data),
create:  (data: unknown) => api.post('/sales/invoices', data).then(r => r.data),
pay:     (id: string, data: unknown) => api.patch(`/sales/invoices/${id}/pay`, data).then(r => r.data),
cancel:  (id: string) => api.patch(`/sales/invoices/${id}/cancel`).then(r => r.data),
},

deliveries: {
getAll:    () => api.get('/sales/deliveries').then(r => r.data),
getByOrder:(orderId: string) => api.get(`/sales/deliveries?orderId=${orderId}`).then(r => r.data),
getById:   (id: string) => api.get(`/sales/deliveries/${id}`).then(r => r.data),
create:    (data: unknown) => api.post('/sales/deliveries', data).then(r => r.data),
confirm:   (id: string) => api.patch(`/sales/deliveries/${id}/confirm`).then(r => r.data),
},

returns: {
getAll:     () => api.get('/sales/sales-returns').then(r => r.data),
getByOrder: (orderId: string) => api.get(`/sales/sales-returns?orderId=${orderId}`).then(r => r.data),
getById:    (id: string) => api.get(`/sales/sales-returns/${id}`).then(r => r.data),
create:     (data: unknown) => api.post('/sales/sales-returns', data).then(r => r.data),
confirm:    (id: string) => api.patch(`/sales/sales-returns/${id}/confirm`).then(r => r.data),
cancel:     (id: string) => api.patch(`/sales/sales-returns/${id}/cancel`).then(r => r.data),
},

settings: {
priceLists: {
getAll: () => api.get<SalesPriceList[]>('/sales/settings/price-lists').then((r) => r.data),
create: (data: SavePriceListPayload) => api.post<SalesPriceList>('/sales/settings/price-lists', data).then((r) => r.data),
update: (id: string, data: Partial<SavePriceListPayload>) => api.patch<SalesPriceList>(`/sales/settings/price-lists/${id}`, data).then((r) => r.data),
delete: (id: string) => api.delete<{ success: true }>(`/sales/settings/price-lists/${id}`).then((r) => r.data),
bulkUpdate: (data: BulkUpdatePriceListsPayload) => api.post('/sales/settings/price-lists/bulk-update', data).then((r) => r.data),
},
orderSources: {
get: () => api.get<OrderSourcesConfig>('/sales/settings/order-sources').then((r) => r.data),
save: (data: SaveOrderSourcesPayload) => api.put<OrderSourcesConfig>('/sales/settings/order-sources', data).then((r) => r.data),
},
shipping: {
getConfig: () => api.get<ShippingConfig>('/sales/settings/shipping').then((r) => r.data),
updateConfig: (data: Partial<ShippingConfig>) => api.patch<ShippingConfig>('/sales/settings/shipping', data).then((r) => r.data),
getOptions: () => api.get<SalesShippingOption[]>('/sales/settings/shipping/options').then((r) => r.data),
createOption: (data: SaveShippingOptionPayload) => api.post<SalesShippingOption>('/sales/settings/shipping/options', data).then((r) => r.data),
updateOption: (id: string, data: Partial<SaveShippingOptionPayload>) => api.patch<SalesShippingOption>(`/sales/settings/shipping/options/${id}`, data).then((r) => r.data),
deleteOption: (id: string) => api.delete<{ success: true }>(`/sales/settings/shipping/options/${id}`).then((r) => r.data),
},
offers: {
getAll: () => api.get<SalesPriceOffer[]>('/sales/settings/offers').then((r) => r.data),
create: (data: SavePriceOfferPayload) => api.post<SalesPriceOffer>('/sales/settings/offers', data).then((r) => r.data),
update: (id: string, data: Partial<SavePriceOfferPayload>) => api.patch<SalesPriceOffer>(`/sales/settings/offers/${id}`, data).then((r) => r.data),
delete: (id: string) => api.delete<{ success: true }>(`/sales/settings/offers/${id}`).then((r) => r.data),
},
},

};
