import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { purchasingApi } from '../api/purchasing.api';
import { message } from 'antd';

export const usePurchaseOrders = (branchId?: string) => useQuery({
  queryKey: ['purchase-orders', branchId],
  queryFn: () => purchasingApi.orders.getAll(branchId),
});

export const usePurchaseOrder = (id: string) => useQuery({
  queryKey: ['purchase-order', id],
  queryFn: () => purchasingApi.orders.getById(id),
  enabled: !!id,
});

export const useCreatePurchaseOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: purchasingApi.orders.create,
    onSuccess: () => {
      message.success('تم إنشاء أمر الشراء');
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};

export const useConfirmPurchaseOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: purchasingApi.orders.confirm,
    onSuccess: () => {
      message.success('تم تأكيد أمر الشراء');
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      queryClient.invalidateQueries({ queryKey: ['purchase-order'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};