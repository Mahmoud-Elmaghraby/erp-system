import { useState } from 'react';
import { Button, Table, Modal, Form, Select, InputNumber, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useReorderingRules, useUpsertReorderingRule, useDeleteReorderingRule } from '../hooks/useReorderingRules';
import { useWarehouses } from '../hooks/useWarehouses';
import { useProducts } from '../hooks/useProducts';

export default function ReorderingRulesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const { data: warehousesData } = useWarehouses();
  const { data: productsData } = useProducts();

  const warehouses = Array.isArray(warehousesData) ? warehousesData : warehousesData?.data ?? [];
  const products = Array.isArray(productsData) ? productsData : productsData?.data ?? [];

  const { data: rules, isLoading } = useReorderingRules();
  const upsertMutation = useUpsertReorderingRule();
  const deleteMutation = useDeleteReorderingRule();

  const columns = [
    { title: 'المنتج', dataIndex: ['product', 'name'], key: 'product' },
    { title: 'المخزن', dataIndex: ['warehouse', 'name'], key: 'warehouse' },
    { title: 'الحد الأدنى', dataIndex: 'minQuantity', key: 'minQuantity', render: (v: any) => Number(v) },
    { title: 'الحد الأقصى', dataIndex: 'maxQuantity', key: 'maxQuantity', render: (v: any) => Number(v) },
    { title: 'كمية إعادة الطلب', dataIndex: 'reorderQuantity', key: 'reorderQuantity', render: (v: any) => Number(v) },
    {
      title: 'إجراءات',
      key: 'actions',
      render: (_: any, record: any) => (
        <Popconfirm title="هل أنت متأكد من الحذف؟" onConfirm={() => deleteMutation.mutate(record.id)} okText="نعم" cancelText="لا">
          <Button danger icon={<DeleteOutlined />} size="small" />
        </Popconfirm>
      ),
    },
  ];

  const handleSubmit = (values: any) => {
    upsertMutation.mutate(values, {
      onSuccess: () => { setIsModalOpen(false); form.resetFields(); },
    });
  };

  return (
    <div dir="rtl">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>قواعد إعادة الطلب</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          إضافة قاعدة
        </Button>
      </div>

      <Table columns={columns} dataSource={rules || []} rowKey="id" loading={isLoading} />

      <Modal
        title="قاعدة إعادة طلب جديدة"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={upsertMutation.isPending}
        okText="حفظ"
        cancelText="إلغاء"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} dir="rtl">
          <Form.Item label="المنتج" name="productId" rules={[{ required: true }]}>
            <Select options={products.map((p: any) => ({ label: p.name, value: p.id }))} />
          </Form.Item>
          <Form.Item label="المخزن" name="warehouseId" rules={[{ required: true }]}>
            <Select options={warehouses.map((w: any) => ({ label: w.name, value: w.id }))} />
          </Form.Item>
          <Form.Item label="الحد الأدنى للتنبيه" name="minQuantity" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item label="الحد الأقصى للمخزون" name="maxQuantity" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item label="كمية إعادة الطلب" name="reorderQuantity" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}