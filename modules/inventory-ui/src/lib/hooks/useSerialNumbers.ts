import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '../api/inventory.api';
import { message } from 'antd';

export const useSerialNumbers = (productId: string, warehouseId?: string) => useQuery({
  queryKey: ['serial-numbers', productId, warehouseId],
  queryFn: async () => {
    const res = await inventoryApi.serialNumbers.getByProduct(productId, warehouseId) as any;
    return res?.data ?? res ?? [];
  },
  enabled: !!productId,
});

export const useCreateSerialNumbers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inventoryApi.serialNumbers.createMany,
    onSuccess: () => {
      message.success('تم إضافة الأرقام التسلسلية');
      queryClient.invalidateQueries({ queryKey: ['serial-numbers'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};

export const useUpdateSerialStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      inventoryApi.serialNumbers.updateStatus(id, status),
    onSuccess: () => {
      message.success('تم تحديث الحالة');
      queryClient.invalidateQueries({ queryKey: ['serial-numbers'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};