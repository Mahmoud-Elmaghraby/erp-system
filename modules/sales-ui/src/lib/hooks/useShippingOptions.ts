import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import {
  salesApi,
  SalesShippingOption,
  SaveShippingOptionPayload,
  ShippingConfig,
} from '../api/sales.api';

const shippingConfigKey = ['sales-settings', 'shipping-config'] as const;
const shippingOptionsKey = ['sales-settings', 'shipping-options'] as const;

const emptyShippingConfig: ShippingConfig = {
  isEnabled: true,
  codFeeItemId: null,
};

export const useShippingConfig = () => useQuery<ShippingConfig>({
  queryKey: shippingConfigKey,
  queryFn: async () => {
    const res = await salesApi.settings.shipping.getConfig();
    return res ?? emptyShippingConfig;
  },
});

export const useUpdateShippingConfig = () => {
  const qc = useQueryClient();

  return useMutation<ShippingConfig, Error, Partial<ShippingConfig>>({
    mutationFn: salesApi.settings.shipping.updateConfig,
    onSuccess: () => {
      message.success('تم حفظ إعدادات الشحن');
      qc.invalidateQueries({ queryKey: shippingConfigKey });
    },
    onError: () => message.error('تعذر حفظ إعدادات الشحن'),
  });
};

export const useShippingOptions = () => useQuery<SalesShippingOption[]>({
  queryKey: shippingOptionsKey,
  queryFn: async () => {
    const res = await salesApi.settings.shipping.getOptions();
    return res ?? [];
  },
});

export const useCreateShippingOption = () => {
  const qc = useQueryClient();

  return useMutation<SalesShippingOption, Error, SaveShippingOptionPayload>({
    mutationFn: salesApi.settings.shipping.createOption,
    onSuccess: () => {
      message.success('تمت إضافة خيار الشحن');
      qc.invalidateQueries({ queryKey: shippingOptionsKey });
    },
    onError: () => message.error('تعذر إضافة خيار الشحن'),
  });
};

export const useUpdateShippingOption = () => {
  const qc = useQueryClient();

  return useMutation<SalesShippingOption, Error, { id: string; data: Partial<SaveShippingOptionPayload> }>({
    mutationFn: ({ id, data }) =>
      salesApi.settings.shipping.updateOption(id, data),
    onSuccess: () => {
      message.success('تم تحديث خيار الشحن');
      qc.invalidateQueries({ queryKey: shippingOptionsKey });
    },
    onError: () => message.error('تعذر تحديث خيار الشحن'),
  });
};

export const useDeleteShippingOption = () => {
  const qc = useQueryClient();

  return useMutation<{ success: true }, Error, string>({
    mutationFn: salesApi.settings.shipping.deleteOption,
    onSuccess: () => {
      message.success('تم حذف خيار الشحن');
      qc.invalidateQueries({ queryKey: shippingOptionsKey });
    },
    onError: () => message.error('تعذر حذف خيار الشحن'),
  });
};
