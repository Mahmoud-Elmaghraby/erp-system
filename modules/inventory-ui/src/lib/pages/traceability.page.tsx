import { useState } from 'react';
import { Tabs, Select, Button, Table, Tag, Modal, Form, Input, InputNumber, Space, DatePicker } from 'antd';
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

  const { data: productsData } = useProducts();
  const { data: warehousesData } = useWarehouses();

  const products = Array.isArray(productsData) ? productsData : productsData?.data ?? [];
  const warehouses = Array.isArray(warehousesData) ? warehousesData : warehousesData?.data ?? [];

  const { data: lotNumbers, isLoading: lotsLoading } = useLotNumbers(selectedProduct, selectedWarehouse || undefined);
  const { data: serialNumbers, isLoading: serialsLoading } = useSerialNumbers(selectedProduct, selectedWarehouse || undefined);
  const createLotMutation = useCreateLotNumber();
  const createSerialsMutation = useCreateSerialNumbers();
  const updateStatusMutation = useUpdateSerialStatus();

  // ✅ DEFECTIVE بدل DAMAGED
  const statusColors: Record<string, string> = {
    IN_STOCK: 'green', SOLD: 'blue', RETURNED: 'orange', DEFECTIVE: 'red',
  };
  const statusLabels: Record<string, string> = {
    IN_STOCK: 'في المخزن', SOLD: 'مباع', RETURNED: 'مرتجع', DEFECTIVE: 'معيب',
  };

  const lotColumns = [
    { title: 'رقم الدفعة', dataIndex: 'lotNumber', key: 'lotNumber' },
    {
      title: 'الكمية',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (v: any) => Number(v),
    },
    {
      title: 'تاريخ الاستلام',
      dataIndex: 'receivedDate',
      key: 'receivedDate',
      render: (d: string) => new Date(d).toLocaleDateString('ar-EG'),
    },
    {
      title: 'تاريخ الانتهاء',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      render: (d: string) => {
        if (!d) return <span style={{ color: '#999' }}>—</span>;
        const date = new Date(d);
        const isExpired = date < new Date();
        return (
          <Tag color={isExpired ? 'red' : 'green'}>
            {date.toLocaleDateString('ar-EG')}
          </Tag>
        );
      },
    },
    {
      title: 'ملاحظات',
      dataIndex: 'notes',
      key: 'notes',
      render: (v: any) => v || <span style={{ color: '#999' }}>—</span>,
    },
  ];

  const serialColumns = [
    { title: 'الرقم التسلسلي', dataIndex: 'serialNumber', key: 'serialNumber' },
    {
      title: 'الحالة',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => (
        <Tag color={statusColors[s] ?? 'default'}>
          {statusLabels[s] ?? s}
        </Tag>
      ),
    },
    {
      title: 'ملاحظات',
      dataIndex: 'notes',
      key: 'notes',
      render: (v: any) => v || <span style={{ color: '#999' }}>—</span>,
    },
    {
      title: 'تغيير الحالة',
      key: 'actions',
      render: (_: any, record: any) => (
        <Select
          value={record.status}
          style={{ width: 130 }}
          loading={updateStatusMutation.isPending}
          onChange={(status) => updateStatusMutation.mutate({ id: record.id, status })}
          options={[
            { label: 'في المخزن', value: 'IN_STOCK' },
            { label: 'مباع', value: 'SOLD' },
            { label: 'مرتجع', value: 'RETURNED' },
            { label: 'معيب', value: 'DEFECTIVE' },
          ]}
        />
      ),
    },
  ];

  const handleCreateLot = (values: any) => {
    createLotMutation.mutate(
      {
        ...values,
        productId: selectedProduct,
        warehouseId: selectedWarehouse,
        expiryDate: values.expiryDate ? values.expiryDate.toISOString() : undefined,
      },
      { onSuccess: () => { setIsLotModalOpen(false); lotForm.resetFields(); } }
    );
  };

  const handleCreateSerials = (values: any) => {
    const serials = values.serialNumbers
      .split('\n')
      .map((s: string) => s.trim())
      .filter(Boolean);
    createSerialsMutation.mutate(
      { serialNumbers: serials, productId: selectedProduct, warehouseId: selectedWarehouse, notes: values.notes },
      { onSuccess: () => { setIsSerialModalOpen(false); serialForm.resetFields(); } }
    );
  };

  return (
    <div dir="rtl">
      <h2>تتبع المنتجات (Traceability)</h2>

      <Space style={{ marginBottom: 16 }} wrap>
        <Select
          placeholder="اختر المنتج"
          style={{ width: 220 }}
          showSearch
          optionFilterProp="label"
          options={products.map((p: any) => ({ label: p.name, value: p.id }))}
          onChange={setSelectedProduct}
        />
        <Select
          placeholder="كل المخازن"
          allowClear
          style={{ width: 180 }}
          options={warehouses.map((w: any) => ({ label: w.name, value: w.id }))}
          onChange={(v) => setSelectedWarehouse(v || '')}
        />
      </Space>

      <Tabs items={[
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
              <Table
                columns={lotColumns}
                dataSource={lotNumbers || []}
                rowKey="id"
                loading={lotsLoading}
                pagination={{ pageSize: 20 }}
              />
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
              <Table
                columns={serialColumns}
                dataSource={serialNumbers || []}
                rowKey="id"
                loading={serialsLoading}
                pagination={{ pageSize: 20 }}
              />
            </div>
          ),
        },
      ]} />

      {/* Modal إضافة دفعة */}
      <Modal
        title="إضافة دفعة جديدة"
        open={isLotModalOpen}
        onCancel={() => { setIsLotModalOpen(false); lotForm.resetFields(); }}
        onOk={() => lotForm.submit()}
        confirmLoading={createLotMutation.isPending}
        okText="إضافة"
        cancelText="إلغاء"
      >
        <Form form={lotForm} layout="vertical" onFinish={handleCreateLot} dir="rtl">
          <Form.Item label="رقم الدفعة" name="lotNumber" rules={[{ required: true, message: 'مطلوب' }]}>
            <Input placeholder="مثال: LOT-2024-001" />
          </Form.Item>
          <Form.Item label="الكمية" name="quantity" rules={[{ required: true, message: 'مطلوب' }]}>
            <InputNumber style={{ width: '100%' }} min={1} placeholder="0" />
          </Form.Item>
          <Form.Item label="تاريخ الانتهاء" name="expiryDate">
            <DatePicker style={{ width: '100%' }} placeholder="اختياري" format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item label="ملاحظات" name="notes">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal إضافة أرقام تسلسلية */}
      <Modal
        title="إضافة أرقام تسلسلية"
        open={isSerialModalOpen}
        onCancel={() => { setIsSerialModalOpen(false); serialForm.resetFields(); }}
        onOk={() => serialForm.submit()}
        confirmLoading={createSerialsMutation.isPending}
        okText="إضافة"
        cancelText="إلغاء"
      >
        <Form form={serialForm} layout="vertical" onFinish={handleCreateSerials} dir="rtl">
          <Form.Item
            label="الأرقام التسلسلية (كل رقم في سطر)"
            name="serialNumbers"
            rules={[{ required: true, message: 'مطلوب' }]}
            extra="أدخل كل رقم تسلسلي في سطر منفصل"
          >
            <Input.TextArea
              rows={6}
              placeholder={'SN001\nSN002\nSN003'}
            />
          </Form.Item>
          <Form.Item label="ملاحظات" name="notes">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}