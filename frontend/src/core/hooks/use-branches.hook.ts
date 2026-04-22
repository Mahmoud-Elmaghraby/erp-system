import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { branchesApi, PaginationParams } from '../api/core.api';

export const useBranches = (params?: PaginationParams) =>
  useQuery({
    queryKey: ['branches', params],
    queryFn: () => branchesApi.getAll(params),
  });

export const useCreateBranch = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: branchesApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['branches'] });
      message.success('تم إنشاء الفرع');
    },
    onError: () => {
      message.error('حدث خطأ');
    },
  });
};

export const useUpdateBranch = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      branchesApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['branches'] });
      message.success('تم التعديل');
    },
    onError: () => {
      message.error('حدث خطأ');
    },
  });
};

export const useDeactivateBranch = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: branchesApi.deactivate,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['branches'] });
      message.success('تم تعطيل الفرع');
    },
    onError: () => {
      message.error('حدث خطأ');
    },
  });
};