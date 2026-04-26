import { Table, Button, Space, Popconfirm, Tag } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined, FlagFilled } from '@ant-design/icons';

interface Props {
  data: any[];
  loading: boolean;
  onEdit: (record: any) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

export default function WarehouseTable({ data, loading, onEdit, onDelete, onView }: Props) {
  const columns = [
    {
      title: 'الاسم',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 600, color: '#1e293b' }}>{name}</span>
          {record.isPrimary && (
            <Tag icon={<FlagFilled />} color="blue" style={{ margin: 0 }}>رئيسي</Tag>
          )}
        </div>
      ),
    },
    {
      title: 'العنوان',
      dataIndex: 'address',
      key: 'address',
      render: (v: string) => v || <span style={{ color: '#999' }}>—</span>,
    },
    {
      title: 'الحالة',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (v: boolean) => <Tag color={v ? 'green' : 'red'}>{v ? 'نشط' : 'معطل'}</Tag>,
    },
    {
      title: 'إجراءات',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => onView(record.id)}
          >
            عرض
          </Button>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => onEdit(record)}
          >
            تعديل
          </Button>
          <Popconfirm
            title="هل أنت متأكد من حذف المخزن؟"
            description="سيتم حذف المخزن وكل المخزون المرتبط به."
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
      pagination={{ pageSize: 20 }}
      locale={{ emptyText: 'لا توجد مخازن' }}
    />
  );
}