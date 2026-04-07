import { useState } from 'react';
import { Tabs, Select, Button, Table, Tag, Modal, Form, Input, InputNumber, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useLotNumbers, useCreateLotNumber } from '../hooks/useLotNumbers';
import { useSerialNumbers, useCreateSerialNumbers, useUpdateSerialStatus } from '../hooks/useSerialNumbers';
import { useWarehouses } from '../hooks/useWarehouses';
import { useProducts } from '../hooks/useProducts';

export default function TraceabilityPage() {
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');
  const [isLotModalOpen, setIsLotModalOpen] = useState(false);
  const [isSerialModalOpen, setIsSerialModalOpen] = useState(false);
  const [lotForm] = Form.useForm();
  const [serialForm] = Form.useForm();

  const { data: products } = useProducts();
  const { data: warehouses } = useWarehouses();
  const { data: lotNumbers, isLoading: lotsLoading } = useLotNumbers(selectedProduct, selectedWarehouse || undefined);
  const { data: serialNumbers, isLoading: serialsLoading } = useSerialNumbers(selectedProduct, selectedWarehouse || undefined);
  const createLotMutation = useCreateLotNumber();
  const createSerialsMutation = useCreateSerialNumbers();
  const updateStatusMutation = useUpdateSerialStatus();

  const statusColors: Record<string, string> = {
    IN_STOCK: 'green', SOLD: 'blue', RETURNED: 'orange', DAMAGED: 'red',
  };

  const statusLabels: Record<string, string> = {
    IN_STOCK: 'في المخزن', SOLD: 'مباع', RETURNED: 'مرتجع', DAMAGED: 'تالف',
  };

  const lotColumns = [
    { title: 'رقم الدفعة', dataIndex: 'lotNumber', key: 'lotNumber' },
    { title: 'الكمية', dataIndex: 'quantity', key: 'quantity', render: (v: any) => Number(v) },
    { title: 'تاريخ الاستلام', dataIndex: 'receivedDate', key: 'receivedDate', render: (d: string) => new Date(d).toLocaleDateString('ar-EG') },
    { title: 'ملاحظات', dataIndex: 'notes', key: 'notes', render: (v: any) => v || '-' },
  ];

  const serialColumns = [
    { title: 'الرقم التسلسلي', dataIndex: 'serialNumber', key: 'serialNumber' },
    {
      title: 'الحالة',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => <Tag color={statusColors[s]}>{statusLabels[s]}</Tag>,
    },
    { title: 'ملاحظات', dataIndex: 'notes', key: 'notes', render: (v: any) => v || '-' },
    {
      title: 'تغيير الحالة',
      key: 'actions',
      render: (_: any, record: any) => (
        <Select
          value={record.status}
          style={{ width: 120 }}
          onChange={(status) => updateStatusMutation.mutate({ id: record.id, status })}
          options={[
            { label: 'في المخزن', value: 'IN_STOCK' },
            { label: 'مباع', value: 'SOLD' },
            { label: 'مرتجع', value: 'RETURNED' },
            { label: 'تالف', value: 'DAMAGED' },
          ]}
        />
      ),
    },
  ];

  const handleCreateLot = (values: any) => {
    createLotMutation.mutate(
      { ...values, productId: selectedProduct, warehouseId: selectedWarehouse },
      { onSuccess: () => { setIsLotModalOpen(false); lotForm.resetFields(); } }
    );
  };

  const handleCreateSerials = (values: any) => {
    const serialNumbers = values.serialNumbers.split('\n').map((s: string) => s.trim()).filter(Boolean);
    createSerialsMutation.mutate(
      { serialNumbers, productId: selectedProduct, warehouseId: selectedWarehouse, notes: values.notes },
      { onSuccess: () => { setIsSerialModalOpen(false); serialForm.resetFields(); } }
    );
  };

  return (
    <div dir="rtl">
      <h2>تتبع المنتجات (Traceability)</h2>

      <Space style={{ marginBottom: 16 }} wrap>
        <Select
          placeholder="اختر المنتج"
          style={{ width: 200 }}
          options={products?.map((p: any) => ({ label: p.name, value: p.id }))}
          onChange={setSelectedProduct}
        />
        <Select
          placeholder="كل المخازن"
          allowClear
          style={{ width: 180 }}
          options={warehouses?.map((w: any) => ({ label: w.name, value: w.id }))}
          onChange={(v) => setSelectedWarehouse(v || '')}
        />
      </Space>

      <Tabs
        items={[
          {
            key: 'lots',
            label: 'أرقام الدفعات (Lot Numbers)',
            children: (
              <div>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setIsLotModalOpen(true)}
                  disabled={!selectedProduct || !selectedWarehouse}
                  style={{ marginBottom: 16 }}
                >
                  إضافة دفعة
                </Button>
                <Table columns={lotColumns} dataSource={lotNumbers || []} rowKey="id" loading={lotsLoading} />
              </div>
            ),
          },
          {
            key: 'serials',
            label: 'الأرقام التسلسلية (Serial Numbers)',
            children: (
              <div>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setIsSerialModalOpen(true)}
                  disabled={!selectedProduct || !selectedWarehouse}
                  style={{ marginBottom: 16 }}
                >
                  إضافة أرقام تسلسلية
                </Button>
                <Table columns={serialColumns} dataSource={serialNumbers || []} rowKey="id" loading={serialsLoading} />
              </div>
            ),
          },
        ]}
      />

      <Modal
        title="إضافة دفعة جديدة"
        open={isLotModalOpen}
        onCancel={() => setIsLotModalOpen(false)}
        onOk={() => lotForm.submit()}
        confirmLoading={createLotMutation.isPending}
        okText="إضافة"
        cancelText="إلغاء"
      >
        <Form form={lotForm} layout="vertical" onFinish={handleCreateLot} dir="rtl">
          <Form.Item label="رقم الدفعة" name="lotNumber" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="الكمية" name="quantity" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>
          <Form.Item label="ملاحظات" name="notes">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="إضافة أرقام تسلسلية"
        open={isSerialModalOpen}
        onCancel={() => setIsSerialModalOpen(false)}
        onOk={() => serialForm.submit()}
        confirmLoading={createSerialsMutation.isPending}
        okText="إضافة"
        cancelText="إلغاء"
      >
        <Form form={serialForm} layout="vertical" onFinish={handleCreateSerials} dir="rtl">
          <Form.Item label="الأرقام التسلسلية (كل رقم في سطر)" name="serialNumbers" rules={[{ required: true }]}>
            <Input.TextArea rows={6} placeholder="SN001&#10;SN002&#10;SN003" />
          </Form.Item>
          <Form.Item label="ملاحظات" name="notes">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}