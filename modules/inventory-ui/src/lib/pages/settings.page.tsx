import { useEffect } from 'react';
import { Form, Switch, Select, InputNumber, Button, Card, Spin } from 'antd';
import { useInventorySettings, useUpdateInventorySettings } from '../hooks/useInventorySettings';

export default function InventorySettingsPage() {
  const [form] = Form.useForm();
  const { data: settings, isLoading } = useInventorySettings();
  const updateMutation = useUpdateInventorySettings();

  useEffect(() => {
    if (settings) form.setFieldsValue(settings);
  }, [settings, form]);

  if (isLoading) return <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />;

  return (
    <div dir="rtl">
      <h2>إعدادات المخزون</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={updateMutation.mutate}
        style={{ maxWidth: 600 }}
      >
        <Card title="تقييم المخزون" style={{ marginBottom: 16 }}>
          <Form.Item label="طريقة التقييم" name="valuationMethod">
            <Select options={[
              { label: 'FIFO - أول داخل أول خارج', value: 'FIFO' },
              { label: 'AVCO - المتوسط المرجح', value: 'AVCO' },
              { label: 'Standard Cost - التكلفة المعيارية', value: 'STANDARD' },
            ]} />
          </Form.Item>
        </Card>

        <Card title="التتبع" style={{ marginBottom: 16 }}>
          <Form.Item label="تتبع أرقام الدفعات (Lot Numbers)" name="trackLotNumbers" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item label="تتبع الأرقام التسلسلية (Serial Numbers)" name="trackSerialNumbers" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item label="تتبع تواريخ الانتهاء" name="trackExpiryDates" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Card>

        <Card title="الموافقات" style={{ marginBottom: 16 }}>
          <Form.Item label="موافقة على التحويل بين المخازن" name="requireTransferApproval" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item label="موافقة على تسوية المخزون" name="requireAdjustmentApproval" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Card>

        <Card title="تنبيهات وقواعد" style={{ marginBottom: 16 }}>
          <Form.Item label="تفعيل تنبيه نقص المخزون" name="enableLowStockAlert" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item label="الحد الأدنى الافتراضي للمخزون" name="defaultMinStock">
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item label="السماح بمخزون سالب" name="allowNegativeStock" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Card>

        <Button type="primary" htmlType="submit" loading={updateMutation.isPending} size="large">
          حفظ الإعدادات
        </Button>
      </Form>
    </div>
  );
}