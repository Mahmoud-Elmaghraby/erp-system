import { Button, ConfigProvider } from 'antd';
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons';
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

  const warehouseList = Array.isArray(warehouses) ? warehouses : [];

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "'Cairo', 'Tajawal', sans-serif",
          colorPrimary: '#0f172a',
        },
      }}
    >
      <div dir="rtl" style={{ padding: '24px', fontFamily: "'Cairo', 'Tajawal', sans-serif" }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Button
              icon={<ArrowRightOutlined />}
              type="text"
              onClick={() => navigate('/inventory')}
              style={{ color: '#64748b' }}
            />
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#1e293b' }}>
              المخازن
            </h1>
            {!isLoading && (
              <span style={{
                backgroundColor: '#e2e8f0',
                color: '#475569',
                padding: '2px 10px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: 600,
              }}>
                {warehouseList.length}
              </span>
            )}
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
            style={{
              height: '40px',
              padding: '0 20px',
              borderRadius: '8px',
              fontWeight: 600,
              backgroundColor: '#0f172a',
              border: 'none',
            }}
          >
            إضافة مخزن
          </Button>
        </div>

        {/* Table */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
        }}>
          <WarehouseTable
            data={warehouseList}
            loading={isLoading}
            onEdit={handleEdit}
            onDelete={(id) => deleteMutation.mutate(id)}
            onView={handleView}
          />
        </div>
      </div>
    </ConfigProvider>
  );
}