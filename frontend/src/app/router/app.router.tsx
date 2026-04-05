import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from '../../pages/login/login.page';
import ProtectedRoute from './protected.route';
import MainLayout from '../layout/main.layout';
import { inventoryRoutes } from '@org/inventory-ui';

const enabledModules = ['inventory'];

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
      { path: 'branches', element: <div>الفروع</div> },
    ],
  },
]);