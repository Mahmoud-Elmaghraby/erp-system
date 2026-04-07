import { Form, Input, InputNumber, Modal, Select, Button, Space } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

interface Props {
  open: boolean;
  loading: boolean;
  customers: any[];
  products: any[];
  branchId: string;
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

export default function OrderForm({ open, loading, customers, products, branchId, onSubmit, onCancel }: Props) {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    onSubmit({ ...values, branchId });
    form.resetFields();
  };

  return (
    <Modal
      title="إنشاء أوردر جديد"
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      okText="إنشاء"
      cancelText="إلغاء"
      width={700}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} dir="rtl">
        <Form.Item label="العميل" name="customerId">
          <Select
            allowClear
            placeholder="اختياري"
            options={customers?.map((c: any) => ({ label: c.name, value: c.id }))}
          />
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
                    <Select
                      placeholder="المنتج"
                      style={{ width: 200 }}
                      options={products?.map((p: any) => ({ label: p.name, value: p.id }))}
                    />
                  </Form.Item>
                  <Form.Item name={[name, 'quantity']} rules={[{ required: true }]}>
                    <InputNumber placeholder="الكمية" min={1} />
                  </Form.Item>
                  <Form.Item name={[name, 'unitPrice']} rules={[{ required: true }]}>
                    <InputNumber placeholder="السعر" min={0} />
                  </Form.Item>
                  <Button danger icon={<DeleteOutlined />} onClick={() => remove(name)} />
                </Space>
              ))}
              <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                إضافة منتج
              </Button>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
}