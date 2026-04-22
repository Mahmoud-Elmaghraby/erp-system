import { Form, Input, InputNumber, Modal, Select, Tabs, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { useUnits } from '../../hooks/useUnits';

interface Props {
  open: boolean;
  loading: boolean;
  initialValues?: any;
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

export default function ProductForm({ open, loading, initialValues, onSubmit, onCancel }: Props) {
  const [form] = Form.useForm();
  const { data: categories } = useCategories();
  const { data: units } = useUnits();
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
      title={isEdit ? 'تعديل منتج' : 'إضافة منتج جديد'}
      open={open}
      onCancel={() => { onCancel(); form.resetFields(); }}
      onOk={() => form.submit()}
      confirmLoading={loading}
      okText={isEdit ? 'حفظ التعديلات' : 'إضافة'}
      cancelText="إلغاء"
      width={680}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} dir="rtl">
        <Tabs
          items={[
            {
              key: 'basic',
              label: 'البيانات الأساسية',
              children: (
                <>
                  <Form.Item
                    label="اسم المنتج"
                    name="name"
                    rules={[{ required: true, message: 'ادخل اسم المنتج' }]}
                  >
                    <Input placeholder="ادخل اسم المنتج" />
                  </Form.Item>

                  <Form.Item label="الوصف" name="description">
                    <Input.TextArea rows={2} placeholder="وصف اختياري" />
                  </Form.Item>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <Form.Item label="الباركود" name="barcode">
                      <Input placeholder="مثال: 6901234567890" />
                    </Form.Item>
                    <Form.Item label="SKU" name="sku">
                      <Input placeholder="رمز التخزين الداخلي" />
                    </Form.Item>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <Form.Item label="التصنيف" name="categoryId">
                      <Select
                        allowClear
                        placeholder="اختر تصنيف"
                        options={(categories as any[] ?? []).map((c: any) => ({ label: c.name, value: c.id }))}
                      />
                    </Form.Item>
                    <Form.Item label="وحدة القياس" name="unitOfMeasureId">
                      <Select
                        allowClear
                        placeholder="اختر وحدة قياس"
                        options={(units as any[] ?? []).map((u: any) => ({
                          label: `${u.name} (${u.symbol})`,
                          value: u.id,
                        }))}
                      />
                    </Form.Item>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <Form.Item label="سعر البيع" name="price">
                      <InputNumber
                        style={{ width: '100%' }}
                        min={0}
                        precision={2}
                        addonAfter="ج.م"
                        placeholder="0.00"
                      />
                    </Form.Item>
                    <Form.Item label="التكلفة" name="cost">
                      <InputNumber
                        style={{ width: '100%' }}
                        min={0}
                        precision={2}
                        addonAfter="ج.م"
                        placeholder="0.00"
                      />
                    </Form.Item>
                  </div>
                </>
              ),
            },
            {
              key: 'einvoice',
              label: (
                <span>
                  الفاتورة الإلكترونية&nbsp;
                  <Tooltip title="بيانات مطلوبة لإصدار الفاتورة الإلكترونية (ETA مصر / ZATCA السعودية)">
                    <InfoCircleOutlined style={{ color: '#1890ff' }} />
                  </Tooltip>
                </span>
              ),
              children: (
                <>
                  <Form.Item
                    label="كود الصنف"
                    name="itemCode"
                    tooltip="GS1 Code أو EGS Code المعتمد من هيئة الضرائب"
                  >
                    <Input placeholder="مثال: 6901234567890" />
                  </Form.Item>
                  <Form.Item label="نوع الكود" name="itemType">
                    <Select
                      allowClear
                      placeholder="اختر نوع الكود"
                      options={[
                        { label: 'GS1', value: 'GS1' },
                        { label: 'EGS', value: 'EGS' },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item
                    label="نوع الوحدة"
                    name="unitType"
                    tooltip="كود الوحدة المعتمد مثل EA للقطعة و KGM للكيلوجرام"
                  >
                    <Select
                      allowClear
                      placeholder="اختر نوع الوحدة"
                      options={[
                        { label: 'EA - قطعة', value: 'EA' },
                        { label: 'KGM - كيلوجرام', value: 'KGM' },
                        { label: 'MTR - متر', value: 'MTR' },
                        { label: 'LTR - لتر', value: 'LTR' },
                        { label: 'SET - طقم', value: 'SET' },
                        { label: 'BOX - علبة', value: 'BOX' },
                        { label: 'DZN - دزينة', value: 'DZN' },
                      ]}
                    />
                  </Form.Item>
                </>
              ),
            },
          ]}
        />
      </Form>
    </Modal>
  );
}