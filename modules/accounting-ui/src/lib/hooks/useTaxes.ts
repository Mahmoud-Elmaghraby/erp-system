import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountingApi } from '../api/accounting.api';

const COMPANY_ID = 'default';

export const useTaxes = () =>
  useQuery({
    queryKey: ['taxes', COMPANY_ID],
    queryFn: () => accountingApi.taxes.getAll(COMPANY_ID),
  });

export const useCreateTax = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) =>
      accountingApi.taxes.create({ ...data, companyId: COMPANY_ID }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['taxes'] }),
  });
};

export const useUpdateTax = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      accountingApi.taxes.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['taxes'] }),
  });
};

export const useDeleteTax = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => accountingApi.taxes.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['taxes'] }),
  });
};