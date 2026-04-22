import { Navigate, type RouteObject } from 'react-router-dom';
import QuotationsPage from './pages/quotations/quotations.page';
import CreateQuotationPage from './pages/quotations/create-quotation.page';
import InvoicesPage from './pages/invoices/invoices.page';
import CreateInvoicePage from './pages/invoices/create-invoice.page';
import InvoiceViewPage from './pages/invoices/invoice-view.page';
import SalesReturnsPage from './pages/returns/sales-returns.page';
import CreditNotesPage from './pages/credit-notes/credit-notes.page';
import CreateCreditNotePage from './pages/credit-notes/create-credit-note.page';
import CustomerPaymentsPage from './pages/customer-payments/customer-payments.page';
import SalesSettingsPage from './pages/sales-settings/sales-settings.page';
import InvoiceSettingsPage from './pages/sales-settings/invoices-settings/invoice-settings.page';
import InvoiceDesignsPage from './pages/sales-settings/invoices-settings/invoice-designs.page';
import PriceOffersSettingsPage from './pages/sales-settings/price-offers-settings/price-offers-settings.page';
import SalesOrdersSettingsPage from './pages/sales-settings/sales-orders-settings/sales-orders-settings.page';
import PriceListsSettingsPage from './pages/sales-settings/invoices-settings/price-lists.page';
import OrderSourcesPage from './pages/sales-settings/invoices-settings/order-sources.page';
import ShippingOptionsPage from './pages/sales-settings/invoices-settings/shipping-settings/shipping-options.page';
import ShippingOptionsManagePage from './pages/sales-settings/invoices-settings/shipping-settings/shipping-options-manage.page';
import ShippingOptionsConfigurationPage from './pages/sales-settings/invoices-settings/shipping-settings/shipping-options-configuration.page';

export const salesRoutes: RouteObject[] = [
  {
    path: 'sales',
    children: [
      { index: true, element: <Navigate to="invoices" replace /> },
      { path: 'invoices', element: <InvoicesPage /> },
      { path: 'invoices/create', element: <CreateInvoicePage /> },
      { path: 'invoices/:id', element: <InvoiceViewPage /> },
      { path: 'quotations', element: <QuotationsPage /> },
      { path: 'quotations/create', element: <CreateQuotationPage /> },
      { path: 'credit-notes', element: <CreditNotesPage /> },
      { path: 'credit-notes/create', element: <CreateCreditNotePage /> },
      { path: 'returns', element: <SalesReturnsPage /> },
      { path: 'payments', element: <CustomerPaymentsPage /> },
      { path: 'settings', element: <SalesSettingsPage /> },
      { path: 'settings/invoices', element: <InvoiceSettingsPage /> },
      { path: 'settings/designs', element: <InvoiceDesignsPage /> },
      { path: 'settings/price-offers', element: <PriceOffersSettingsPage /> },
      { path: 'settings/orders', element: <SalesOrdersSettingsPage /> },      
      { path: 'settings/price-lists', element: <PriceListsSettingsPage /> },    
      { path: 'settings/order-sources', element: <OrderSourcesPage /> },
      { path: 'settings/shipping-options', element: <ShippingOptionsPage /> },
      { path: 'settings/shipping-options/manage', element: <ShippingOptionsManagePage /> },
      { path: 'settings/shipping-options/configuration', element: <ShippingOptionsConfigurationPage /> },
    ],
  },
];