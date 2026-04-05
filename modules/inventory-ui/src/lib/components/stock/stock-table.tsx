import { Table, Tag } from 'antd';

interface Props {
  data: any[];
  loading: boolean;
}

export default function StockTable({ data, loading }: Props) {
  const columns = [
    { title: 'المنتج', dataIndex: ['product', 'name'], key: 'product' },
    {
      title: 'الكمية',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (qty: number) => (
        <Tag color={qty > 0 ? 'green' : 'red'}>{qty}</Tag>
      ),
    },
    { title: 'الحد الأدنى', dataIndex: 'minStock', key: 'minStock' },
  ];

  return <Table columns={columns} dataSource={data} rowKey="id" loading={loading} />;
}