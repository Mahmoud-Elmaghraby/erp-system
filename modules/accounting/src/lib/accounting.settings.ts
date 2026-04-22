import type { ModuleSettingsDefinition } from '@org/core';

export const accountingSettingsDefinition: ModuleSettingsDefinition = {
  module: 'accounting',
  label: 'المحاسبة',
  icon: 'AccountBookOutlined',
  settings: [
    {
      key: 'journalEntriesEnabled',
      label: 'تفعيل القيود المحاسبية',
      description: 'إنشاء قيود محاسبية أوتوماتيك مع كل عملية',
      type: 'boolean',
      default: false,
      group: 'المحاسبة',
    },
    {
      key: 'method',
      label: 'طريقة المحاسبة',
      type: 'select',
      default: 'ACCRUAL',
      options: [
        { label: 'الاستحقاق (Accrual)', value: 'ACCRUAL' },
        { label: 'النقدية (Cash)', value: 'CASH' },
      ],
      group: 'المحاسبة',
    },
    {
      key: 'taxMethod',
      label: 'طريقة الضريبة',
      type: 'select',
      default: 'EXCLUSIVE',
      options: [
        { label: 'حصري (Exclusive) - الضريبة تضاف للسعر', value: 'EXCLUSIVE' },
        { label: 'شامل (Inclusive) - الضريبة مضمنة في السعر', value: 'INCLUSIVE' },
      ],
      group: 'الضرائب',
    },
    {
      key: 'taxEnabled',
      label: 'تفعيل الضرائب',
      description: 'تطبيق الضرائب على الفواتير',
      type: 'boolean',
      default: false,
      group: 'الضرائب',
    },
    {
      key: 'eInvoiceEnabled',
      label: 'تفعيل الفاتورة الإلكترونية',
      type: 'boolean',
      default: false,
      group: 'الفاتورة الإلكترونية',
    },
    {
      key: 'eInvoiceProvider',
      label: 'مزود الفاتورة الإلكترونية',
      type: 'select',
      default: 'NONE',
      options: [
        { label: 'لا يوجد', value: 'NONE' },
        { label: 'مصر - ETA', value: 'ETA' },
        { label: 'السعودية - ZATCA', value: 'ZATCA' },
      ],
      group: 'الفاتورة الإلكترونية',
    },
  ],
};