import { useState } from 'react';
import { Table, Tag, Button, Popconfirm, message, Space, Input, Select } from 'antd';
import { CheckOutlined, SearchOutlined } from '@ant-design/icons';
import { useDeliveries, useConfirmDelivery } from '../hooks/useDeliveries';

const { Option } = Select;

const statusColors: Record<string, string> = {
  DRAFT: 'default', CONFIRMED: 'blue', DONE: 'green', CANCELLED: 'red',
};
const statusLabels: Record<string, string> = {
  DRAFT: 'مسودة', CONFIRMED: 'مؤكد', DONE: 'مكتمل', CANCELLED: 'ملغي',
};

export default function DeliveriesPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const { data: deliveries, isLoading } = useDeliveries();
  const confirmDelivery = useConfirmDelivery();

  const filtered = (deliveries || []).filter((d: any) => {
    const matchSearch = !search || d.deliveryNumber?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const columns = [
    { title: 'رقم التسليم', dataIndex: 'deliveryNumber', key: 'deliveryNumber' },
    {
      title: 'الحالة', dataIndex: 'status', key: 'status',
      render: (v: string) => <Tag color={statusColors[v]}>{statusLabels[v]}</Tag>,
    },
    {
      title: 'تاريخ التسليم', dataIndex: 'deliveryDate', key: 'deliveryDate',
      render: (v: string) => v ? new Date(v).toLocaleDateString('ar-EG') : '—',
    },
    { title: 'ملاحظات', dataIndex: 'notes', key: 'notes', render: (v: string) => v ?? '—' },
    {
      title: 'إجراءات', key: 'actions',
      render: (_: any, record: any) => record.status === 'DRAFT' && (
        <Popconfirm title="تأكيد التسليم؟" onConfirm={() =>
          confirmDelivery.mutateAsync(record.id).then(() => message.success('تم التأكيد'))
        }>
          <Button icon={<CheckOutlined />} size="small" type="primary">تأكيد</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>التسليمات</h2>
      <Space style={{ marginBottom: 16 }}>
        <Input prefix={<SearchOutlined />} placeholder="بحث برقم التسليم..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          style={{ width: 200 }} allowClear />
        <Select placeholder="فلتر بالحالة" allowClear style={{ width: 150 }}
          onChange={(v) => setStatusFilter(v)}>
          <Option value="DRAFT">مسودة</Option>
          <Option value="CONFIRMED">مؤكد</Option>
          <Option value="DONE">مكتمل</Option>
          <Option value="CANCELLED">ملغي</Option>
        </Select>
      </Space>
      <Table columns={columns} dataSource={filtered} loading={isLoading} rowKey="id"
        pagination={{ pageSize: 10 }} />
    </div>
  );
}