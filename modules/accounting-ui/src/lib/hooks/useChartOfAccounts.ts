import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountingApi } from '../api/accounting.api';

const COMPANY_ID = 'default';

export const useChartOfAccounts = () =>
  useQuery({
    queryKey: ['chart-of-accounts', COMPANY_ID],
    queryFn: () => accountingApi.accounts.getAll(COMPANY_ID),
  });

export const useCreateAccount = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) =>
      accountingApi.accounts.create({ ...data, companyId: COMPANY_ID }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['chart-of-accounts'] }),
  });
};

export const useUpdateAccount = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      accountingApi.accounts.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['chart-of-accounts'] }),
  });
};

export const useDeleteAccount = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => accountingApi.accounts.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['chart-of-accounts'] }),
  });
};