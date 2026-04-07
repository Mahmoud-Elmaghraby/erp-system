import { useState } from 'react';
import { Button, Table, Tag, Space, Modal, Form, Input, Select, InputNumber, Popconfirm } from 'antd';
import { PlusOutlined, CheckOutlined } from '@ant-design/icons';
import { useAdjustments, useCreateAdjustment, useConfirmAdjustment } from '../hooks/useAdjustments';
import { useWarehouses } from '../hooks/useWarehouses';
import { useProducts } from '../hooks/useProducts';

export default function AdjustmentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');
  const [form] = Form.useForm();

  const { data: warehouses } = useWarehouses();
  const { data: products } = useProducts();
  const { data: adjustments, isLoading } = useAdjustments(selectedWarehouse || undefined);
  const createMutation = useCreateAdjustment();
  const confirmMutation = useConfirmAdjustment();

  const columns = [
    { title: 'المخزن', dataIndex: ['warehouse', 'name'], key: 'warehouse' },
    { title: 'السبب', dataIndex: 'reason', key: 'reason' },
    {
      title: 'الحالة',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => <Tag color={s === 'CONFIRMED' ? 'green' : 'orange'}>{s === 'CONFIRMED' ? 'مؤكدة' : 'مسودة'}</Tag>,
    },
    { title: 'عدد الأصناف', dataIndex: 'items', key: 'items', render: (items: any[]) => items?.length || 0 },
    { title: 'التاريخ', dataIndex: 'createdAt', key: 'createdAt', render: (d: string) => new Date(d).toLocaleDateString('ar-EG') },
    {
      title: 'إجراءات',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          {record.status === 'DRAFT' && (
            <Popconfirm title="هل أنت متأكد من تأكيد التسوية؟ سيتم تحديث المخزون." onConfirm={() => confirmMutation.mutate(record.id)} okText="نعم" cancelText="لا">
              <Button type="primary" icon={<CheckOutlined />} size="small">تأكيد</Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  const handleSubmit = (values: any) => {
    createMutation.mutate(values, { onSuccess: () => { setIsModalOpen(false); form.resetFields(); } });
  };

  return (
    <div dir="rtl">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>تسوية المخزون (الجرد)</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>جرد جديد</Button>
      </div>

      <Select placeholder="كل المخازن" allowClear style={{ width: 200, marginBottom: 16 }}
        options={warehouses?.map((w: any) => ({ label: w.name, value: w.id }))}
        onChange={(v) => setSelectedWarehouse(v || '')}
      />

      <Table columns={columns} dataSource={adjustments || []} rowKey="id" loading={isLoading} />

      <Modal title="جرد مخزون جديد" open={isModalOpen} onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()} confirmLoading={createMutation.isPending} okText="إنشاء" cancelText="إلغاء" width={700}>
        <Form form={form} layout="vertical" onFinish={handleSubmit} dir="rtl">
          <Form.Item label="المخزن" name="warehouseId" rules={[{ required: true }]}>
            <Select options={warehouses?.map((w: any) => ({ label: w.name, value: w.id }))} />
          </Form.Item>
          <Form.Item label="السبب" name="reason" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="ملاحظات" name="notes">
            <Input.TextArea />
          </Form.Item>
          <Form.List name="items" initialValue={[{}]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name }) => (
                  <Space key={key} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
                    <Form.Item name={[name, 'productId']} rules={[{ required: true }]}>
                      <Select placeholder="المنتج" style={{ width: 200 }}
                        options={products?.map((p: any) => ({ label: p.name, value: p.id }))} />
                    </Form.Item>
                    <Form.Item name={[name, 'actualQuantity']} rules={[{ required: true }]}>
                      <InputNumber placeholder="الكمية الفعلية" min={0} />
                    </Form.Item>
                    <Button danger onClick={() => remove(name)}>حذف</Button>
                  </Space>
                ))}
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>إضافة منتج</Button>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
}