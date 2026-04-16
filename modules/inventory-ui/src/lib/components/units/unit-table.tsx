import { Table, Button, Space, Popconfirm, Tag } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

interface Props {
  data: any[];
  loading: boolean;
  onEdit: (record: any) => void;
  onDelete: (id: string) => void;
}

export default function UnitTable({ data, loading, onEdit, onDelete }: Props) {
  const columns = [
    { title: 'الاسم', dataIndex: 'name', key: 'name' },
    { title: 'الرمز', dataIndex: 'symbol', key: 'symbol' },
    {
      title: 'كود ETA/ZATCA',
      dataIndex: 'unitCode',
      key: 'unitCode',
      render: (v: string) => v ? <Tag color="blue">{v}</Tag> : <span style={{ color: '#999' }}>—</span>,
    },
    {
      title: 'إجراءات',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => onEdit(record)}
          >
            تعديل
          </Button>
          <Popconfirm
            title="هل أنت متأكد من حذف وحدة القياس؟"
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
    />
  );
}