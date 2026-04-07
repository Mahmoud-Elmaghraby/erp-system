import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { salesApi } from '../api/sales.api';
import { message } from 'antd';

export const useInvoices = (orderId: string) => useQuery({
  queryKey: ['invoices', orderId],
  queryFn: () => salesApi.invoices.getByOrder(orderId),
  enabled: !!orderId,
});

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: salesApi.invoices.create,
    onSuccess: () => {
      message.success('تم إنشاء الفاتورة');
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};

export const usePayInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, amount }: { id: string; amount: number }) =>
      salesApi.invoices.pay(id, amount),
    onSuccess: () => {
      message.success('تم تسجيل الدفع');
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};