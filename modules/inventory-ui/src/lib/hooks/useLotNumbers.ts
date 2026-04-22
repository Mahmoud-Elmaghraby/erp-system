import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '../api/inventory.api';
import { message } from 'antd';

export const useLotNumbers = (productId: string, warehouseId?: string) => useQuery({
  queryKey: ['lot-numbers', productId, warehouseId],
  queryFn: async () => {
    const res = await inventoryApi.lotNumbers.getByProduct(productId, warehouseId) as any;
    return res?.data ?? res ?? [];
  },
  enabled: !!productId,
});

export const useCreateLotNumber = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inventoryApi.lotNumbers.create,
    onSuccess: () => {
      message.success('تم إضافة رقم الدفعة');
      queryClient.invalidateQueries({ queryKey: ['lot-numbers'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};