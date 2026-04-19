import { Navigate, type RouteObject } from 'react-router-dom';
import CustomersPage from './pages/customers.page';
import OrdersPage from './pages/orders.page';
import OrderDetailPage from './pages/order-detail.page';
import QuotationsPage from './pages/quotations/quotations.page';
import CreateQuotationPage from './pages/quotations/create-quotation.page';
import InvoicesPage from './pages/invoices/invoices.page';
import CreateInvoicePage from './pages/invoices/create-invoice.page';
import DeliveriesPage from './pages/deliveries.page';
import SalesReturnsPage from './pages/returns/sales-returns.page';
import CreditNotesPage from './pages/credit-notes/credit-notes.page';
import CreateCreditNotePage from './pages/credit-notes/create-credit-note.page';
import SalesSettingsPage from './pages/sales-settings/sales-settings.page';
import InvoiceSettingsPage from './pages/sales-settings/invoices-settings/invoice-settings.page';
import InvoiceDesignsPage from './pages/sales-settings/invoices-settings/invoice-designs.page';

export const salesRoutes: RouteObject[] = [
  {
    path: 'sales',
    children: [
      { index: true, element: <Navigate to="orders" replace /> },
      { path: 'quotations', element: <QuotationsPage /> },
      { path: 'quotations/create', element: <CreateQuotationPage /> },
      { path: 'orders', element: <OrdersPage /> },
      { path: 'orders/:id', element: <OrderDetailPage /> },
      { path: 'invoices', element: <InvoicesPage /> },
      { path: 'invoices/create', element: <CreateInvoicePage /> },
      { path: 'deliveries', element: <DeliveriesPage /> },
      { path: 'returns', element: <SalesReturnsPage /> },
      { path: 'credit-notes', element: <CreditNotesPage /> },
      { path: 'credit-notes/create', element: <CreateCreditNotePage /> },
      { path: 'customers', element: <CustomersPage /> },
      { path: 'settings', element: <SalesSettingsPage /> },
      { path: 'settings/invoices', element: <InvoiceSettingsPage /> },
      { path: 'settings/designs', element: <InvoiceDesignsPage /> },
    ],
  },
];