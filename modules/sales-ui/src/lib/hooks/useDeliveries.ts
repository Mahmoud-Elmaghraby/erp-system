import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { salesApi } from '../api/sales.api';
import { message } from 'antd';

export const useDeliveries = (orderId?: string) => useQuery({
  queryKey: ['deliveries', orderId ?? 'all'],
  queryFn: async () => {
    const res = (await (orderId
      ? salesApi.deliveries.getByOrder(orderId)
      : salesApi.deliveries.getAll())) as { data?: unknown[] } | unknown[];
    if (Array.isArray(res)) return res;
    return Array.isArray(res.data) ? res.data : [];
  },
});

export const useCreateDelivery = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: salesApi.deliveries.create,
    onSuccess: () => {
      message.success('تم إنشاء التسليم');
      qc.invalidateQueries({ queryKey: ['deliveries'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};

export const useConfirmDelivery = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: salesApi.deliveries.confirm,
    onSuccess: () => {
      message.success('تم تأكيد التسليم');
      qc.invalidateQueries({ queryKey: ['deliveries'] });
      qc.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};