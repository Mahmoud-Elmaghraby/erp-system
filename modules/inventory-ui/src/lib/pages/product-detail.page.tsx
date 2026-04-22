import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, Button, Table, Modal, Form, Input, InputNumber,  Popconfirm, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useProductVariants, useProductPriceHistory, useCreateVariant, useDeleteVariant } from '../hooks/useProductVariants';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [variantForm] = Form.useForm();

  const { data: variants, isLoading: variantsLoading } = useProductVariants(id!);
  const { data: priceHistory, isLoading: historyLoading } = useProductPriceHistory(id!);
  const createVariantMutation = useCreateVariant();
  const deleteVariantMutation = useDeleteVariant();

  const variantColumns = [
    { title: 'الاسم', dataIndex: 'name', key: 'name' },
    { title: 'SKU', dataIndex: 'sku', key: 'sku', render: (v: any) => v || '-' },
    { title: 'الباركود', dataIndex: 'barcode', key: 'barcode', render: (v: any) => v || '-' },
    { title: 'السعر', dataIndex: 'price', key: 'price', render: (v: any) => `${Number(v).toFixed(2)} ج.م` },
    { title: 'التكلفة', dataIndex: 'cost', key: 'cost', render: (v: any) => `${Number(v).toFixed(2)} ج.م` },
    {
      title: 'الخصائص',
      dataIndex: 'attributes',
      key: 'attributes',
      render: (attrs: any) => Object.entries(attrs || {}).map(([k, v]) => (
        <Tag key={k}>{k}: {v as string}</Tag>
      )),
    },
    {
      title: 'إجراءات',
      key: 'actions',
      render: (_: any, record: any) => (
        <Popconfirm title="هل أنت متأكد من الحذف؟" onConfirm={() => deleteVariantMutation.mutate(record.id)} okText="نعم" cancelText="لا">
          <Button danger icon={<DeleteOutlined />} size="small" />
        </Popconfirm>
      ),
    },
  ];

  const priceHistoryColumns = [
    { title: 'السعر', dataIndex: 'price', key: 'price', render: (v: any) => `${Number(v).toFixed(2)} ج.م` },
    { title: 'التكلفة', dataIndex: 'cost', key: 'cost', render: (v: any) => `${Number(v).toFixed(2)} ج.م` },
    { title: 'التاريخ', dataIndex: 'createdAt', key: 'createdAt', render: (d: string) => new Date(d).toLocaleString('ar-EG') },
  ];

  const handleCreateVariant = (values: any) => {
    createVariantMutation.mutate(
      { ...values, productId: id },
      { onSuccess: () => { setIsVariantModalOpen(false); variantForm.resetFields(); } }
    );
  };

  return (
    <div dir="rtl">
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <Button icon={<ArrowRightOutlined />} onClick={() => navigate('/inventory/products')}>رجوع</Button>
        <h2 style={{ margin: 0 }}>تفاصيل المنتج</h2>
      </div>

      <Tabs
        items={[
          {
            key: 'variants',
            label: 'المتغيرات (ألوان/أحجام)',
            children: (
              <div>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsVariantModalOpen(true)} style={{ marginBottom: 16 }}>
                  إضافة متغير
                </Button>
                <Table columns={variantColumns} dataSource={variants || []} rowKey="id" loading={variantsLoading} />
              </div>
            ),
          },
          {
            key: 'price-history',
            label: 'تاريخ الأسعار',
            children: (
              <Table columns={priceHistoryColumns} dataSource={priceHistory || []} rowKey="id" loading={historyLoading} />
            ),
          },
        ]}
      />

      <Modal
        title="إضافة متغير جديد"
        open={isVariantModalOpen}
        onCancel={() => setIsVariantModalOpen(false)}
        onOk={() => variantForm.submit()}
        confirmLoading={createVariantMutation.isPending}
        okText="إضافة"
        cancelText="إلغاء"
      >
        <Form form={variantForm} layout="vertical" onFinish={handleCreateVariant} dir="rtl">
          <Form.Item label="الاسم (مثال: أحمر - L)" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="SKU" name="sku">
            <Input />
          </Form.Item>
          <Form.Item label="الباركود" name="barcode">
            <Input />
          </Form.Item>
          <Form.Item label="السعر" name="price">
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item label="التكلفة" name="cost">
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item label="اللون" name={['attributes', 'color']}>
            <Input placeholder="مثال: أحمر" />
          </Form.Item>
          <Form.Item label="الحجم" name={['attributes', 'size']}>
            <Input placeholder="مثال: L, XL" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}