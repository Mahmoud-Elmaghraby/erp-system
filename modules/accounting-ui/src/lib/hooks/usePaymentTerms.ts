import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountingApi } from '../api/accounting.api';
import { message } from 'antd';

export const usePaymentTerms = () =>
  useQuery({
    queryKey: ['payment-terms'],
    queryFn: async () => {
      const res = await accountingApi.paymentTerms.getAll() as any;
      return res?.data ?? res ?? [];
    },
  });

export const useCreatePaymentTerm = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => accountingApi.paymentTerms.create(data),
    onSuccess: () => {
      message.success('تم إضافة شرط الدفع');
      qc.invalidateQueries({ queryKey: ['payment-terms'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};

export const useUpdatePaymentTerm = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      accountingApi.paymentTerms.update(id, data),
    onSuccess: () => {
      message.success('تم تعديل شرط الدفع');
      qc.invalidateQueries({ queryKey: ['payment-terms'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};

export const useDeletePaymentTerm = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => accountingApi.paymentTerms.delete(id),
    onSuccess: () => {
      message.success('تم حذف شرط الدفع');
      qc.invalidateQueries({ queryKey: ['payment-terms'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};