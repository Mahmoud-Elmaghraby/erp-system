import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '../api/inventory.api';
import { message } from 'antd';

export const useUnits = () => {
  return useQuery({
    queryKey: ['units'],
    queryFn: inventoryApi.units.getAll,
  });
};

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