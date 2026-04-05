import { useState } from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useWarehouses, useCreateWarehouse } from '../hooks/useWarehouses';
import WarehouseTable from '../components/warehouses/warehouse-table';
import WarehouseForm from '../components/warehouses/warehouse-form';

export default function WarehousesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: warehouses, isLoading } = useWarehouses();
  const createMutation = useCreateWarehouse();

  const handleSubmit = (values: any) => {
    createMutation.mutate(values, {
      onSuccess: () => setIsModalOpen(false),
    });
  };

  return (
    <div dir="rtl">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>المخازن</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          إضافة مخزن
        </Button>
      </div>
      <WarehouseTable
        data={warehouses || []}
        loading={isLoading}
      />
      <WarehouseForm
        open={isModalOpen}
        loading={createMutation.isPending}
        onSubmit={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
}