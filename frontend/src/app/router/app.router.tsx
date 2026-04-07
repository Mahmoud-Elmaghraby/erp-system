import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from '../../pages/login/login.page';
import ProtectedRoute from './protected.route';
import MainLayout from '../layout/main.layout';
import { inventoryRoutes } from '@org/inventory-ui';
import { salesRoutes } from '@org/sales-ui';
import { purchasingRoutes } from '@org/purchasing-ui';
import SettingsPage from '../../pages/settings/settings.page';
import GeneralSettingsPage from '../../pages/settings/general-settings.page';
import CurrenciesPage from '../../pages/settings/currencies.page';
import DocumentSequencesPage from '../../pages/settings/document-sequences.page';

const enabledModules = ['inventory', 'sales', 'purchasing'];

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <div><h2>مرحباً بك في نظام ERP</h2></div> },
      ...enabledModules.includes('inventory') ? inventoryRoutes : [],
      ...enabledModules.includes('sales') ? salesRoutes : [],
      ...enabledModules.includes('purchasing') ? purchasingRoutes : [],
      { path: 'branches', element: <div>الفروع</div> },
      {
        path: 'settings',
        children: [
          { path: 'modules', element: <SettingsPage /> },
          { path: 'general', element: <GeneralSettingsPage /> },
          { path: 'currencies', element: <CurrenciesPage /> },
          { path: 'sequences', element: <DocumentSequencesPage /> },
        ],
      },
    ],
  },
]);