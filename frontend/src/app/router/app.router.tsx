import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../../pages/login/login.page';
import ProtectedRoute from './protected.route';
import MainLayout from '../layout/main.layout';
import { inventoryRoutes } from '@org/inventory-ui';
import { salesRoutes } from '@org/sales-ui';
import { purchasingRoutes } from '@org/purchasing-ui';
import {
  TaxesPage,
  PaymentTermsPage,
  ChartOfAccountsPage,
  JournalsPage,
  JournalEntriesPage,
  AccountingSettingsPage,
  FiscalYearsPage,
} from '@org/accounting-ui';
import SettingsPage from '../../pages/settings/settings.page';
import GeneralSettingsPage from '../../pages/settings/general-settings.page';
import CurrenciesPage from '../../pages/settings/currencies.page';
import DocumentSequencesPage from '../../pages/settings/document-sequences.page';
import RolesPage from '../../pages/roles.page';
import UsersPage from '../../pages/users.page';
import BranchesPage from '../../pages/branches.page';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<div><h2>مرحباً بك في نظام ERP</h2></div>} />

        {/* Inventory */}
        <Route path="inventory">
          {inventoryRoutes[0].children?.map((r: any) => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}
        </Route>

        {/* Sales */}
        <Route path="sales">
          {salesRoutes[0].children?.map((r: any) => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}
        </Route>

        {/* Purchasing */}
        <Route path="purchasing">
          {purchasingRoutes[0].children?.map((r: any) => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}
        </Route>

        {/* Accounting */}
        <Route path="accounting">
          <Route path="fiscal-years"      element={<FiscalYearsPage />} />
          <Route path="taxes"             element={<TaxesPage />} />
          <Route path="payment-terms"     element={<PaymentTermsPage />} />
          <Route path="chart-of-accounts" element={<ChartOfAccountsPage />} />
          <Route path="journals"          element={<JournalsPage />} />
          <Route path="journal-entries"   element={<JournalEntriesPage />} />
          <Route path="settings"          element={<AccountingSettingsPage />} />
        </Route>

        {/* Core */}
        <Route path="branches" element={<BranchesPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="roles" element={<RolesPage />} />

        {/* Settings */}
        <Route path="settings">
          <Route index element={<Navigate to="/settings/general" replace />} />
          <Route path="general" element={<GeneralSettingsPage />} />
          <Route path="currencies" element={<CurrenciesPage />} />
          <Route path="sequences" element={<DocumentSequencesPage />} />
          <Route path="modules" element={<SettingsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}