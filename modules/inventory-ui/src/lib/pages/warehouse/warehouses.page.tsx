import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useWarehouses, useDeleteWarehouse } from '../../hooks/useWarehouses';
import WarehouseTable from '../../components/warehouses/warehouse-table';
import { useNavigate } from 'react-router-dom';

export default function WarehousesPage() {
  const navigate = useNavigate();
  const { data: warehouses, isLoading } = useWarehouses();
  const deleteMutation = useDeleteWarehouse();

  const handleCreate = () => {
    navigate('/inventory/warehouses/create');
  };

  const handleView = (id: string) => {
    navigate(`/inventory/warehouses/${id}`);
  };

  const handleEdit = (record: any) => {
    navigate(`/inventory/warehouses/${record.id}/edit`);
  };

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
        onView={handleView}
      />


    </div>
  );
}