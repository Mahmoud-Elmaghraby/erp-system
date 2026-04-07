import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '../api/inventory.api';
import { message } from 'antd';

export const useAdjustments = (warehouseId?: string) => useQuery({
  queryKey: ['adjustments', warehouseId],
  queryFn: () => inventoryApi.adjustments.getAll(warehouseId),
});

export const useCreateAdjustment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inventoryApi.adjustments.create,
    onSuccess: () => {
      message.success('تم إنشاء التسوية');
      queryClient.invalidateQueries({ queryKey: ['adjustments'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};

export const useConfirmAdjustment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inventoryApi.adjustments.confirm,
    onSuccess: () => {
      message.success('تم تأكيد التسوية وتحديث المخزون');
      queryClient.invalidateQueries({ queryKey: ['adjustments'] });
      queryClient.invalidateQueries({ queryKey: ['stock'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};