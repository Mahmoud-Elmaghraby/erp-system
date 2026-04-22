import { useState } from 'react';
import { Button, Select, Space, message } from 'antd';
import { PlusOutlined, MinusOutlined, SwapOutlined } from '@ant-design/icons';
import { useStock, useAddStock, useRemoveStock, useTransferStock } from '../hooks/useStock';
import { useWarehouses } from '../hooks/useWarehouses';
import { useProducts } from '../hooks/useProducts';
import StockTable from '../components/stock/stock-table';
import StockForm from '../components/stock/stock-form';

export default function StockPage() {
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');
  const [modalType, setModalType] = useState<'add' | 'remove' | 'transfer' | null>(null);

  const { data: warehousesData } = useWarehouses();
  const { data: productsData } = useProducts();

  const warehouses = Array.isArray(warehousesData) ? warehousesData : warehousesData?.data ?? [];
  const products = Array.isArray(productsData) ? productsData : productsData?.data ?? [];

  const { data: stock, isLoading } = useStock(selectedWarehouse);
  const addMutation = useAddStock();
  const removeMutation = useRemoveStock();
  const transferMutation = useTransferStock();

  const openModal = (type: 'add' | 'remove' | 'transfer') => {
    if (!selectedWarehouse) { message.warning('اختر مخزن أولاً'); return; }
    setModalType(type);
  };

  const handleSubmit = (values: any) => {
    if (!selectedWarehouse) { message.warning('اختر مخزن أولاً'); return; }
    if (modalType === 'add') {
      addMutation.mutate({ ...values, warehouseId: selectedWarehouse }, {
        onSuccess: () => setModalType(null),
      });
    } else if (modalType === 'remove') {
      removeMutation.mutate({ ...values, warehouseId: selectedWarehouse }, {
        onSuccess: () => setModalType(null),
      });
    } else if (modalType === 'transfer') {
      transferMutation.mutate({ ...values, fromWarehouseId: selectedWarehouse }, {
        onSuccess: () => setModalType(null),
      });
    }
  };

  const isLoading2 = addMutation.isPending || removeMutation.isPending || transferMutation.isPending;

  return (
    <div dir="rtl">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>حركة المخزون</h2>
        <Space>
          <Button icon={<PlusOutlined />} type="primary" onClick={() => openModal('add')}>إضافة</Button>
          <Button icon={<MinusOutlined />} danger onClick={() => openModal('remove')}>خصم</Button>
          <Button icon={<SwapOutlined />} onClick={() => openModal('transfer')}>تحويل</Button>
        </Space>
      </div>

      <Select
        placeholder="اختر المخزن"
        options={warehouses.map((w: any) => ({ label: w.name, value: w.id }))}
        onChange={setSelectedWarehouse}
        style={{ width: 200, marginBottom: 16 }}
      />

      <StockTable data={stock || []} loading={isLoading} />

      {modalType && (
        <StockForm
          open={!!modalType}
          loading={isLoading2}
          type={modalType}
          products={products}
          warehouses={warehouses}
          currentWarehouseId={selectedWarehouse}
          onSubmit={handleSubmit}
          onCancel={() => setModalType(null)}
        />
      )}
    </div>
  );
}