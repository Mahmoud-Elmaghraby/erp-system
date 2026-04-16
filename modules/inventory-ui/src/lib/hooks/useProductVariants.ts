import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '../api/inventory.api';
import { message } from 'antd';

export const useProductVariants = (productId: string) => useQuery({
  queryKey: ['variants', productId],
  queryFn: async () => {
    const res = await inventoryApi.variants.getByProduct(productId) as any;
    return res?.data ?? res ?? [];
  },
  enabled: !!productId,
});

export const useProductPriceHistory = (productId: string) => useQuery({
  queryKey: ['price-history', productId],
  queryFn: async () => {
    const res = await inventoryApi.priceHistory.getByProduct(productId) as any;
    return res?.data ?? res ?? [];
  },
  enabled: !!productId,
});

export const useCreateVariant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inventoryApi.variants.create,
    onSuccess: () => {
      message.success('تم إضافة المتغير');
      queryClient.invalidateQueries({ queryKey: ['variants'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};

export const useDeleteVariant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inventoryApi.variants.delete,
    onSuccess: () => {
      message.success('تم حذف المتغير');
      queryClient.invalidateQueries({ queryKey: ['variants'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};