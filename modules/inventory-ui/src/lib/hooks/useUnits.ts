import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '../api/inventory.api';
import { message } from 'antd';

export const useUnits = () => useQuery({
  queryKey: ['units'],
  queryFn: async () => {
    const res = await inventoryApi.units.getAll() as any;
    return res?.data ?? res ?? [];
  },
});

export const useCreateUnit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inventoryApi.units.create,
    onSuccess: () => {
      message.success('تم إضافة وحدة القياس بنجاح');
      queryClient.invalidateQueries({ queryKey: ['units'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};

export const useUpdateUnit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      inventoryApi.units.update(id, data),
    onSuccess: () => {
      message.success('تم تعديل وحدة القياس بنجاح');
      queryClient.invalidateQueries({ queryKey: ['units'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};

export const useDeleteUnit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inventoryApi.units.delete,
    onSuccess: () => {
      message.success('تم حذف وحدة القياس');
      queryClient.invalidateQueries({ queryKey: ['units'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};