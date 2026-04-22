import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountingApi } from '../api/accounting.api';
import { message } from 'antd';

export const useChartOfAccounts = (params?: { type?: string }) =>
  useQuery({
    queryKey: ['chart-of-accounts', params],
    queryFn: async () => {
      const res = await accountingApi.accounts.getAll(params) as any;
      return res?.data ?? res ?? [];
    },
  });

export const useCreateAccount = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => accountingApi.accounts.create(data),
    onSuccess: () => {
      message.success('تم إضافة الحساب');
      qc.invalidateQueries({ queryKey: ['chart-of-accounts'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};

export const useUpdateAccount = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      accountingApi.accounts.update(id, data),
    onSuccess: () => {
      message.success('تم تعديل الحساب');
      qc.invalidateQueries({ queryKey: ['chart-of-accounts'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};

export const useDeleteAccount = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => accountingApi.accounts.delete(id),
    onSuccess: () => {
      message.success('تم حذف الحساب');
      qc.invalidateQueries({ queryKey: ['chart-of-accounts'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};