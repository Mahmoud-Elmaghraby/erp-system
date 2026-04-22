import { useQuery } from '@tanstack/react-query';
import { inventoryApi } from '../api/inventory.api';

export const useStockMovements = (filters?: {
  warehouseId?: string;
  productId?: string;
  type?: string;
}) => useQuery({
  queryKey: ['stock-movements', filters],
  queryFn: async () => {
    const res = await inventoryApi.stockMovements.getAll(filters) as any;
    return res?.data ?? res ?? [];
  },
});

export const useStockMovementsByWarehouse = (warehouseId: string) => useQuery({
  queryKey: ['stock-movements', 'warehouse', warehouseId],
  queryFn: async () => {
    const res = await inventoryApi.stockMovements.getByWarehouse(warehouseId) as any;
    return res?.data ?? res ?? [];
  },
  enabled: !!warehouseId,
});

export const useStockMovementsByProduct = (productId: string) => useQuery({
  queryKey: ['stock-movements', 'product', productId],
  queryFn: async () => {
    const res = await inventoryApi.stockMovements.getByProduct(productId) as any;
    return res?.data ?? res ?? [];
  },
  enabled: !!productId,
});