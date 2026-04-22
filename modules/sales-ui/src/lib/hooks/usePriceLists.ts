import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import {
  BulkUpdatePriceListsPayload,
  salesApi,
  SalesPriceList,
  SavePriceListPayload,
} from '../api/sales.api';

const priceListsKey = ['sales-settings', 'price-lists'] as const;

export const usePriceLists = () => useQuery<SalesPriceList[]>({
  queryKey: priceListsKey,
  queryFn: async () => {
    const res = await salesApi.settings.priceLists.getAll();
    return res ?? [];
  },
});

export const useCreatePriceList = () => {
  const qc = useQueryClient();

  return useMutation<SalesPriceList, Error, SavePriceListPayload>({
    mutationFn: salesApi.settings.priceLists.create,
    onSuccess: () => {
      message.success('تمت إضافة قائمة الأسعار بنجاح');
      qc.invalidateQueries({ queryKey: priceListsKey });
    },
    onError: () => message.error('تعذر إضافة قائمة الأسعار'),
  });
};

export const useUpdatePriceList = () => {
  const qc = useQueryClient();

  return useMutation<SalesPriceList, Error, { id: string; data: Partial<SavePriceListPayload> }>({
    mutationFn: ({ id, data }) =>
      salesApi.settings.priceLists.update(id, data),
    onSuccess: () => {
      message.success('تم تحديث قائمة الأسعار');
      qc.invalidateQueries({ queryKey: priceListsKey });
    },
    onError: () => message.error('تعذر تحديث قائمة الأسعار'),
  });
};

export const useDeletePriceList = () => {
  const qc = useQueryClient();

  return useMutation<{ success: true }, Error, string>({
    mutationFn: salesApi.settings.priceLists.delete,
    onSuccess: () => {
      message.success('تم حذف قائمة الأسعار');
      qc.invalidateQueries({ queryKey: priceListsKey });
    },
    onError: () => message.error('تعذر حذف قائمة الأسعار'),
  });
};

export const useBulkUpdatePriceLists = () => {
  return useMutation<unknown, Error, BulkUpdatePriceListsPayload>({
    mutationFn: salesApi.settings.priceLists.bulkUpdate,
    onSuccess: () => message.success('تم تطبيق التحديث الجماعي'),
    onError: () => message.error('تعذر تطبيق التحديث الجماعي'),
  });
};
