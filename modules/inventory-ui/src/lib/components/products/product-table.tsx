import { Table, Button, Space, Popconfirm } from 'antd';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

interface Props {
  data: any[];
  loading: boolean;
  onDelete: (id: string) => void;
}

export default function ProductTable({ data, loading, onDelete }: Props) {
  const navigate = useNavigate();

  const columns = [
    { title: 'الاسم', dataIndex: 'name', key: 'name' },
    { title: 'الباركود', dataIndex: 'barcode', key: 'barcode', render: (v: any) => v || '-' },
    { title: 'SKU', dataIndex: 'sku', key: 'sku', render: (v: any) => v || '-' },
    { title: 'السعر', dataIndex: 'price', key: 'price', render: (v: any) => v ? `${Number(v).toFixed(2)} ج.م` : '-' },
    { title: 'التكلفة', dataIndex: 'cost', key: 'cost', render: (v: any) => v ? `${Number(v).toFixed(2)} ج.م` : '-' },
    {
      title: 'إجراءات',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => navigate(`/inventory/products/${record.id}`)}
          >
            تفاصيل
          </Button>
          <Popconfirm
            title="هل أنت متأكد من الحذف؟"
            onConfirm={() => onDelete(record.id)}
            okText="نعم"
            cancelText="لا"
          >
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return <Table columns={columns} dataSource={data} rowKey="id" loading={loading} />;
}