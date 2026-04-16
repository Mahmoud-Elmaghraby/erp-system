import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { usersApi, PaginationParams } from '../api/core.api';

export const useUsers = (params?: PaginationParams) =>
  useQuery({
    queryKey: ['users', params],
    queryFn: () => usersApi.getAll(params),
  });

export const useCreateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); message.success('تم إنشاء المستخدم'); },
    onError: () => message.error('حدث خطأ'),
  });
};

export const useUpdateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => usersApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); message.success('تم التعديل'); },
    onError: () => message.error('حدث خطأ'),
  });
};

export const useDeactivateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: usersApi.deactivate,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); message.success('تم تعطيل المستخدم'); },
    onError: () => message.error('حدث خطأ'),
  });
};