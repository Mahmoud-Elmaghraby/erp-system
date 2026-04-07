import type { RouteObject } from 'react-router-dom';
import SuppliersPage from './pages/suppliers.page';
import PurchaseOrdersPage from './pages/purchase-orders.page';
import PurchaseOrderDetailPage from './pages/purchase-order-detail.page';

export const purchasingRoutes: RouteObject[] = [
  {
    path: 'purchasing',
    children: [
      { path: 'suppliers', element: <SuppliersPage /> },
      { path: 'orders', element: <PurchaseOrdersPage /> },
      { path: 'orders/:id', element: <PurchaseOrderDetailPage /> },
    ],
  },
];