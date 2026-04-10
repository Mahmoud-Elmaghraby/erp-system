import type { RouteObject } from 'react-router-dom';
import TaxesPage from './pages/taxes.page';
import PaymentTermsPage from './pages/payment-terms.page';
import ChartOfAccountsPage from './pages/chart-of-accounts.page';

export const accountingRoutes: RouteObject[] = [
  {
    path: 'accounting',
    children: [
      { path: 'taxes', element: <TaxesPage /> },
      { path: 'payment-terms', element: <PaymentTermsPage /> },
      { path: 'chart-of-accounts', element: <ChartOfAccountsPage /> },
    ],
  },
];