import { Table, Button, Space, Tag, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

interface OrderRow {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number | string;
  createdAt: string;
  customer?: {
    name?: string;
  } | null;
}

interface Props {
  data: OrderRow[];
  loading: boolean;
  onConfirm: (id: string) => void;
  onCancel: (id: string) => void;
}

const statusColors: Record<string, string> = {
  DRAFT: 'default', CONFIRMED: 'blue', DELIVERED: 'green', CANCELLED: 'red',
};
const statusLabels: Record<string, string> = {
  DRAFT: 'مسودة', CONFIRMED: 'مؤكد', DELIVERED: 'تم التسليم', CANCELLED: 'ملغي',
};

export default function OrderTable({ data, loading, onConfirm, onCancel }: Props) {
  const navigate = useNavigate();

  const columns: ColumnsType<OrderRow> = [
    { title: 'رقم الأوردر', dataIndex: 'orderNumber', key: 'orderNumber' },
    {
      title: 'العميل',
      dataIndex: 'customer',
      key: 'customer',
      render: (c: OrderRow['customer']) => c?.name ?? <span style={{ color: '#999' }}>—</span>,
    },
    {
      title: 'الحالة',
      dataIndex: 'status',
      key: 'status',
      render: (v: string) => <Tag color={statusColors[v]}>{statusLabels[v]}</Tag>,
    },
    { 
      title: 'الإجمالي', 
      dataIndex: 'totalAmount', 
      key: 'totalAmount',
      render: (amount: OrderRow['totalAmount']) => `${Number(amount).toFixed(2)} ج.م`,
      align: 'right' as const,
    },
    { 
      title: 'التاريخ', 
      dataIndex: 'createdAt', 
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('ar-EG') 
    },
    {
      title: 'إجراءات',
      key: 'actions',
      render: (_: unknown, record: OrderRow) => (
        <Space>
          {record.status === 'DRAFT' && (
            <Popconfirm title="تأكيد الأمر؟" onConfirm={() => onConfirm(record.id)}>
              <Button type="primary" icon={<CheckOutlined />} size="small">تأكيد</Button>
            </Popconfirm>
          )}
          {(record.status === 'DRAFT' || record.status === 'CONFIRMED') && (
            <Popconfirm title="إلغاء الأمر؟" onConfirm={() => onCancel(record.id)}>
              <Button icon={<CloseOutlined />} size="small" danger>إلغاء</Button>
            </Popconfirm>
          )}
          <Button icon={<EyeOutlined />} size="small" onClick={() => navigate(`/sales/orders/${record.id}`)}>
            التفاصيل
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table 
      columns={columns} 
      dataSource={data} 
      rowKey="id" 
      loading={loading} 
      pagination={{ pageSize: 15, showTotal: (t) => `إجمالي: ${t} أمر` }}
    />
  );
}