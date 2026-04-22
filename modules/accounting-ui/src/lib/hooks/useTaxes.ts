import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountingApi } from '../api/accounting.api';
import { message } from 'antd';

export const useTaxes = (params?: { scope?: string }) =>
  useQuery({
    queryKey: ['taxes', params],
    queryFn: async () => {
      const res = await accountingApi.taxes.getAll(params) as any;
      return res?.data ?? res ?? [];
    },
  });

export const useCreateTax = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => accountingApi.taxes.create(data),
    onSuccess: () => {
      message.success('تم إضافة الضريبة');
      qc.invalidateQueries({ queryKey: ['taxes'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};

export const useUpdateTax = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      accountingApi.taxes.update(id, data),
    onSuccess: () => {
      message.success('تم تعديل الضريبة');
      qc.invalidateQueries({ queryKey: ['taxes'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};

export const useDeleteTax = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => accountingApi.taxes.delete(id),
    onSuccess: () => {
      message.success('تم حذف الضريبة');
      qc.invalidateQueries({ queryKey: ['taxes'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};