import type { RouteObject } from 'react-router-dom';
import TaxesPage from './pages/taxes.page';
import PaymentTermsPage from './pages/payment-terms.page';
import ChartOfAccountsPage from './pages/chart-of-accounts.page';
import JournalsPage from './pages/journals.page';
import JournalEntriesPage from './pages/journal-entries.page';
import AccountingSettingsPage from './pages/accounting-settings.page';
import FiscalYearsPage from './pages/fiscal-years.page';

export const accountingRoutes: RouteObject[] = [
  {
    path: 'accounting',
    children: [
      { path: 'taxes',             element: <TaxesPage /> },
      { path: 'payment-terms',     element: <PaymentTermsPage /> },
      { path: 'chart-of-accounts', element: <ChartOfAccountsPage /> },
      { path: 'journals',          element: <JournalsPage /> },
      { path: 'journal-entries',   element: <JournalEntriesPage /> },
      { path: 'fiscal-years',      element: <FiscalYearsPage /> },
      { path: 'settings',          element: <AccountingSettingsPage /> },
    ],
  },
];