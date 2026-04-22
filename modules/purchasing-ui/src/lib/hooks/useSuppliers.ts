import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { purchasingApi } from '../api/purchasing.api';
import { message } from 'antd';

export const useSuppliers = () => useQuery({
  queryKey: ['suppliers'],
  queryFn: purchasingApi.suppliers.getAll,
});

export const useCreateSupplier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: purchasingApi.suppliers.create,
    onSuccess: () => {
      message.success('تم إضافة المورد');
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      purchasingApi.suppliers.update(id, data),
    onSuccess: () => {
      message.success('تم تحديث المورد');
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};

export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: purchasingApi.suppliers.delete,
    onSuccess: () => {
      message.success('تم حذف المورد');
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};