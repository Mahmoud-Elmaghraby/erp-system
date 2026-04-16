import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '../api/inventory.api';
import { message } from 'antd';

export const useCategories = () => useQuery({
  queryKey: ['categories'],
  queryFn: async () => {
    const res = await inventoryApi.categories.getAll() as any;
    return res?.data ?? res ?? [];
  },
});

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inventoryApi.categories.create,
    onSuccess: () => {
      message.success('تم إضافة التصنيف بنجاح');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inventoryApi.categories.delete,
    onSuccess: () => {
      message.success('تم حذف التصنيف');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};