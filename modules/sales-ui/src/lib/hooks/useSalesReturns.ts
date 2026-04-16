import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { salesApi } from '../api/sales.api';
import { message } from 'antd';

export const useSalesReturns = (orderId?: string) => useQuery({
  queryKey: ['sales-returns', orderId ?? 'all'],
  queryFn: async () => {
    const res = await (orderId
      ? salesApi.returns.getByOrder(orderId)
      : salesApi.returns.getAll()) as any;
    return res?.data ?? res ?? [];
  },
});

export const useCreateSalesReturn = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: salesApi.returns.create,
    onSuccess: () => {
      message.success('تم إنشاء المرتجع');
      qc.invalidateQueries({ queryKey: ['sales-returns'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};

export const useConfirmSalesReturn = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: salesApi.returns.confirm,
    onSuccess: () => {
      message.success('تم تأكيد المرتجع وإعادة المخزون');
      qc.invalidateQueries({ queryKey: ['sales-returns'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};

export const useCancelSalesReturn = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: salesApi.returns.cancel,
    onSuccess: () => {
      message.success('تم إلغاء المرتجع');
      qc.invalidateQueries({ queryKey: ['sales-returns'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};