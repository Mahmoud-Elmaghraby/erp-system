import { Form, Input, Modal, Select, Tabs, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useEffect } from 'react';

interface CustomerFormValues {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  taxRegNumber?: string;
  commercialReg?: string;
  country?: string;
  buyerType?: string;
}

interface Props {
  open: boolean;
  loading: boolean;
  initialValues?: Partial<CustomerFormValues>;
  onSubmit: (values: CustomerFormValues) => void;
  onCancel: () => void;
}

export default function CustomerForm({ open, loading, initialValues, onSubmit, onCancel }: Props) {
  const [form] = Form.useForm();
  const isEdit = !!initialValues;

  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue(initialValues);
    } else if (!open) {
      form.resetFields();
    }
  }, [open, initialValues, form]);

  const handleFinish = (values: CustomerFormValues) => {
    onSubmit(values);
  };

  return (
    <Modal
      title={isEdit ? 'تعديل عميل' : 'إضافة عميل جديد'}
      open={open}
      onCancel={() => { onCancel(); form.resetFields(); }}
      onOk={() => form.submit()}
      confirmLoading={loading}
      okText={isEdit ? 'حفظ التعديلات' : 'إضافة'}
      cancelText="إلغاء"
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} dir="rtl">
        <Tabs items={[
          {
            key: 'basic',
            label: 'البيانات الأساسية',
            children: (
              <>
                <Form.Item
                  label="الاسم"
                  name="name"
                  rules={[{ required: true, message: 'ادخل اسم العميل' }]}
                >
                  <Input placeholder="اسم العميل أو الشركة" />
                </Form.Item>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Form.Item label="البريد الإلكتروني" name="email">
                    <Input type="email" placeholder="email@example.com" />
                  </Form.Item>
                  <Form.Item label="التليفون" name="phone">
                    <Input placeholder="01xxxxxxxxx" />
                  </Form.Item>
                </div>

                <Form.Item label="العنوان" name="address">
                  <Input.TextArea rows={2} placeholder="العنوان الكامل" />
                </Form.Item>
              </>
            ),
          },
          {
            key: 'einvoice',
            label: (
              <span>
                الفاتورة الإلكترونية&nbsp;
                <Tooltip title="بيانات مطلوبة لإصدار الفاتورة الإلكترونية">
                  <InfoCircleOutlined style={{ color: '#1890ff' }} />
                </Tooltip>
              </span>
            ),
            children: (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Form.Item label="الرقم الضريبي" name="taxRegNumber">
                    <Input placeholder="الرقم الضريبي" />
                  </Form.Item>
                  <Form.Item label="السجل التجاري" name="commercialReg">
                    <Input placeholder="رقم السجل التجاري" />
                  </Form.Item>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Form.Item label="الدولة" name="country" initialValue="EG">
                    <Select options={[
                      { label: 'مصر', value: 'EG' },
                      { label: 'السعودية', value: 'SA' },
                      { label: 'الإمارات', value: 'AE' },
                      { label: 'الكويت', value: 'KW' },
                    ]} />
                  </Form.Item>
                  <Form.Item label="نوع المشتري" name="buyerType" initialValue="B">
                    <Select options={[
                      { label: 'شركة (B2B)', value: 'B' },
                      { label: 'فرد (B2C)', value: 'P' },
                    ]} />
                  </Form.Item>
                </div>
              </>
            ),
          },
        ]} />
      </Form>
    </Modal>
  );
}