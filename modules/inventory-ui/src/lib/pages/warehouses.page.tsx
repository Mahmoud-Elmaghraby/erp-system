import { useState } from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useWarehouses, useCreateWarehouse, useUpdateWarehouse, useDeleteWarehouse } from '../hooks/useWarehouses';
import WarehouseTable from '../components/warehouses/warehouse-table';
import WarehouseForm from '../components/warehouses/warehouse-form';

export default function WarehousesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<any>(null);

  const { data: warehouses, isLoading } = useWarehouses();
  const createMutation = useCreateWarehouse();
  const updateMutation = useUpdateWarehouse();
  const deleteMutation = useDeleteWarehouse();

  const handleCreate = () => {
    setEditingWarehouse(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record: any) => {
    setEditingWarehouse(record);
    setIsModalOpen(true);
  };

  const handleSubmit = (values: any) => {
    if (editingWarehouse) {
      updateMutation.mutate(
        { id: editingWarehouse.id, data: values },
        { onSuccess: () => { setIsModalOpen(false); setEditingWarehouse(null); } }
      );
    } else {
      createMutation.mutate(values, {
        onSuccess: () => { setIsModalOpen(false); }
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div dir="rtl">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>المخازن</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          إضافة مخزن
        </Button>
      </div>

      <WarehouseTable
        data={warehouses || []}
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={(id) => deleteMutation.mutate(id)}
      />

      <WarehouseForm
        open={isModalOpen}
        loading={isPending}
        initialValues={editingWarehouse}
        onSubmit={handleSubmit}
        onCancel={() => { setIsModalOpen(false); setEditingWarehouse(null); }}
      />
    </div>
  );
}