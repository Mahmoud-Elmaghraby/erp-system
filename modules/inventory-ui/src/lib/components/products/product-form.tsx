import { Form, Input, InputNumber, Modal } from 'antd';

interface Props {
  open: boolean;
  loading: boolean;
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

export default function ProductForm({ open, loading, onSubmit, onCancel }: Props) {
  const [form] = Form.useForm();

  const handleOk = () => form.submit();

  const handleFinish = (values: any) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      title="إضافة منتج جديد"
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
      okText="إضافة"
      cancelText="إلغاء"
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} dir="rtl">
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
  );
}