import { useState } from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useUnits, useCreateUnit, useDeleteUnit } from '../hooks/useUnits';
import UnitTable from '../components/units/unit-table';
import UnitForm from '../components/units/unit-form';

export default function UnitsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: units, isLoading } = useUnits();
  const createMutation = useCreateUnit();
  const deleteMutation = useDeleteUnit();

  const handleSubmit = (values: any) => {
    createMutation.mutate(values, {
      onSuccess: () => setIsModalOpen(false),
    });
  };

  return (
    <div dir="rtl">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>وحدات القياس</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          إضافة وحدة قياس
        </Button>
      </div>
      <UnitTable
        data={units || []}
        loading={isLoading}
        onDelete={(id) => deleteMutation.mutate(id)}
      />
      <UnitForm
        open={isModalOpen}
        loading={createMutation.isPending}
        onSubmit={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
}