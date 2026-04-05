import { Table, Button, Space, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

interface Props {
  data: any[];
  loading: boolean;
  onDelete: (id: string) => void;
}

export default function UnitTable({ data, loading, onDelete }: Props) {
  const columns = [
    { title: 'الاسم', dataIndex: 'name', key: 'name' },
    { title: 'الرمز', dataIndex: 'symbol', key: 'symbol' },
    {
      title: 'إجراءات',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
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