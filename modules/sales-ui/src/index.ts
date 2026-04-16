export { salesRoutes } from './lib/routes';
export { salesApi } from './lib/api/sales.api';

// Pages
export { default as CustomersPage } from './lib/pages/customers.page';
export { default as OrdersPage } from './lib/pages/orders.page';
export { default as OrderDetailPage } from './lib/pages/order-detail.page';
export { default as QuotationsPage } from './lib/pages/quotations.page';
export { default as InvoicesPage } from './lib/pages/invoices.page';
export { default as DeliveriesPage } from './lib/pages/deliveries.page';
export { default as SalesReturnsPage } from './lib/pages/sales-returns.page';

// Hooks
export { useCustomers, useCreateCustomer, useUpdateCustomer, useDeleteCustomer } from './lib/hooks/useCustomers';
export { useOrders, useCreateOrder, useConfirmOrder, useCancelOrder } from './lib/hooks/useOrders';
export { useQuotations, useCreateQuotation, useConfirmQuotation, useSendQuotation, useCancelQuotation, useDeleteQuotation } from './lib/hooks/useQuotations';
export { useInvoices, useCreateInvoice, usePayInvoice, useCancelInvoice } from './lib/hooks/useInvoices';
export { useDeliveries, useCreateDelivery, useConfirmDelivery } from './lib/hooks/useDeliveries';
export { useSalesReturns, useCreateSalesReturn, useConfirmSalesReturn, useCancelSalesReturn } from './lib/hooks/useSalesReturns';