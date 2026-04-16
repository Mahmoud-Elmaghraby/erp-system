import api from './axios.config';

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface ApiResponse<T> {
  data: T;
}

// ===== AUTH =====
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials).then(r => r.data),
  logout: () =>
    api.post('/auth/logout').then(r => r.data),
  me: () =>
    api.get('/auth/me').then(r => r.data.data),
};

// ===== COMPANIES =====
export const companiesApi = {
  getMyCompany: () =>
    api.get('/companies/me').then(r => r.data.data),
  updateMyCompany: (data: { name?: string; phone?: string; address?: string }) =>
    api.patch('/companies/me', data).then(r => r.data.data),
};

// ===== BRANCHES =====
export const branchesApi = {
  getAll: (params?: PaginationParams) =>
    api.get('/branches', { params }).then(r => r.data as PaginatedResponse<Branch>),
  getOne: (id: string) =>
    api.get(`/branches/${id}`).then(r => r.data.data as Branch),
  create: (data: { name: string; address?: string; phone?: string }) =>
    api.post('/branches', data).then(r => r.data.data as Branch),
  update: (id: string, data: { name?: string; address?: string; phone?: string }) =>
    api.patch(`/branches/${id}`, data).then(r => r.data.data as Branch),
  deactivate: (id: string) =>
    api.delete(`/branches/${id}`).then(r => r.data.data),
};

// ===== USERS =====
export const usersApi = {
  getAll: (params?: PaginationParams) =>
    api.get('/users', { params }).then(r => r.data as PaginatedResponse<User>),
  getOne: (id: string) =>
    api.get(`/users/${id}`).then(r => r.data.data as User),
  create: (data: { name: string; email: string; password: string; branchId?: string }) =>
    api.post('/users', data).then(r => r.data.data as User),
  update: (id: string, data: { name?: string; password?: string; branchId?: string }) =>
    api.patch(`/users/${id}`, data).then(r => r.data.data as User),
  deactivate: (id: string) =>
    api.delete(`/users/${id}`).then(r => r.data.data),
};

// ===== RBAC =====
export const rbacApi = {
  getRoles: (params?: PaginationParams) =>
    api.get('/rbac/roles', { params }).then(r => r.data as PaginatedResponse<Role>),
  getRole: (id: string) =>
    api.get(`/rbac/roles/${id}`).then(r => r.data.data as Role),
  createRole: (data: { name: string; description?: string }) =>
    api.post('/rbac/roles', data).then(r => r.data.data as Role),
  deactivateRole: (id: string) =>
    api.delete(`/rbac/roles/${id}`).then(r => r.data.data),
  getPermissions: (module?: string) =>
    api.get('/rbac/permissions', { params: { module } }).then(r => r.data.data as Permission[]),
  assignPermission: (roleId: string, permissionId: string) =>
    api.post(`/rbac/roles/${roleId}/permissions`, { permissionId }).then(r => r.data.data),
  removePermission: (roleId: string, permissionId: string) =>
    api.delete(`/rbac/roles/${roleId}/permissions/${permissionId}`).then(r => r.data.data),
  getUserRoles: (userId: string) =>
    api.get(`/rbac/users/${userId}/roles`).then(r => r.data.data),
  assignRole: (userId: string, roleId: string) =>
    api.post(`/rbac/users/${userId}/roles`, { roleId }).then(r => r.data.data),
  removeRole: (userId: string, roleId: string) =>
    api.delete(`/rbac/users/${userId}/roles/${roleId}`).then(r => r.data.data),
  getMyPermissions: () =>
    api.get('/rbac/me/permissions').then(r => r.data.data as string[]),
};

// ===== SETTINGS =====
export const companySettingsApi = {
  get: () =>
    api.get('/company-settings').then(r => r.data.data),
  update: (data: any) =>
    api.patch('/company-settings', data).then(r => r.data.data),
};

export const currenciesApi = {
  getAll: () =>
    api.get('/currencies').then(r => r.data.data),
  create: (data: any) =>
    api.post('/currencies', data).then(r => r.data.data),
  update: (id: string, data: any) =>
    api.patch(`/currencies/${id}`, data).then(r => r.data.data),
  addRate: (id: string, rate: number) =>
    api.post(`/currencies/${id}/exchange-rates`, { rate }).then(r => r.data.data),
  getRates: (id: string) =>
    api.get(`/currencies/${id}/exchange-rates`).then(r => r.data.data),
};

export const documentSequencesApi = {
  getAll: () =>
    api.get('/document-sequences').then(r => r.data.data),
};

export const moduleSettingsApi = {
  getAll: () =>
    api.get('/settings').then(r => r.data.data),
  getModule: (module: string) =>
    api.get(`/settings/${module}`).then(r => r.data.data),
  update: (module: string, values: any) =>
    api.put(`/settings/${module}`, values).then(r => r.data.data),
};

// ===== TYPES =====
export interface Branch {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  isActive: boolean;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  companyId: string;
  branchId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  companyId?: string;
  rolePermissions?: { permission: Permission }[];
  _count?: { userRoles: number };
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
  module: string;
}