import { Table, Tag,  } from 'antd';


interface Props {
  data: any[];
  loading: boolean;
}

const typeColors: Record<string, string> = {
  IN: 'green',
  OUT: 'red',
  TRANSFER: 'blue',
  ADJUSTMENT: 'orange',
};

const typeLabels: Record<string, string> = {
  IN: 'إضافة',
  OUT: 'خصم',
  TRANSFER: 'تحويل',
  ADJUSTMENT: 'تسوية',
};

export default function StockMovementsTable({ data, loading }: Props) {
  const columns = [
    {
      title: 'النوع',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={typeColors[type]}>{typeLabels[type]}</Tag>
      ),
    },
    { title: 'المنتج', dataIndex: ['product', 'name'], key: 'product' },
    { title: 'المخزن', dataIndex: ['warehouse', 'name'], key: 'warehouse' },
    {
      title: 'الكمية',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (qty: any) => Number(qty),
    },
    { title: 'السبب', dataIndex: 'reason', key: 'reason', render: (v: any) => v || '-' },
    {
      title: 'التاريخ',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString('ar-EG'),
    },
  ];

  return <Table columns={columns} dataSource={data} rowKey="id" loading={loading} />;
}