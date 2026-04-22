import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { purchasingApi } from '../api/purchasing.api';
import { message } from 'antd';

export const useVendorBills = (orderId: string) => useQuery({
  queryKey: ['vendor-bills', orderId],
  queryFn: () => purchasingApi.bills.getByOrder(orderId),
  enabled: !!orderId,
});

export const useCreateVendorBill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: purchasingApi.bills.create,
    onSuccess: () => {
      message.success('تم إنشاء الفاتورة');
      queryClient.invalidateQueries({ queryKey: ['vendor-bills'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};

export const usePayVendorBill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, amount }: { id: string; amount: number }) =>
      purchasingApi.bills.pay(id, amount),
    onSuccess: () => {
      message.success('تم تسجيل الدفع');
      queryClient.invalidateQueries({ queryKey: ['vendor-bills'] });
    },
    onError: () => message.error('حدث خطأ'),
  });
};