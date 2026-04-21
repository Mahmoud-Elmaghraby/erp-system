import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import {
  salesApi,
  SalesPriceOffer,
  SavePriceOfferPayload,
} from '../api/sales.api';

const priceOffersKey = ['sales-settings', 'price-offers'] as const;

export const usePriceOffers = () => useQuery<SalesPriceOffer[]>({
  queryKey: priceOffersKey,
  queryFn: async () => {
    const res = await salesApi.settings.offers.getAll();
    return res ?? [];
  },
});

export const useCreatePriceOffer = () => {
  const qc = useQueryClient();

  return useMutation<SalesPriceOffer, Error, SavePriceOfferPayload>({
    mutationFn: salesApi.settings.offers.create,
    onSuccess: () => {
      message.success('تمت إضافة العرض بنجاح');
      qc.invalidateQueries({ queryKey: priceOffersKey });
    },
    onError: () => message.error('تعذر إضافة العرض'),
  });
};

export const useUpdatePriceOffer = () => {
  const qc = useQueryClient();

  return useMutation<SalesPriceOffer, Error, { id: string; data: Partial<SavePriceOfferPayload> }>({
    mutationFn: ({ id, data }) =>
      salesApi.settings.offers.update(id, data),
    onSuccess: () => {
      message.success('تم تحديث العرض');
      qc.invalidateQueries({ queryKey: priceOffersKey });
    },
    onError: () => message.error('تعذر تحديث العرض'),
  });
};

export const useDeletePriceOffer = () => {
  const qc = useQueryClient();

  return useMutation<{ success: true }, Error, string>({
    mutationFn: salesApi.settings.offers.delete,
    onSuccess: () => {
      message.success('تم حذف العرض');
      qc.invalidateQueries({ queryKey: priceOffersKey });
    },
    onError: () => message.error('تعذر حذف العرض'),
  });
};
