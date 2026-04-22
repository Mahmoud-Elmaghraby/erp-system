import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '../api/inventory.api';
import { message } from 'antd';

export const useStock = (warehouseId?: string) => useQuery({
  queryKey: ['stock', warehouseId],
  queryFn: async () => {
    const res = await inventoryApi.stock.getByWarehouse(warehouseId!) as any;
    return res?.data ?? res ?? [];
  },
  enabled: !!warehouseId,
});

export const useAddStock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inventoryApi.stock.add,
    onSuccess: () => {
      message.success('تم إضافة المخزون');
      queryClient.invalidateQueries({ queryKey: ['stock'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};

export const useRemoveStock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inventoryApi.stock.remove,
    onSuccess: () => {
      message.success('تم خصم المخزون');
      queryClient.invalidateQueries({ queryKey: ['stock'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};

export const useTransferStock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inventoryApi.stock.transfer,
    onSuccess: () => {
      message.success('تم تحويل المخزون');
      queryClient.invalidateQueries({ queryKey: ['stock'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};