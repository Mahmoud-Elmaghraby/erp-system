import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '../api/inventory.api';
import { message } from 'antd';

export const useReorderingRules = (warehouseId?: string) => useQuery({
  queryKey: ['reordering-rules', warehouseId],
  queryFn: async () => {
    const res = await inventoryApi.reorderingRules.getAll(warehouseId) as any;
    return res?.data ?? res ?? [];
  },
});

export const useUpsertReorderingRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inventoryApi.reorderingRules.upsert,
    onSuccess: () => {
      message.success('تم حفظ قاعدة إعادة الطلب');
      queryClient.invalidateQueries({ queryKey: ['reordering-rules'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};

export const useDeleteReorderingRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inventoryApi.reorderingRules.delete,
    onSuccess: () => {
      message.success('تم حذف القاعدة');
      queryClient.invalidateQueries({ queryKey: ['reordering-rules'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};