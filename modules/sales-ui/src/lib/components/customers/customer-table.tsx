import { Table, Button, Space, Popconfirm, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

interface CustomerRow {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  buyerType?: string;
  country?: string;
}

interface Props {
  data: CustomerRow[];
  loading: boolean;
  onEdit: (record: CustomerRow) => void;
  onDelete: (id: string) => void;
}

export default function CustomerTable({ data, loading, onEdit, onDelete }: Props) {
  const columns: ColumnsType<CustomerRow> = [
    { title: 'الاسم', dataIndex: 'name', key: 'name' },
    {
      title: 'البريد الإلكتروني',
      dataIndex: 'email',
      key: 'email',
      render: (v: string) => v || <span style={{ color: '#999' }}>—</span>,
    },
    {
      title: 'التليفون',
      dataIndex: 'phone',
      key: 'phone',
      render: (v: string) => v || <span style={{ color: '#999' }}>—</span>,
    },
    {
      title: 'العنوان',
      dataIndex: 'address',
      key: 'address',
      render: (v: string) => v || <span style={{ color: '#999' }}>—</span>,
    },
    {
      title: 'نوع المشتري',
      dataIndex: 'buyerType',
      key: 'buyerType',
      render: (v: string) => v === 'B'
        ? <Tag color="blue">شركة</Tag>
        : <Tag color="green">فرد</Tag>,
    },
    {
      title: 'الدولة',
      dataIndex: 'country',
      key: 'country',
      render: (v: string) => v || 'EG',
    },
    {
      title: 'إجراءات',
      key: 'actions',
      render: (_: unknown, record: CustomerRow) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => onEdit(record)}>
            تعديل
          </Button>
          <Popconfirm
            title="هل أنت متأكد من حذف العميل؟"
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

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      pagination={{ pageSize: 20, showTotal: (total) => `إجمالي: ${total} عميل` }}
    />
  );
}