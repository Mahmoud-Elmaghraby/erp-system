import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { salesApi } from '../api/sales.api';
import { message } from 'antd';

export const useQuotations = () => useQuery({
  queryKey: ['quotations'],
  queryFn: async () => {
    const res = await salesApi.quotations.getAll() as any;
    return res?.data ?? res ?? [];
  },
});

export const useCreateQuotation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: salesApi.quotations.create,
    onSuccess: () => {
      message.success('تم إنشاء عرض السعر');
      qc.invalidateQueries({ queryKey: ['quotations'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};

export const useUpdateQuotation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      salesApi.quotations.update(id, data),
    onSuccess: () => {
      message.success('تم تعديل عرض السعر');
      qc.invalidateQueries({ queryKey: ['quotations'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};

export const useConfirmQuotation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: salesApi.quotations.confirm,
    onSuccess: () => {
      message.success('تم التأكيد وإنشاء أمر بيع');
      qc.invalidateQueries({ queryKey: ['quotations'] });
      qc.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};

export const useSendQuotation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: salesApi.quotations.send,
    onSuccess: () => {
      message.success('تم إرسال عرض السعر');
      qc.invalidateQueries({ queryKey: ['quotations'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};

export const useCancelQuotation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: salesApi.quotations.cancel,
    onSuccess: () => {
      message.success('تم إلغاء عرض السعر');
      qc.invalidateQueries({ queryKey: ['quotations'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};

export const useDeleteQuotation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: salesApi.quotations.delete,
    onSuccess: () => {
      message.success('تم الحذف');
      qc.invalidateQueries({ queryKey: ['quotations'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};