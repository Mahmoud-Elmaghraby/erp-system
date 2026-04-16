import { Form, Input, Modal, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useEffect } from 'react';

interface Props {
  open: boolean;
  loading: boolean;
  initialValues?: any;
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

export default function UnitForm({ open, loading, initialValues, onSubmit, onCancel }: Props) {
  const [form] = Form.useForm();
  const isEdit = !!initialValues;

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
      title={isEdit ? 'تعديل وحدة قياس' : 'إضافة وحدة قياس جديدة'}
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
          rules={[{ required: true, message: 'ادخل اسم وحدة القياس' }]}
        >
          <Input placeholder="مثال: كيلوجرام، متر، قطعة" />
        </Form.Item>
        <Form.Item
          label="الرمز"
          name="symbol"
          rules={[{ required: true, message: 'ادخل الرمز' }]}
        >
          <Input placeholder="مثال: KG، M، PCS" />
        </Form.Item>
        <Form.Item
          label={
            <span>
              كود الوحدة (ETA/ZATCA)&nbsp;
              <Tooltip title="الكود المعتمد لدى هيئة الضرائب المصرية أو الزكاة السعودية مثل EA، KGM، MTR">
                <InfoCircleOutlined style={{ color: '#1890ff' }} />
              </Tooltip>
            </span>
          }
          name="unitCode"
        >
          <Input placeholder="مثال: EA، KGM، MTR، LTR" />
        </Form.Item>
      </Form>
    </Modal>
  );
}