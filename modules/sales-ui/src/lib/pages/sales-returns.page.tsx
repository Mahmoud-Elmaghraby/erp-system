import { useState } from 'react';
import { Table, Tag, Button, Popconfirm, Space, Input, Select } from 'antd';
import { CheckOutlined, SearchOutlined, CloseOutlined } from '@ant-design/icons';
import { useSalesReturns, useConfirmSalesReturn, useCancelSalesReturn } from '../hooks/useSalesReturns';

const { Option } = Select;

const statusColors: Record<string, string> = {
  DRAFT: 'default', CONFIRMED: 'green', CANCELLED: 'red',
};
const statusLabels: Record<string, string> = {
  DRAFT: 'مسودة', CONFIRMED: 'مؤكد', CANCELLED: 'ملغي',
};

export default function SalesReturnsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const { data: returns, isLoading } = useSalesReturns();
  const confirmReturn = useConfirmSalesReturn();
  const cancelReturn = useCancelSalesReturn();

  const filtered = (returns as any[] ?? []).filter((r: any) => {
    const matchSearch = !search || r.returnNumber?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const columns = [
    { title: 'رقم المرتجع', dataIndex: 'returnNumber', key: 'returnNumber' },
    {
      title: 'السبب', dataIndex: 'reason', key: 'reason',
      render: (v: string) => v || <span style={{ color: '#999' }}>—</span>,
    },
    {
      title: 'الإجمالي', dataIndex: 'totalAmount', key: 'totalAmount',
      render: (v: number) => `${Number(v).toFixed(2)} ج.م`,
      align: 'right' as const,
    },
    {
      title: 'الحالة', dataIndex: 'status', key: 'status',
      render: (v: string) => <Tag color={statusColors[v]}>{statusLabels[v]}</Tag>,
    },
    {
      title: 'التاريخ', dataIndex: 'createdAt', key: 'createdAt',
      render: (v: string) => new Date(v).toLocaleDateString('ar-EG'),
    },
    {
      title: 'إجراءات', key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          {record.status === 'DRAFT' && (
            <Popconfirm title="تأكيد المرتجع؟ سيتم إعادة المخزون تلقائياً."
              onConfirm={() => confirmReturn.mutate(record.id)}>
              <Button icon={<CheckOutlined />} size="small" type="primary">تأكيد</Button>
            </Popconfirm>
          )}
          {record.status === 'DRAFT' && (
            <Popconfirm title="إلغاء المرتجع؟"
              onConfirm={() => cancelReturn.mutate(record.id)}>
              <Button icon={<CloseOutlined />} size="small" danger>إلغاء</Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }} dir="rtl">
      <h2 style={{ marginBottom: 16 }}>المرتجعات</h2>
      <Space style={{ marginBottom: 16 }}>
        <Input prefix={<SearchOutlined />} placeholder="بحث برقم المرتجع..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          style={{ width: 220 }} allowClear />
        <Select placeholder="فلتر بالحالة" allowClear style={{ width: 150 }}
          onChange={(v) => setStatusFilter(v)}>
          <Option value="DRAFT">مسودة</Option>
          <Option value="CONFIRMED">مؤكد</Option>
          <Option value="CANCELLED">ملغي</Option>
        </Select>
      </Space>
      <Table columns={columns} dataSource={filtered} loading={isLoading} rowKey="id"
        pagination={{ pageSize: 15, showTotal: (t) => `إجمالي: ${t} مرتجع` }} />
    </div>
  );
}