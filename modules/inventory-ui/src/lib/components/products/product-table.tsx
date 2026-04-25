import { Table, Button, Space, Popconfirm, Tag } from 'antd';
import { DeleteOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

interface Props {
  data: any[];
  loading: boolean;
  onDelete: (id: string) => void;
  onEdit: (record: any) => void;
}

export default function ProductTable({ data, loading, onDelete, onEdit }: Props) {
  const navigate = useNavigate();

  const columns = [
    {
      title: 'اسم المنتج',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: any) => (
        <Button
          type="link"
          style={{ padding: 0 }}
          onClick={() => navigate(`/inventory/products/${record.id}`)}
        >
          {name}
        </Button>
      ),
    },
    {
      title: 'باركود المنتج',
      dataIndex: 'barcode',
      key: 'barcode',
      render: (v: string) => v ? <Tag>{v}</Tag> : <span style={{ color: '#999' }}>—</span>,
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
      render: (v: string) => v || <span style={{ color: '#999' }}>—</span>,
    },
    {
      title: 'الفئة',
      dataIndex: ['category', 'name'],
      key: 'category',
      render: (v: string) => v || <span style={{ color: '#999' }}>—</span>,
    },
    {
      title: 'سعر البيع',
      dataIndex: 'price',
      key: 'price',
      render: (v: any) => v ? `${Number(v).toFixed(2)} ج.م` : '—',
      align: 'right' as const,
    },
    {
      title: 'نسبة الخصم',
      dataIndex: 'discountPercentage',
      key: 'discountPercentage',
      render: (v: any) => v ? `${Number(v)}%` : '0%',
      align: 'right' as const,
    },
    {
      title: 'الحالة',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (v: boolean) => (
        <Tag color={v ? 'green' : 'red'}>{v ? 'نشط' : 'معطل'}</Tag>
      ),
    },
    {
      title: 'إجراءات',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => navigate(`/inventory/products/${record.id}`)}
            style={{ color: '#001529' }}
          >
            تفاصيل
          </Button>
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => onEdit(record)}
            style={{ color: '#001529' }}
          >
            تعديل
          </Button>
          <Popconfirm
            title="هل أنت متأكد من حذف المنتج؟"
            onConfirm={() => onDelete(record.id)}
            okText="نعم"
            cancelText="لا"
          >
            <Button type="text" danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
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
      pagination={{ pageSize: 20, showTotal: (total) => `إجمالي: ${total} منتج` }}
    />
  );
}