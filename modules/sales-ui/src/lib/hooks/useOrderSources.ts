import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import {
  OrderSourcesConfig,
  salesApi,
  SaveOrderSourcesPayload,
} from '../api/sales.api';

const orderSourcesKey = ['sales-settings', 'order-sources'] as const;

const emptyOrderSourcesConfig: OrderSourcesConfig = {
  sources: [],
  defaultSourceId: null,
  isMandatory: false,
};

export const useOrderSourcesConfig = () => useQuery<OrderSourcesConfig>({
  queryKey: orderSourcesKey,
  queryFn: async () => {
    const res = await salesApi.settings.orderSources.get();
    return res ?? emptyOrderSourcesConfig;
  },
});

export const useSaveOrderSourcesConfig = () => {
  const qc = useQueryClient();

  return useMutation<OrderSourcesConfig, Error, SaveOrderSourcesPayload>({
    mutationFn: salesApi.settings.orderSources.save,
    onSuccess: () => {
      message.success('تم حفظ مصادر الطلب بنجاح');
      qc.invalidateQueries({ queryKey: orderSourcesKey });
    },
    onError: () => message.error('تعذر حفظ مصادر الطلب'),
  });
};
