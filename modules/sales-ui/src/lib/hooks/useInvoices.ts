import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { salesApi } from '../api/sales.api';
import { message } from 'antd';

export const useInvoices = (orderId?: string) => useQuery({
  queryKey: ['invoices', orderId ?? 'all'],
  queryFn: async () => {
    const res = await salesApi.invoices.getAll(orderId) as any;
    return res?.data ?? res ?? [];
  },
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

export const usePayInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
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