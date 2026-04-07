import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '../api/inventory.api';
import { message } from 'antd';

export const useInventorySettings = (companyId: string) => {
  return useQuery({
    queryKey: ['inventory-settings', companyId],
    queryFn: () => inventoryApi.settings.get(companyId),
    enabled: !!companyId,
  });
};

export const useUpdateInventorySettings = (companyId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => inventoryApi.settings.update(companyId, data),
    onSuccess: () => {
      message.success('تم حفظ الإعدادات');
      queryClient.invalidateQueries({ queryKey: ['inventory-settings', companyId] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};