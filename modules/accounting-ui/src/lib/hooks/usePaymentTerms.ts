import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountingApi } from '../api/accounting.api';

const COMPANY_ID = 'default';

export const usePaymentTerms = () =>
  useQuery({
    queryKey: ['payment-terms', COMPANY_ID],
    queryFn: () => accountingApi.paymentTerms.getAll(COMPANY_ID),
  });

export const useCreatePaymentTerm = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) =>
      accountingApi.paymentTerms.create({ ...data, companyId: COMPANY_ID }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['payment-terms'] }),
  });
};

export const useUpdatePaymentTerm = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      accountingApi.paymentTerms.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['payment-terms'] }),
  });
};

export const useDeletePaymentTerm = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => accountingApi.paymentTerms.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['payment-terms'] }),
  });
};