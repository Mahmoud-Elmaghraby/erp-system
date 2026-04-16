import { Form, Input, InputNumber, Modal, Select, Button, Divider, Typography } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const { Text } = Typography;

// ✅ استخدام نفس إعدادات الـ interceptors عشان التوكن
const fetchBranches = async () => {
  const token = localStorage.getItem('access_token');
  const res = await axios.get(
    `${import.meta.env['VITE_API_URL'] || 'http://localhost:3000/api'}/branches`,
    { headers: { Authorization: token ? `Bearer ${token}` : '' } }
  );
  return res.data?.data ?? res.data ?? [];
};

interface Props {
  open: boolean;
  loading: boolean;
  customers: any[];
  products: any[];
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

export default function OrderForm({ open, loading, customers, products, onSubmit, onCancel }: Props) {
  const [form] = Form.useForm();
  const [totalAmount, setTotalAmount] = useState(0);

  const { data: branches = [] } = useQuery({
    queryKey: ['branches'],
    queryFn: fetchBranches,
  });

  const calculateTotal = () => {
    const items = form.getFieldValue('items') || [];
    const sum = items.reduce((acc: number, item: any) => {
      return acc + (Number(item?.quantity ?? 0) * Number(item?.unitPrice ?? 0));
    }, 0);
    setTotalAmount(sum);
  };

  const handleProductChange = (productId: string, name: number) => {
    const product = products.find((p: any) => p.id === productId);
    if (product) {
      const items = form.getFieldValue('items');
      items[name] = { ...items[name], unitPrice: Number(product.price ?? 0) };
      form.setFieldsValue({ items });
      calculateTotal();
    }
  };

  const handleFinish = (values: any) => {
    // ✅ تجميع الـ Payload بالشكل اللي الباك إند مستنيه بالظبط
    const payload = {
      ...values,
      totalAmount: totalAmount,
      items: values.items.map((item: any) => ({
        productId: item.productId,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        total: Number(item.quantity) * Number(item.unitPrice), // الباك إند بيحتاج دي
      }))
    };

    onSubmit(payload);
    form.resetFields();
    setTotalAmount(0);
  };

  return (
    <Modal
      title="إنشاء أمر بيع جديد"
      open={open}
      onCancel={() => { onCancel(); form.resetFields(); setTotalAmount(0); }}
      onOk={() => form.submit()}
      confirmLoading={loading}
      okText="إنشاء"
      cancelText="إلغاء"
      width={820}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} onValuesChange={calculateTotal} dir="rtl">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item label="الفرع" name="branchId" rules={[{ required: true, message: 'اختر الفرع' }]}>
            <Select placeholder="اختر الفرع" options={branches.map((b: any) => ({ label: b.name, value: b.id }))} />
          </Form.Item>
          <Form.Item label="العميل" name="customerId">
            <Select
              allowClear
              showSearch
              placeholder="اختر العميل (اختياري)"
              filterOption={(input, option) => (option?.label as string)?.toLowerCase().includes(input.toLowerCase())}
              options={customers.map((c: any) => ({ label: c.name, value: c.id }))}
            />
          </Form.Item>
        </div>

        <Form.Item label="ملاحظات" name="notes">
          <Input.TextArea rows={2} placeholder="ملاحظات إضافية..." />
        </Form.Item>

        <Divider>بنود الأمر</Divider>

        <Form.List name="items" initialValue={[{}]}>
          {(fields, { add, remove }) => (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 8, marginBottom: 8, fontWeight: 'bold', color: '#666' }}>
                <span>المنتج</span>
                <span>الكمية</span>
                <span>سعر الوحدة</span>
                <span></span>
              </div>
              {fields.map(({ key, name }) => (
                <div key={key} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 8, marginBottom: 8, alignItems: 'start' }}>
                  <Form.Item name={[name, 'productId']} rules={[{ required: true, message: 'اختر منتج' }]} style={{ margin: 0 }}>
                    <Select
                      placeholder="اختر المنتج"
                      showSearch
                      filterOption={(input, option) => (option?.label as string)?.toLowerCase().includes(input.toLowerCase())}
                      options={products.map((p: any) => ({ label: p.name, value: p.id }))}
                      onChange={(val) => handleProductChange(val, name)}
                    />
                  </Form.Item>
                  <Form.Item name={[name, 'quantity']} rules={[{ required: true, message: 'الكمية' }]} style={{ margin: 0 }}>
                    <InputNumber placeholder="الكمية" min={1} style={{ width: '100%' }} />
                  </Form.Item>
                  <Form.Item name={[name, 'unitPrice']} rules={[{ required: true, message: 'السعر' }]} style={{ margin: 0 }}>
                    <InputNumber placeholder="السعر" min={0} precision={2} style={{ width: '100%' }} addonAfter="ج.م" />
                  </Form.Item>
                  <Button danger icon={<DeleteOutlined />} onClick={() => { remove(name); calculateTotal(); }} />
                </div>
              ))}
              <Button type="dashed" onClick={() => add({})} icon={<PlusOutlined />} block>
                إضافة بند
              </Button>
            </>
          )}
        </Form.List>

        <Divider />
        <div style={{ textAlign: 'left' }}>
          <Text strong style={{ fontSize: 16 }}>الإجمالي: {totalAmount.toFixed(2)} ج.م</Text>
        </div>
      </Form>
    </Modal>
  );
}