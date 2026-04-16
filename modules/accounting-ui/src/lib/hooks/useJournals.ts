import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountingApi } from '../api/accounting.api';
import { message } from 'antd';

export const useJournals = () =>
  useQuery({
    queryKey: ['journals'],
    queryFn: async () => {
      const res = await accountingApi.journals.getAll() as any;
      return res?.data ?? res ?? [];
    },
  });

export const useCreateJournal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => accountingApi.journals.create(data),
    onSuccess: () => {
      message.success('تم إضافة اليومية');
      qc.invalidateQueries({ queryKey: ['journals'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};

export const useUpdateJournal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      accountingApi.journals.update(id, data),
    onSuccess: () => {
      message.success('تم تعديل اليومية');
      qc.invalidateQueries({ queryKey: ['journals'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};

export const useDeleteJournal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => accountingApi.journals.delete(id),
    onSuccess: () => {
      message.success('تم حذف اليومية');
      qc.invalidateQueries({ queryKey: ['journals'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};