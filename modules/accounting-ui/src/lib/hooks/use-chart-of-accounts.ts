import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChartOfAccountsAPI } from '../api/chart-of-accounts.api';
import { CreateAccountPayload, UpdateAccountPayload } from '../types/chart-of-accounts.types';

// ثوابت مفاتيح الكاشينج عشان ما نغلطش في كتابتها
export const ACCOUNTS_QUERY_KEYS = {
  tree: ['chart-of-accounts', 'tree'] as const,
  details: (id: string) => ['chart-of-accounts', id] as const,
};

// 1. Hook: Get Tree
export const useAccountsTree = () => {
  return useQuery({
    queryKey: ACCOUNTS_QUERY_KEYS.tree,
    queryFn: ChartOfAccountsAPI.getTree,
    // الشجرة دي مهمة، ممكن نخلي الكاشينج بتاعها طويل شوية
    staleTime: 5 * 60 * 1000, 
  });
};

// 2. Hook: Get Single Account
export const useAccountDetails = (id?: string) => {
  return useQuery({
    queryKey: ACCOUNTS_QUERY_KEYS.details(id!),
    queryFn: () => ChartOfAccountsAPI.getById(id!),
    enabled: !!id, // مش هيعمل Call إلا لو الـ ID موجود
  });
};

// 3. Hook: Create Account
export const useCreateAccount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateAccountPayload) => ChartOfAccountsAPI.create(data),
    onSuccess: () => {
      // تفريغ الكاش عشان الشجرة تعمل Re-fetch بالبيانات الجديدة
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEYS.tree });
    },
  });
};

// 4. Hook: Update Account
export const useUpdateAccount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAccountPayload }) => 
      ChartOfAccountsAPI.update(id, data),
    onSuccess: (_, variables) => {
      // تحديث الشجرة وتحديث تفاصيل الحساب نفسه
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEYS.tree });
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEYS.details(variables.id) });
    },
  });
};

// 5. Hook: Move Account
export const useMoveAccount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, parentId }: { id: string; parentId: string | null }) => 
      ChartOfAccountsAPI.move(id, parentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEYS.tree });
    },
  });
};

// 6. Hook: Delete Account
export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => ChartOfAccountsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEYS.tree });
    },
  });
};