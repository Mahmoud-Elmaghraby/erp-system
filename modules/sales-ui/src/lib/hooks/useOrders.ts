import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { salesApi } from '../api/sales.api';
import { message } from 'antd';

export const useOrders = (branchId: string) => useQuery({
  queryKey: ['orders', branchId],
  queryFn: () => salesApi.orders.getAll(branchId),
  enabled: !!branchId,
});

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: salesApi.orders.create,
    onSuccess: () => {
      message.success('تم إنشاء الأوردر بنجاح');
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};

export const useConfirmOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: salesApi.orders.confirm,
    onSuccess: () => {
      message.success('تم تأكيد الأوردر');
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};