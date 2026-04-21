import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { salesApi } from '../api/sales.api';
import { message } from 'antd';

export const useOrders = () => useQuery({
  queryKey: ['orders'],
  queryFn: async () => {
    const res = (await salesApi.orders.getAll()) as { data?: unknown[] } | unknown[];
    if (Array.isArray(res)) return res;
    return Array.isArray(res.data) ? res.data : [];
  },
});

// ✅ تم إضافة هذا الـ Hook الخاص بالتفاصيل
export const useOrder = (id?: string) => useQuery({
  queryKey: ['order', id],
  queryFn: async () => {
    if (!id) return null;
    const res = await salesApi.orders.getById(id);
    return res?.data ?? res ?? null;
  },
  enabled: !!id,
});

export const useCreateOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: salesApi.orders.create,
    onSuccess: () => {
      message.success('تم إنشاء أمر البيع بنجاح');
      qc.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: () => message.error('حدث خطأ أثناء الإنشاء'),
  });
};

export const useConfirmOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: salesApi.orders.confirm,
    onSuccess: () => {
      message.success('تم تأكيد الأمر بنجاح');
      qc.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: () => message.error('حدث خطأ أثناء التأكيد'),
  });
};

export const useCancelOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: salesApi.orders.cancel,
    onSuccess: () => {
      message.success('تم إلغاء الأمر');
      qc.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: () => message.error('حدث خطأ أثناء الإلغاء'),
  });
};