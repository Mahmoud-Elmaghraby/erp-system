import { Form, Input, Modal, Select } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import axios from 'axios';

const fetchBranches = async () => {
  const token = localStorage.getItem('access_token');
  const res = await axios.get(
    `${import.meta.env['VITE_API_URL'] || 'http://localhost:3000/api'}/branches`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data?.data ?? [];
};

interface Props {
  open: boolean;
  loading: boolean;
  initialValues?: any;
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

export default function WarehouseForm({ open, loading, initialValues, onSubmit, onCancel }: Props) {
  const [form] = Form.useForm();
  const isEdit = !!initialValues;

  const { data: branches = [] } = useQuery({
    queryKey: ['branches'],
    queryFn: fetchBranches,
  });

  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue(initialValues);
    } else if (!open) {
      form.resetFields();
    }
  }, [open, initialValues, form]);

  const handleFinish = (values: any) => {
    onSubmit(values);
  };

  return (
    <Modal
      title={isEdit ? 'تعديل مخزن' : 'إضافة مخزن جديد'}
      open={open}
      onCancel={() => { onCancel(); form.resetFields(); }}
      onOk={() => form.submit()}
      confirmLoading={loading}
      okText={isEdit ? 'حفظ التعديلات' : 'إضافة'}
      cancelText="إلغاء"
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} dir="rtl">
        <Form.Item
          label="الاسم"
          name="name"
          rules={[{ required: true, message: 'ادخل اسم المخزن' }]}
        >
          <Input placeholder="مثال: المخزن الرئيسي" />
        </Form.Item>

        {!isEdit && (
          <Form.Item
            label="الفرع"
            name="branchId"
            rules={[{ required: true, message: 'اختر الفرع' }]}
          >
            <Select
              placeholder="اختر فرع"
              options={branches.map((b: any) => ({ label: b.name, value: b.id }))}
            />
          </Form.Item>
        )}

        <Form.Item label="العنوان" name="address">
          <Input placeholder="عنوان المخزن (اختياري)" />
        </Form.Item>
      </Form>
    </Modal>
  );
}