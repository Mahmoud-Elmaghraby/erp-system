import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountingApi } from '../api/accounting.api';
import { message } from 'antd';

export const useFiscalYears = () =>
  useQuery({
    queryKey: ['fiscal-years'],
    queryFn: async () => {
      const res = await accountingApi.fiscalYears.getAll() as any;
      return res?.data ?? res ?? [];
    },
  });

export const useFiscalYear = (id: string) =>
  useQuery({
    queryKey: ['fiscal-years', id],
    queryFn: () => accountingApi.fiscalYears.getOne(id),
    enabled: !!id,
  });

export const useCreateFiscalYear = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; startDate: string; endDate: string }) =>
      accountingApi.fiscalYears.create(data),
    onSuccess: () => {
      message.success('تم إنشاء السنة المالية');
      qc.invalidateQueries({ queryKey: ['fiscal-years'] });
    },
    onError: (error: any) => {
      const status = error?.response?.status;
      if (status === 409) {
        message.error('سنة مالية بنفس تاريخ البداية موجودة بالفعل');
      } else {
        message.error('حدث خطأ أثناء إنشاء السنة المالية');
      }
    },
  });
};

export const useCloseFiscalYear = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => accountingApi.fiscalYears.close(id),
    onSuccess: () => {
      message.success('تم إغلاق السنة المالية');
      qc.invalidateQueries({ queryKey: ['fiscal-years'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};

export const useLockFiscalYear = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => accountingApi.fiscalYears.lock(id),
    onSuccess: () => {
      message.success('تم قفل السنة المالية');
      qc.invalidateQueries({ queryKey: ['fiscal-years'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};

export const useUpdatePeriodStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ periodId, status }: { periodId: string; status: 'OPEN' | 'SOFT_LOCKED' | 'HARD_LOCKED' }) =>
      accountingApi.fiscalYears.updatePeriodStatus(periodId, status),
    onSuccess: () => {
      message.success('تم تحديث حالة الفترة');
      qc.invalidateQueries({ queryKey: ['fiscal-years'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};