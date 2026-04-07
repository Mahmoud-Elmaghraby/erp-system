import { useState } from 'react';
import { Select, Table, Card, Statistic, Row, Col } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { inventoryApi } from '../api/inventory.api';
import { useWarehouses } from '../hooks/useWarehouses';

export default function StockValuationPage() {
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');
  const { data: warehouses } = useWarehouses();

  const { data: valuation, isLoading } = useQuery({
    queryKey: ['stock-valuation', selectedWarehouse],
    queryFn: () => inventoryApi.valuation.get(selectedWarehouse || undefined),
  });

  const columns = [
    { title: 'المنتج', dataIndex: 'productName', key: 'productName' },
    { title: 'الكمية', dataIndex: 'quantity', key: 'quantity' },
    { title: 'سعر الوحدة', dataIndex: 'unitPrice', key: 'unitPrice', render: (v: number) => `${v.toFixed(2)} ج.م` },
    { title: 'تكلفة الوحدة', dataIndex: 'unitCost', key: 'unitCost', render: (v: number) => `${v.toFixed(2)} ج.م` },
    { title: 'إجمالي القيمة', dataIndex: 'totalValue', key: 'totalValue', render: (v: number) => `${v.toFixed(2)} ج.م` },
    { title: 'إجمالي التكلفة', dataIndex: 'totalCost', key: 'totalCost', render: (v: number) => `${v.toFixed(2)} ج.م` },
  ];

  return (
    <div dir="rtl">
      <h2>تقييم المخزون</h2>

      <Select
        placeholder="كل المخازن"
        allowClear
        style={{ width: 200, marginBottom: 16 }}
        options={warehouses?.map((w: any) => ({ label: w.name, value: w.id }))}
        onChange={(v) => setSelectedWarehouse(v || '')}
      />

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card>
            <Statistic
              title="إجمالي قيمة المخزون (بسعر البيع)"
              value={valuation?.totalValue?.toFixed(2) || 0}
              suffix="ج.م"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic
              title="إجمالي تكلفة المخزون"
              value={valuation?.totalCost?.toFixed(2) || 0}
              suffix="ج.م"
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={valuation?.items || []}
        rowKey="productId"
        loading={isLoading}
        summary={(data) => (
          <Table.Summary fixed>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={4}><strong>الإجمالي</strong></Table.Summary.Cell>
              <Table.Summary.Cell index={4}><strong>{valuation?.totalValue?.toFixed(2)} ج.م</strong></Table.Summary.Cell>
              <Table.Summary.Cell index={5}><strong>{valuation?.totalCost?.toFixed(2)} ج.م</strong></Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
    </div>
  );
}