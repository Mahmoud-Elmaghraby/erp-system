import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { purchasingApi } from '../api/purchasing.api';
import { message } from 'antd';

export const usePurchaseReceipts = (orderId: string) => useQuery({
  queryKey: ['purchase-receipts', orderId],
  queryFn: () => purchasingApi.receipts.getByOrder(orderId),
  enabled: !!orderId,
});

export const useCreatePurchaseReceipt = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: purchasingApi.receipts.create,
    onSuccess: () => {
      message.success('تم تسجيل الاستلام وتحديث المخزون');
      queryClient.invalidateQueries({ queryKey: ['purchase-receipts'] });
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      queryClient.invalidateQueries({ queryKey: ['stock'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};