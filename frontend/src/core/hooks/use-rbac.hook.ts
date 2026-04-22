import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { rbacApi, PaginationParams } from '../api/core.api';

export const useRoles = (params?: PaginationParams) =>
  useQuery({
    queryKey: ['roles', params],
    queryFn: () => rbacApi.getRoles(params),
  });

export const usePermissions = (module?: string) =>
  useQuery({
    queryKey: ['permissions', module],
    queryFn: () => rbacApi.getPermissions(module),
  });

export const useCreateRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: rbacApi.createRole,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['roles'] }); message.success('تم إنشاء الدور'); },
    onError: () => message.error('حدث خطأ'),
  });
};

export const useAssignPermission = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ roleId, permissionId }: { roleId: string; permissionId: string }) =>
      rbacApi.assignPermission(roleId, permissionId),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['roles'] }); message.success('تم إضافة الصلاحية'); },
    onError: () => message.error('حدث خطأ'),
  });
};

export const useRemovePermission = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ roleId, permissionId }: { roleId: string; permissionId: string }) =>
      rbacApi.removePermission(roleId, permissionId),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['roles'] }); message.success('تم حذف الصلاحية'); },
    onError: () => message.error('حدث خطأ'),
  });
};

export const useAssignRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) =>
      rbacApi.assignRole(userId, roleId),
    onSuccess: (_, { userId }) => {
      qc.invalidateQueries({ queryKey: ['user-roles', userId] });
      message.success('تم إضافة الدور');
    },
    onError: () => message.error('حدث خطأ'),
  });
};

export const useRemoveRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) =>
      rbacApi.removeRole(userId, roleId),
    onSuccess: (_, { userId }) => {
      qc.invalidateQueries({ queryKey: ['user-roles', userId] });
      message.success('تم حذف الدور');
    },
    onError: () => message.error('حدث خطأ'),
  });
};