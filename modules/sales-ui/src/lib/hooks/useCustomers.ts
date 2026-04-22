import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { salesApi } from '../api/sales.api';
import { message } from 'antd';

export const useCustomers = () => useQuery({
  queryKey: ['customers'],
  queryFn: async () => {
    const res = (await salesApi.customers.getAll()) as { data?: unknown[] } | unknown[];
    if (Array.isArray(res)) return res;
    return Array.isArray(res.data) ? res.data : [];
  },
});

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: salesApi.customers.create,
    onSuccess: () => {
      message.success('تم إضافة العميل بنجاح');
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      salesApi.customers.update(id, data),
    onSuccess: () => {
      message.success('تم تعديل العميل بنجاح');
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: salesApi.customers.delete,
    onSuccess: () => {
      message.success('تم حذف العميل');
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};