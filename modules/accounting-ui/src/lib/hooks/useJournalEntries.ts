import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountingApi } from '../api/accounting.api';
import { message } from 'antd';

export const useJournalEntries = (params?: { page?: number; limit?: number; search?: string }) =>
  useQuery({
    queryKey: ['journal-entries', params],
    queryFn: async () => {
      const res = await accountingApi.journalEntries.getAll(params) as any;
      return res?.data ?? res ?? [];
    },
  });

export const useCreateJournalEntry = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => accountingApi.journalEntries.create(data),
    onSuccess: () => {
      message.success('تم إنشاء القيد');
      qc.invalidateQueries({ queryKey: ['journal-entries'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};

export const usePostJournalEntry = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => accountingApi.journalEntries.post(id),
    onSuccess: () => {
      message.success('تم اعتماد القيد');
      qc.invalidateQueries({ queryKey: ['journal-entries'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};

export const useCancelJournalEntry = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => accountingApi.journalEntries.cancel(id),
    onSuccess: () => {
      message.success('تم إلغاء القيد');
      qc.invalidateQueries({ queryKey: ['journal-entries'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};