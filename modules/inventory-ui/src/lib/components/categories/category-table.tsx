import { Table, Button, Space, Popconfirm, Tag } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

interface Props {
  data: any[];
  loading: boolean;
  onDelete: (id: string) => void;
}

export default function CategoryTable({ data, loading, onDelete }: Props) {
  const columns = [
    { title: 'الاسم', dataIndex: 'name', key: 'name' },
    {
      title: 'التصنيف الأب',
      dataIndex: 'parentId',
      key: 'parentId',
      render: (parentId: string, record: any) => {
        if (!parentId) return <Tag color="blue">رئيسي</Tag>;
        const parent = data.find((c: any) => c.id === parentId);
        return parent ? <Tag>{parent.name}</Tag> : <span style={{ color: '#999' }}>—</span>;
      },
    },
    {
      title: 'إجراءات',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Popconfirm
            title="هل أنت متأكد من حذف التصنيف؟"
            description="سيتم حذف التصنيف وقد يؤثر على المنتجات المرتبطة به."
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