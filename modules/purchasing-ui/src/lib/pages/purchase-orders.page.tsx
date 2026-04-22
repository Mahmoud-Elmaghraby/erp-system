import { useState } from 'react';
import { Button, Table, Tag, Space, Modal, Form, Input, InputNumber, Select, DatePicker } from 'antd';
import { PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { usePurchaseOrders, useCreatePurchaseOrder } from '../hooks/usePurchaseOrders';
import { useSuppliers } from '../hooks/useSuppliers';

const statusColors: Record<string, string> = {
  DRAFT: 'orange',
  CONFIRMED: 'blue',
  PARTIALLY_RECEIVED: 'purple',
  FULLY_RECEIVED: 'green',
  CANCELLED: 'red',
};

const statusLabels: Record<string, string> = {
  DRAFT: 'مسودة',
  CONFIRMED: 'مؤكد',
  PARTIALLY_RECEIVED: 'استلام جزئي',
  FULLY_RECEIVED: 'مستلم بالكامل',
  CANCELLED: 'ملغي',
};

export default function PurchaseOrdersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { data: orders, isLoading } = usePurchaseOrders();
  const { data: suppliers } = useSuppliers();
  const createMutation = useCreatePurchaseOrder();

  const columns = [
    { title: 'رقم الأمر', dataIndex: 'orderNumber', key: 'orderNumber', render: (v: string) => <Tag color="blue">{v}</Tag> },
    { title: 'المورد', dataIndex: ['supplier', 'name'], key: 'supplier' },
    {
      title: 'الحالة',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => <Tag color={statusColors[s]}>{statusLabels[s]}</Tag>,
    },
    {
      title: 'الإجمالي',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (v: any, record: any) => `${Number(v).toFixed(2)} ${record.currency}`,
    },
    { title: 'التاريخ', dataIndex: 'createdAt', key: 'createdAt', render: (d: string) => new Date(d).toLocaleDateString('ar-EG') },
    {
      title: 'إجراءات',
      key: 'actions',
      render: (_: any, record: any) => (
        <Button icon={<EyeOutlined />} size="small" onClick={() => navigate(`/purchasing/orders/${record.id}`)}>
          تفاصيل
        </Button>
      ),
    },
  ];

  const handleSubmit = (values: any) => {
    const data = {
      ...values,
      branchId: 'main',
      expectedDate: values.expectedDate?.toISOString(),
      items: values.items?.map((i: any) => ({
        ...i,
        quantity: Number(i.quantity),
        unitCost: Number(i.unitCost),
      })),
    };
    createMutation.mutate(data, {
      onSuccess: () => { setIsModalOpen(false); form.resetFields(); },
    });
  };

  return (
    <div dir="rtl">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>أوامر الشراء</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>أمر شراء جديد</Button>
      </div>

      <Table columns={columns} dataSource={orders || []} rowKey="id" loading={isLoading} />

      <Modal
        title="أمر شراء جديد"
        open={isModalOpen}
        onCancel={() => { setIsModalOpen(false); form.resetFields(); }}
        onOk={() => form.submit()}
        confirmLoading={createMutation.isPending}
        okText="إنشاء"
        cancelText="إلغاء"
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} dir="rtl">
          <Form.Item label="المورد" name="supplierId" rules={[{ required: true }]}>
            <Select options={suppliers?.map((s: any) => ({ label: s.name, value: s.id }))} />
          </Form.Item>
          <Form.Item label="المخزن" name="warehouseId" rules={[{ required: true }]}>
            <Input placeholder="أدخل معرف المخزن" />
          </Form.Item>
          <Form.Item label="العملة" name="currency" initialValue="EGP">
            <Select options={[
              { label: 'جنيه مصري (EGP)', value: 'EGP' },
              { label: 'دولار أمريكي (USD)', value: 'USD' },
              { label: 'درهم إماراتي (AED)', value: 'AED' },
            ]} />
          </Form.Item>
          <Form.Item label="تاريخ التسليم المتوقع" name="expectedDate">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="ملاحظات" name="notes">
            <Input.TextArea />
          </Form.Item>

          <Form.List name="items" initialValue={[{}]}>
            {(fields, { add, remove }) => (
              <>
                <div style={{ fontWeight: 'bold', marginBottom: 8 }}>الأصناف</div>
                {fields.map(({ key, name }) => (
                  <Space key={key} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
                    <Form.Item name={[name, 'productId']} rules={[{ required: true }]}>
                      <Input placeholder="معرف المنتج" style={{ width: 200 }} />
                    </Form.Item>
                    <Form.Item name={[name, 'quantity']} rules={[{ required: true }]}>
                      <InputNumber placeholder="الكمية" min={1} />
                    </Form.Item>
                    <Form.Item name={[name, 'unitCost']} rules={[{ required: true }]}>
                      <InputNumber placeholder="سعر الوحدة" min={0} />
                    </Form.Item>
                    <Button danger onClick={() => remove(name)}>حذف</Button>
                  </Space>
                ))}
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>إضافة صنف</Button>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
}