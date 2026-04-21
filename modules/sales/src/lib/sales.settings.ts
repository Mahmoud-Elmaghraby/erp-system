import type { ModuleSettingsDefinition } from '@org/core';

export const salesSettingsDefinition: ModuleSettingsDefinition = {
  module: 'sales',
  label: 'المبيعات',
  icon: 'ShoppingCartOutlined',
  settings: [
    {
      key: 'orderSourceMandatory',
      label: 'إلزامي مصدر الطلب',
      description: 'يجبر المستخدم على اختيار مصدر الطلب عند إنشاء طلب بيع',
      type: 'boolean',
      default: false,
      group: 'الفواتير',
    },
    {
      key: 'shippingOptionsEnabled',
      label: 'تفعيل خيارات الشحن',
      description: 'إظهار خيارات الشحن والتوصيل داخل إعدادات المبيعات',
      type: 'boolean',
      default: true,
      group: 'الشحن',
    },
    {
      key: 'codFeeItemId',
      label: 'صنف رسوم الدفع عند الاستلام',
      description: 'معرّف الصنف المستخدم لإضافة رسوم الدفع عند الاستلام',
      type: 'string',
      default: '',
      group: 'الشحن',
    },
  ],
};
