import { Table, Tag } from 'antd';

interface Props {
  data: any[];
  loading: boolean;
}

export default function StockTable({ data, loading }: Props) {
  const columns = [
    { title: 'المنتج', dataIndex: ['product', 'name'], key: 'product' },
    { title: 'الباركود', dataIndex: ['product', 'barcode'], key: 'barcode' },
    {
      title: 'الكمية',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (qty: any) => {
        const value = typeof qty === 'object' ? qty?.value ?? 0 : Number(qty);
        return <Tag color={value > 0 ? 'green' : 'red'}>{value}</Tag>;
      },
    },
    {
      title: 'الحد الأدنى',
      dataIndex: 'minStock',
      key: 'minStock',
      render: (v: any) => typeof v === 'object' ? v?.value ?? 0 : Number(v),
    },
  ];

  return <Table columns={columns} dataSource={data} rowKey="id" loading={loading} />;
}