import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '../api/inventory.api';
import { message } from 'antd';

export const useInventorySettings = () => {
  return useQuery({
    queryKey: ['inventory-settings'],
    queryFn: async () => {
      const res = await inventoryApi.settings.get() as any;
      return res?.data ?? res;
    },
  });
};

export const useUpdateInventorySettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => inventoryApi.settings.update(data),
    onSuccess: () => {
      message.success('تم حفظ الإعدادات');
      queryClient.invalidateQueries({ queryKey: ['inventory-settings'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};