import { useState } from 'react';
import { Select, Space } from 'antd';
import { useStockMovements } from '../hooks/useStockMovements';
import { useWarehouses } from '../hooks/useWarehouses';
import { useProducts } from '../hooks/useProducts';
import StockMovementsTable from '../components/stock/stock-movements-table';

export default function StockMovementsPage() {
  const [warehouseId, setWarehouseId] = useState<string>('');
  const [productId, setProductId] = useState<string>('');
  const [type, setType] = useState<string>('');

  const { data: warehouses } = useWarehouses();
  const { data: products } = useProducts();
  const { data: movements, isLoading } = useStockMovements({
    warehouseId: warehouseId || undefined,
    productId: productId || undefined,
    type: type || undefined,
  });

  return (
    <div dir="rtl">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>سجل حركات المخزون</h2>
      </div>

      <Space style={{ marginBottom: 16 }} wrap>
        <Select
          placeholder="كل المخازن"
          allowClear
          style={{ width: 180 }}
          options={warehouses?.map((w: any) => ({ label: w.name, value: w.id }))}
          onChange={(v) => setWarehouseId(v || '')}
        />
        <Select
          placeholder="كل المنتجات"
          allowClear
          style={{ width: 180 }}
          options={products?.map((p: any) => ({ label: p.name, value: p.id }))}
          onChange={(v) => setProductId(v || '')}
        />
        <Select
          placeholder="كل الأنواع"
          allowClear
          style={{ width: 150 }}
          options={[
            { label: 'إضافة', value: 'IN' },
            { label: 'خصم', value: 'OUT' },
            { label: 'تحويل', value: 'TRANSFER' },
            { label: 'تسوية', value: 'ADJUSTMENT' },
          ]}
          onChange={(v) => setType(v || '')}
        />
      </Space>

      <StockMovementsTable data={movements || []} loading={isLoading} />
    </div>
  );
}