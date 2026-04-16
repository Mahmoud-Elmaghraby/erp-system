import { useState } from 'react';
import { Button, Table, Tag, Space, Modal, Form, Input, Select, InputNumber, Popconfirm, Alert } from 'antd';
import { PlusOutlined, CheckOutlined } from '@ant-design/icons';
import { useAdjustments, useCreateAdjustment, useConfirmAdjustment } from '../hooks/useAdjustments';
import { useWarehouses } from '../hooks/useWarehouses';
import { useProducts } from '../hooks/useProducts';

export default function AdjustmentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');
  const [form] = Form.useForm();

  const { data: warehousesData } = useWarehouses();
  const { data: productsData } = useProducts();

  const warehouses = Array.isArray(warehousesData) ? warehousesData : warehousesData?.data ?? [];
  const products = Array.isArray(productsData) ? productsData : productsData?.data ?? [];

  const { data: adjustments, isLoading } = useAdjustments(selectedWarehouse || undefined);
  const createMutation = useCreateAdjustment();
  const confirmMutation = useConfirmAdjustment();

  const statusMap: Record<string, { label: string; color: string }> = {
    DRAFT: { label: 'مسودة', color: 'orange' },
    CONFIRMED: { label: 'مؤكدة', color: 'green' },
    CANCELLED: { label: 'ملغية', color: 'red' },
  };

  const columns = [
    { title: 'المخزن', dataIndex: ['warehouse', 'name'], key: 'warehouse' },
    { title: 'السبب', dataIndex: 'reason', key: 'reason' },
    {
      title: 'الحالة',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => {
        const status = statusMap[s] ?? { label: s, color: 'default' };
        return <Tag color={status.color}>{status.label}</Tag>;
      },
    },
    {
      title: 'عدد الأصناف',
      dataIndex: 'items',
      key: 'items',
      render: (items: any[]) => items?.length || 0,
    },
    {
      title: 'التاريخ',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (d: string) => new Date(d).toLocaleDateString('ar-EG'),
    },
    {
      title: 'إجراءات',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          {record.status === 'DRAFT' && (
            <Popconfirm
              title="تأكيد التسوية"
              description="سيتم تحديث المخزون بناءً على الكميات الفعلية. هل أنت متأكد؟"
              onConfirm={() => confirmMutation.mutate(record.id)}
              okText="نعم، تأكيد"
              cancelText="إلغاء"
            >
              <Button
                type="primary"
                icon={<CheckOutlined />}
                size="small"
                loading={confirmMutation.isPending}
              >
                تأكيد
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  const handleSubmit = (values: any) => {
    createMutation.mutate(values, {
      onSuccess: () => { setIsModalOpen(false); form.resetFields(); },
    });
  };

  return (
    <div dir="rtl">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>تسوية المخزون (الجرد)</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          جرد جديد
        </Button>
      </div>

      <Select
        placeholder="كل المخازن"
        allowClear
        style={{ width: 200, marginBottom: 16 }}
        options={warehouses.map((w: any) => ({ label: w.name, value: w.id }))}
        onChange={(v) => setSelectedWarehouse(v || '')}
      />

      <Table
        columns={columns}
        dataSource={adjustments || []}
        rowKey="id"
        loading={isLoading}
        pagination={{ pageSize: 20 }}
      />

      <Modal
        title="جرد مخزون جديد"
        open={isModalOpen}
        onCancel={() => { setIsModalOpen(false); form.resetFields(); }}
        onOk={() => form.submit()}
        confirmLoading={createMutation.isPending}
        okText="إنشاء"
        cancelText="إلغاء"
        width={720}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} dir="rtl">
          <Alert
            message="الكمية في النظام ستُجلب تلقائياً عند الحفظ. أدخل فقط الكمية الفعلية من العد."
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item label="المخزن" name="warehouseId" rules={[{ required: true, message: 'اختر المخزن' }]}>
              <Select
                placeholder="اختر مخزن"
                options={warehouses.map((w: any) => ({ label: w.name, value: w.id }))}
              />
            </Form.Item>
            <Form.Item label="سبب الجرد" name="reason" rules={[{ required: true, message: 'ادخل السبب' }]}>
              <Input placeholder="مثال: جرد دوري، جرد نهاية العام" />
            </Form.Item>
          </div>

          <Form.Item label="ملاحظات" name="notes">
            <Input.TextArea rows={2} placeholder="ملاحظات اختيارية" />
          </Form.Item>

          <Form.List name="items" initialValue={[{}]}>
            {(fields, { add, remove }) => (
              <>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr auto',
                  gap: 8,
                  marginBottom: 8,
                  fontWeight: 'bold',
                  color: '#666',
                }}>
                  <span>المنتج</span>
                  <span>الكمية الفعلية</span>
                  <span></span>
                </div>

                {fields.map(({ key, name }) => (
                  <div key={key} style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr auto',
                    gap: 8,
                    marginBottom: 8,
                    alignItems: 'start',
                  }}>
                    <Form.Item name={[name, 'productId']} rules={[{ required: true, message: 'اختر منتج' }]} style={{ margin: 0 }}>
                      <Select
                        placeholder="اختر المنتج"
                        showSearch
                        optionFilterProp="label"
                        options={products.map((p: any) => ({ label: p.name, value: p.id }))}
                      />
                    </Form.Item>
                    <Form.Item name={[name, 'actualQuantity']} rules={[{ required: true, message: 'مطلوب' }]} style={{ margin: 0 }}>
                      <InputNumber placeholder="الكمية الفعلية" min={0} style={{ width: '100%' }} />
                    </Form.Item>
                    <Button danger onClick={() => remove(name)} style={{ marginTop: 0 }}>حذف</Button>
                  </div>
                ))}

                <Button
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                  style={{ width: '100%', marginTop: 8 }}
                >
                  إضافة منتج
                </Button>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
}