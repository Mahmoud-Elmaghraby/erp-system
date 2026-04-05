import { Form, Input, Modal } from 'antd';

interface Props {
  open: boolean;
  loading: boolean;
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

export default function UnitForm({ open, loading, onSubmit, onCancel }: Props) {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      title="إضافة وحدة قياس جديدة"
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      okText="إضافة"
      cancelText="إلغاء"
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} dir="rtl">
        <Form.Item label="الاسم" name="name" rules={[{ required: true, message: 'ادخل اسم وحدة القياس' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="الرمز" name="symbol" rules={[{ required: true, message: 'ادخل الرمز' }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}