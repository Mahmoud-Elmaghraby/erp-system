import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '../api/inventory.api';
import { message } from 'antd';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: inventoryApi.products.getAll,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inventoryApi.products.create,
    onSuccess: () => {
      message.success('تم إضافة المنتج بنجاح');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inventoryApi.products.delete,
    onSuccess: () => {
      message.success('تم حذف المنتج');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};