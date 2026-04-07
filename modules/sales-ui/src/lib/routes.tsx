import type { RouteObject } from 'react-router-dom';
import CustomersPage from './pages/customers.page';
import OrdersPage from './pages/orders.page';
import InvoicesPage from './pages/invoices.page';

export const salesRoutes: RouteObject[] = [
  {
    path: 'sales',
    children: [
       { path: 'customers', element: <CustomersPage /> },
      { path: 'orders', element: <OrdersPage /> },
      { path: 'invoices', element: <InvoicesPage orderId="" /> },
    ],
  },
];