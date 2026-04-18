import { Navigate, type RouteObject } from 'react-router-dom';
import CustomersPage from './pages/customers.page';
import OrdersPage from './pages/orders.page';
import OrderDetailPage from './pages/order-detail.page';
import QuotationsPage from './pages/quotations.page';
import InvoicesPage from './pages/invoices/invoices.page';
import CreateInvoicePage from './pages/invoices/create-invoice.page';
import DeliveriesPage from './pages/deliveries.page';
import SalesReturnsPage from './pages/sales-returns.page';
import SalesSettingsPage from './pages/sales-settings.page';
import InvoiceSettingsPage from './pages/sales-settings/invoices-settings/invoice-settings.page';
import InvoiceDesignsPage from './pages/sales-settings/invoices-settings/invoice-designs.page';

export const salesRoutes: RouteObject[] = [
  {
    path: 'sales',
    children: [
      { index: true, element: <Navigate to="orders" replace /> },
      { path: 'quotations', element: <QuotationsPage /> },
      { path: 'orders', element: <OrdersPage /> },
      { path: 'orders/:id', element: <OrderDetailPage /> },
      { path: 'invoices', element: <InvoicesPage /> },
      { path: 'invoices/create', element: <CreateInvoicePage /> },
      { path: 'deliveries', element: <DeliveriesPage /> },
      { path: 'returns', element: <SalesReturnsPage /> },
      { path: 'customers', element: <CustomersPage /> },
      { path: 'settings', element: <SalesSettingsPage /> },
      { path: 'settings/invoices', element: <InvoiceSettingsPage /> },
      { path: 'settings/designs', element: <InvoiceDesignsPage /> },
    ],
  },
];