import axios from 'axios';
import { 
  ChartOfAccount, 
  CreateAccountPayload, 
  UpdateAccountPayload 
} from '../types/chart-of-accounts.types';

// 1. إعداد الـ Axios Instance بنفس طريقة الملف الشغال عندك
const api = axios.create({
  baseURL: import.meta.env['VITE_API_URL'] || 'http://localhost:3000/api',
});

// 2. إضافة الـ Interceptor لتمرير الـ Token (مهم جداً عشان الـ 401)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// المسار الرئيسي للموديول
const RESOURCE_PATH = '/accounting/chart-of-accounts';

export const ChartOfAccountsAPI = {
  // جلب الشجرة كاملة 
  // ملاحظة: لو الباك إند بيرجع الشجرة على المسار الرئيسي مباشرة استخدم RESOURCE_PATH
 getTree: async (): Promise<ChartOfAccount[]> => {
    const response = await api.get(RESOURCE_PATH);
    
    // التعديل السحري هنا:
    // لأن الباك إند بيبعت { data: [...] }
    // إحنا محتاجين نرجع response.data.data (المصفوفة نفسها)
    return response.data.data || response.data || [];
  },
getById: async (id: string): Promise<ChartOfAccount> => {
    const response = await api.get(`${RESOURCE_PATH}/${id}`);
    // نفس الكلام هنا لو البيانات مغلفة
    return response.data.data || response.data;
  },

  // إضافة حساب جديد
  create: async (data: CreateAccountPayload): Promise<ChartOfAccount> => {
    const response = await api.post(RESOURCE_PATH, data);
    return response.data.data || response.data;
  },

  // تعديل حساب
  update: async (id: string, data: UpdateAccountPayload): Promise<ChartOfAccount> => {
    const response = await api.patch(`${RESOURCE_PATH}/${id}`, data);
    return response.data.data || response.data;
  },

  // نقل حساب (تغيير الأب)
  move: async (id: string, parentId: string | null): Promise<ChartOfAccount> => {
    const response = await api.patch(`${RESOURCE_PATH}/${id}/move`, { parentId });
    return response.data.data || response.data;
  },

  // حذف حساب
  delete: async (id: string): Promise<void> => {
    await api.delete(`${RESOURCE_PATH}/${id}`);
  },
};