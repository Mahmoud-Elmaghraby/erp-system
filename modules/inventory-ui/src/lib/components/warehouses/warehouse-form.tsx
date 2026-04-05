import { Form, Input, Modal } from 'antd';

interface Props {
  open: boolean;
  loading: boolean;
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

export default function WarehouseForm({ open, loading, onSubmit, onCancel }: Props) {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      title="إضافة مخزن جديد"
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      okText="إضافة"
      cancelText="إلغاء"
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} dir="rtl">
        <Form.Item label="الاسم" name="name" rules={[{ required: true, message: 'ادخل اسم المخزن' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="العنوان" name="address">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}