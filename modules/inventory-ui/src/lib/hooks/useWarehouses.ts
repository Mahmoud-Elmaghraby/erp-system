import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '../api/inventory.api';
import { message } from 'antd';

export const useWarehouses = () => useQuery({
  queryKey: ['warehouses'],
  queryFn: async () => {
    const res = await inventoryApi.warehouses.getAll() as any;
    return res?.data ?? res ?? [];
  },
});

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

export const useUpdateWarehouse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      inventoryApi.warehouses.update(id, data),
    onSuccess: () => {
      message.success('تم تعديل المخزن بنجاح');
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};

export const useDeleteWarehouse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inventoryApi.warehouses.delete,
    onSuccess: () => {
      message.success('تم حذف المخزن');
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};