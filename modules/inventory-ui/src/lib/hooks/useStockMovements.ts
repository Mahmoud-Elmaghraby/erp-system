import { useQuery } from '@tanstack/react-query';
import { inventoryApi } from '../api/inventory.api';

export const useStockMovements = (filters?: {
  warehouseId?: string;
  productId?: string;
  type?: string;
}) => {
  return useQuery({
    queryKey: ['stock-movements', filters],
    queryFn: () => inventoryApi.stockMovements.getAll(filters),
  });
};

export const useStockMovementsByWarehouse = (warehouseId: string) => {
  return useQuery({
    queryKey: ['stock-movements', 'warehouse', warehouseId],
    queryFn: () => inventoryApi.stockMovements.getByWarehouse(warehouseId),
    enabled: !!warehouseId,
  });
};

export const useStockMovementsByProduct = (productId: string) => {
  return useQuery({
    queryKey: ['stock-movements', 'product', productId],
    queryFn: () => inventoryApi.stockMovements.getByProduct(productId),
    enabled: !!productId,
  });
};