import { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, Popconfirm, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '../../core/inventory/inventory.api';

export default function ProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: inventoryApi.products.getAll,
  });

  const createMutation = useMutation({
    mutationFn: inventoryApi.products.create,
    onSuccess: () => {
      message.success('تم إضافة المنتج بنجاح');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsModalOpen(false);
      form.resetFields();
    },
    onError: () => message.error('حدث خطأ'),
  });

  const deleteMutation = useMutation({
    mutationFn: inventoryApi.products.delete,
    onSuccess: () => {
      message.success('تم حذف المنتج');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const columns = [
    { title: 'الاسم', dataIndex: 'name', key: 'name' },
    { title: 'الباركود', dataIndex: 'barcode', key: 'barcode' },
    { title: 'SKU', dataIndex: 'sku', key: 'sku' },
    { title: 'السعر', dataIndex: 'price', key: 'price' },
    { title: 'التكلفة', dataIndex: 'cost', key: 'cost' },
    {
      title: 'إجراءات',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Popconfirm
            title="هل أنت متأكد من الحذف؟"
            onConfirm={() => deleteMutation.mutate(record.id)}
            okText="نعم"
            cancelText="لا"
          >
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div dir="rtl">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>المنتجات</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          إضافة منتج
        </Button>
      </div>

      <Table columns={columns} dataSource={products} rowKey="id" loading={isLoading} />

      <Modal
        title="إضافة منتج جديد"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={createMutation.isPending}
        okText="إضافة"
        cancelText="إلغاء"
      >
        <Form form={form} layout="vertical" onFinish={createMutation.mutate} dir="rtl">
          <Form.Item label="الاسم" name="name" rules={[{ required: true, message: 'ادخل اسم المنتج' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="الوصف" name="description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="الباركود" name="barcode">
            <Input />
          </Form.Item>
          <Form.Item label="SKU" name="sku">
            <Input />
          </Form.Item>
          <Form.Item label="السعر" name="price">
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item label="التكلفة" name="cost">
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}