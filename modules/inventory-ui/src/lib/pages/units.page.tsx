import { useState } from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useUnits, useCreateUnit, useUpdateUnit, useDeleteUnit } from '../hooks/useUnits';
import UnitTable from '../components/units/unit-table';
import UnitForm from '../components/units/unit-form';

export default function UnitsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<any>(null);

  const { data: units, isLoading } = useUnits();
  const createMutation = useCreateUnit();
  const updateMutation = useUpdateUnit();
  const deleteMutation = useDeleteUnit();

  const handleCreate = () => {
    setEditingUnit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record: any) => {
    setEditingUnit(record);
    setIsModalOpen(true);
  };

  const handleSubmit = (values: any) => {
    if (editingUnit) {
      updateMutation.mutate(
        { id: editingUnit.id, data: values },
        { onSuccess: () => { setIsModalOpen(false); setEditingUnit(null); } }
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
        <h2>وحدات القياس</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          إضافة وحدة قياس
        </Button>
      </div>

      <UnitTable
        data={units || []}
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={(id) => deleteMutation.mutate(id)}
      />

      <UnitForm
        open={isModalOpen}
        loading={isPending}
        initialValues={editingUnit}
        onSubmit={handleSubmit}
        onCancel={() => { setIsModalOpen(false); setEditingUnit(null); }}
      />
    </div>
  );
}