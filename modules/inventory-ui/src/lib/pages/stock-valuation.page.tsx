import { useState } from 'react';
import { Select, Table, Card, Statistic, Row, Col } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { inventoryApi } from '../api/inventory.api';
import { useWarehouses } from '../hooks/useWarehouses';

export default function StockValuationPage() {
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');
  const { data: warehouses } = useWarehouses();

  const { data: valuationRes, isLoading } = useQuery({
    queryKey: ['stock-valuation', selectedWarehouse],
    queryFn: async () => {
      const res = await inventoryApi.valuation.get(selectedWarehouse || undefined) as any;
      return res?.data ?? res;
    },
  });

  const valuation = valuationRes;

  const columns = [
    { title: 'المنتج', dataIndex: 'productName', key: 'productName' },
    { title: 'المخزن', dataIndex: 'warehouseName', key: 'warehouseName' },
    { title: 'الكمية', dataIndex: 'quantity', key: 'quantity' },
    { title: 'سعر الوحدة', dataIndex: 'unitPrice', key: 'unitPrice', render: (v: number) => `${Number(v).toFixed(2)} ج.م` },
    { title: 'تكلفة الوحدة', dataIndex: 'unitCost', key: 'unitCost', render: (v: number) => `${Number(v).toFixed(2)} ج.م` },
    { title: 'إجمالي القيمة', dataIndex: 'totalValue', key: 'totalValue', render: (v: number) => `${Number(v).toFixed(2)} ج.م` },
    { title: 'إجمالي التكلفة', dataIndex: 'totalCost', key: 'totalCost', render: (v: number) => `${Number(v).toFixed(2)} ج.م` },
  ];

  return (
    <div dir="rtl">
      <h2>تقييم المخزون</h2>

      <Select
        placeholder="كل المخازن"
        allowClear
        style={{ width: 200, marginBottom: 16 }}
        options={(warehouses as any[] ?? []).map((w: any) => ({ label: w.name, value: w.id }))}
        onChange={(v) => setSelectedWarehouse(v || '')}
      />

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card>
            <Statistic
              title="إجمالي قيمة المخزون (بسعر البيع)"
              value={valuation?.totalValue?.toFixed(2) || 0}
              suffix="ج.م"
              styles={{ content: { color: '#3f8600' } }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic
              title="إجمالي تكلفة المخزون"
              value={valuation?.totalCost?.toFixed(2) || 0}
              suffix="ج.م"
              styles={{ content: { color: '#cf1322' } }}
            />
          </Card>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={valuation?.items || []}
        rowKey="productId"
        loading={isLoading}
        summary={() => (
          <Table.Summary fixed>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={5}><strong>الإجمالي</strong></Table.Summary.Cell>
              <Table.Summary.Cell index={5}><strong>{Number(valuation?.totalValue || 0).toFixed(2)} ج.م</strong></Table.Summary.Cell>
              <Table.Summary.Cell index={6}><strong>{Number(valuation?.totalCost || 0).toFixed(2)} ج.م</strong></Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
    </div>
  );
}