import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { salesApi } from '../api/sales.api';
import { message } from 'antd';

export const useInvoices = (orderId?: string) => useQuery({
  queryKey: ['invoices', orderId ?? 'all'],
  queryFn: async () => {
    const res = (await salesApi.invoices.getAll(orderId)) as { data?: unknown[] } | unknown[];
    if (Array.isArray(res)) return res;
    return Array.isArray(res.data) ? res.data : [];
  },
});

export const useInvoiceById = (id: string) => useQuery({
  queryKey: ['invoices', id],
  queryFn: () => salesApi.invoices.getById(id),
  enabled: !!id,
});

export const useCreateInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: salesApi.invoices.create,
    onSuccess: () => {
      message.success('تم إنشاء الفاتورة');
      qc.invalidateQueries({ queryKey: ['invoices'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};

export const useCreateDirectInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: salesApi.invoices.createDirect,
    onSuccess: () => {
      message.success('تم إنشاء الفاتورة بنجاح');
      qc.invalidateQueries({ queryKey: ['invoices'] });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message;
      message.error(Array.isArray(msg) ? msg.join(', ') : (msg || 'حدث خطأ أثناء إنشاء الفاتورة'));
    },
  });
};

export const useUpdateDirectInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      salesApi.invoices.updateDirect?.(id, data) || Promise.reject('Update method not available'),
    onSuccess: () => {
      message.success('تم تحديث الفاتورة بنجاح');
      qc.invalidateQueries({ queryKey: ['invoices'] });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message;
      message.error(Array.isArray(msg) ? msg.join(', ') : (msg || 'حدث خطأ أثناء تحديث الفاتورة'));
    },
  });
};

export const usePayInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      salesApi.invoices.pay(id, data),
    onSuccess: () => {
      message.success('تم تسجيل الدفع');
      qc.invalidateQueries({ queryKey: ['invoices'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};

export const useCancelInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: salesApi.invoices.cancel,
    onSuccess: () => {
      message.success('تم إلغاء الفاتورة');
      qc.invalidateQueries({ queryKey: ['invoices'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};