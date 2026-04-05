import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '../api/inventory.api';
import { message } from 'antd';

export const useWarehouses = (branchId?: string) => {
  return useQuery({
    queryKey: ['warehouses', branchId],
    queryFn: () => inventoryApi.warehouses.getAll(branchId),
  });
};

export const useCreateWarehouse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inventoryApi.warehouses.create,
    onSuccess: () => {
      message.success('تم إضافة المخزن بنجاح');
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};