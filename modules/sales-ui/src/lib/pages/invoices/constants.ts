export const statusColors: Record<string, string> = {
  UNPAID: 'red', PAID: 'green', PARTIAL: 'orange', CANCELLED: 'default',
  OVERDUE: 'darkred', DUE: 'orange', DRAFT: 'default', OVERPAID: 'cyan'
};

export const statusLabels: Record<string, string> = {
  UNPAID: 'غير مدفوع', PAID: 'مدفوع', PARTIAL: 'جزئي', CANCELLED: 'ملغي',
  OVERDUE: 'متأخر', DUE: 'مستحقة الدفع', DRAFT: 'مسودة', OVERPAID: 'مدفوع بالزيادة'
};

export const statusKeys = [
  'UNPAID', 'PAID', 'PARTIAL', 'CANCELLED',
  'OVERDUE', 'DUE', 'OVERPAID'
] as const;

export type StatusKey = typeof statusKeys[number];
