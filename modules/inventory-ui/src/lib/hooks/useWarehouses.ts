import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '../api/inventory.api';
import { message } from 'antd';

const getErrorMessage = (error: any): string => {
  const msg = error?.response?.data?.message;
  if (Array.isArray(msg)) return msg.join(', ');
  if (typeof msg === 'string') return msg;
  return error?.message || 'حدث خطأ غير متوقع';
};

export const useWarehouses = () => useQuery({
  queryKey: ['warehouses'],
  queryFn: async () => {
    const res = await inventoryApi.warehouses.getAll() as any;
    return res?.data ?? res ?? [];
  },
});

export const useWarehouse = (id: string) => useQuery({
  queryKey: ['warehouses', id],
  queryFn: async () => {
    if (!id) return null;
    const res = await inventoryApi.warehouses.getOne(id) as any;
    return res?.data ?? res;
  },
  enabled: !!id,
});

export const useCreateWarehouse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inventoryApi.warehouses.create,
    onSuccess: () => {
      message.success('تم إضافة المخزن بنجاح');
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
    },
    onError: (error: any) => {
      console.error('Create warehouse error:', error?.response?.data || error);
      message.error(getErrorMessage(error));
    },
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
    onError: (error: any) => {
      console.error('Update warehouse error:', error?.response?.data || error);
      message.error(getErrorMessage(error));
    },
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
    onError: (error: any) => {
      console.error('Delete warehouse error:', error?.response?.data || error);
      message.error(getErrorMessage(error));
    },
  });
};