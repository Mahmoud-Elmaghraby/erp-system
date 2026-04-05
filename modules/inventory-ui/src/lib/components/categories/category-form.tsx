import { Form, Input, Modal, Select } from 'antd';

interface Props {
  open: boolean;
  loading: boolean;
  categories: any[];
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

export default function CategoryForm({ open, loading, categories, onSubmit, onCancel }: Props) {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      title="إضافة تصنيف جديد"
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      okText="إضافة"
      cancelText="إلغاء"
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} dir="rtl">
        <Form.Item label="الاسم" name="name" rules={[{ required: true, message: 'ادخل اسم التصنيف' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="التصنيف الأب" name="parentId">
          <Select
            allowClear
            placeholder="اختياري"
            options={categories?.map((c: any) => ({ label: c.name, value: c.id }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}