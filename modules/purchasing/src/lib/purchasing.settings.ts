import type { ModuleSettingsDefinition } from '@org/core';

export const purchasingSettingsDefinition: ModuleSettingsDefinition = {
  module: 'purchasing',
  label: 'المشتريات',
  icon: 'ShoppingOutlined',
  settings: [
    {
      key: 'requireApproval',
      label: 'موافقة على أوامر الشراء',
      description: 'يتطلب موافقة مدير قبل تأكيد أمر الشراء',
      type: 'boolean',
      default: false,
      group: 'الموافقات',
    },
    {
      key: 'approvalThreshold',
      label: 'حد الموافقة (بالجنيه)',
      description: 'أوامر الشراء فوق هذا المبلغ تحتاج موافقة',
      type: 'number',
      default: 0,
      min: 0,
      group: 'الموافقات',
    },
    {
      key: 'threeWayMatching',
      label: 'مطابقة ثلاثية',
      description: 'مطابقة أمر الشراء والاستلام والفاتورة قبل الدفع',
      type: 'boolean',
      default: false,
      group: 'القواعد',
    },
    {
      key: 'allowPurchaseReturns',
      label: 'السماح بمرتجعات المشتريات',
      type: 'boolean',
      default: true,
      group: 'القواعد',
    },
    {
      key: 'defaultPaymentTerms',
      label: 'شروط الدفع الافتراضية (أيام)',
      type: 'number',
      default: 30,
      min: 0,
      group: 'الدفع',
    },
  ],
};