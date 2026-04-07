import { Table, Button, Space, Tag } from 'antd';
import { CheckOutlined, FileTextOutlined } from '@ant-design/icons';

interface Props {
  data: any[];
  loading: boolean;
  onConfirm: (id: string) => void;
  onViewInvoices: (id: string) => void;
}

const statusColors: Record<string, string> = {
  DRAFT: 'default',
  CONFIRMED: 'blue',
  DELIVERED: 'green',
  CANCELLED: 'red',
};

const statusLabels: Record<string, string> = {
  DRAFT: 'مسودة',
  CONFIRMED: 'مؤكد',
  DELIVERED: 'تم التسليم',
  CANCELLED: 'ملغي',
};

export default function OrderTable({ data, loading, onConfirm, onViewInvoices }: Props) {
  const columns = [
    { title: 'رقم الأوردر', dataIndex: 'orderNumber', key: 'orderNumber' },
    {
      title: 'الحالة',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
      ),
    },
    { 
  title: 'الإجمالي', 
  dataIndex: 'totalAmount', 
  key: 'totalAmount',
  render: (amount: any) => `${Number(amount).toFixed(2)} ج.م`
},
    { title: 'التاريخ', dataIndex: 'createdAt', key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('ar-EG') },
    {
      title: 'إجراءات',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          {record.status === 'DRAFT' && (
            <Button
              type="primary"
              icon={<CheckOutlined />}
              size="small"
              onClick={() => onConfirm(record.id)}
            >
              تأكيد
            </Button>
          )}
          <Button
            icon={<FileTextOutlined />}
            size="small"
            onClick={() => onViewInvoices(record.id)}
          >
            الفواتير
          </Button>
        </Space>
      ),
    },
  ];

  return <Table columns={columns} dataSource={data} rowKey="id" loading={loading} />;
}