import type { RouteObject } from 'react-router-dom';
import ProductsPage from './pages/products.page';
import WarehousesPage from './pages/warehouses.page';
import StockPage from './pages/stock.page';
import CategoriesPage from './pages/categories.page';
import UnitsPage from './pages/units.page';

export const inventoryRoutes: RouteObject[] = [
  {
    path: 'inventory',
    children: [
      { path: 'products', element: <ProductsPage /> },
      { path: 'warehouses', element: <WarehousesPage /> },
      { path: 'stock', element: <StockPage /> },
      { path: 'categories', element: <CategoriesPage /> },
      { path: 'units', element: <UnitsPage /> },
    ],
  },
];