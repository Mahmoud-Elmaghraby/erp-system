import { Navigate, type RouteObject } from 'react-router-dom';
import ProductsPage from './pages/products.page';
import WarehousesPage from './pages/warehouses.page';
import StockPage from './pages/stock.page';
import CategoriesPage from './pages/categories.page';
import UnitsPage from './pages/units.page';
import StockMovementsPage from './pages/stock-movements.page';
import AdjustmentsPage from './pages/adjustments.page';
import ReorderingRulesPage from './pages/reordering-rules.page';
import InventorySettingsPage from './pages/settings.page';
import ProductDetailPage from './pages/product-detail.page';
import TraceabilityPage from './pages/traceability.page';
import StockValuationPage from './pages/stock-valuation.page';

export const inventoryRoutes: RouteObject[] = [
  {
    path: 'inventory',
    children: [
      { index: true, element: <Navigate to="products" replace /> }, // ✅
      { path: 'products', element: <ProductsPage /> },
      { path: 'warehouses', element: <WarehousesPage /> },
      { path: 'stock', element: <StockPage /> },
      { path: 'stock-movements', element: <StockMovementsPage /> },
      { path: 'adjustments', element: <AdjustmentsPage /> },
      { path: 'reordering-rules', element: <ReorderingRulesPage /> },
      { path: 'categories', element: <CategoriesPage /> },
      { path: 'units', element: <UnitsPage /> },
      { path: 'settings', element: <InventorySettingsPage /> },
      { path: 'products/:id', element: <ProductDetailPage /> },
      { path: 'traceability', element: <TraceabilityPage /> },
      { path: 'valuation', element: <StockValuationPage /> },
    ],
  },
];