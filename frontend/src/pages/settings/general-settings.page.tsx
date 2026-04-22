import { useEffect } from 'react';
import { Form, Select, Switch, Input, Button, Card, Divider, message } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { companySettingsApi } from '../../core/api/core.api';

const MONTHS = [
  { label: 'يناير', value: 1 }, { label: 'فبراير', value: 2 },
  { label: 'مارس', value: 3 }, { label: 'أبريل', value: 4 },
  { label: 'مايو', value: 5 }, { label: 'يونيو', value: 6 },
  { label: 'يوليو', value: 7 }, { label: 'أغسطس', value: 8 },
  { label: 'سبتمبر', value: 9 }, { label: 'أكتوبر', value: 10 },
  { label: 'نوفمبر', value: 11 }, { label: 'ديسمبر', value: 12 },
];

const CURRENCIES = [
  { label: 'جنيه مصري (EGP)', value: 'EGP' },
  { label: 'ريال سعودي (SAR)', value: 'SAR' },
  { label: 'دولار أمريكي (USD)', value: 'USD' },
  { label: 'يورو (EUR)', value: 'EUR' },
  { label: 'درهم إماراتي (AED)', value: 'AED' },
];

export default function GeneralSettingsPage() {
  const [form] = Form.useForm();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['company-settings'],
    queryFn: companySettingsApi.get,
  });

  const update = useMutation({
    mutationFn: companySettingsApi.update,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['company-settings'] });
      message.success('تم حفظ الإعدادات');
    },
    onError: () => message.error('حدث خطأ'),
  });

  useEffect(() => {
    if (data) form.setFieldsValue(data);
  }, [data, form]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>الإعدادات العامة</h2>
        <Button type="primary" onClick={() => form.submit()} loading={update.isPending}>
          حفظ الإعدادات
        </Button>
      </div>

      <Form form={form} layout="vertical" onFinish={(values) => update.mutate(values)}>

        <Card title="إعدادات الشركة" loading={isLoading} style={{ marginBottom: 16 }}>
          <Form.Item name="defaultCurrency" label="العملة الأساسية">
            <Select options={CURRENCIES} style={{ maxWidth: 300 }} />
          </Form.Item>
          <Form.Item name="fiscalYearStart" label="بداية السنة المالية">
            <Select options={MONTHS} style={{ maxWidth: 300 }} />
          </Form.Item>
          <Form.Item name="taxIncludedInPrice" label="الضريبة مضمنة في السعر" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Card>

        <Card title="بادئات المستندات" loading={isLoading} style={{ marginBottom: 16 }}>
          <Divider>المبيعات</Divider>
          <Form.Item name="quotationPrefix" label="عرض السعر">
            <Input style={{ maxWidth: 150 }} />
          </Form.Item>
          <Form.Item name="salesOrderPrefix" label="أمر البيع">
            <Input style={{ maxWidth: 150 }} />
          </Form.Item>
          <Form.Item name="invoicePrefix" label="الفاتورة">
            <Input style={{ maxWidth: 150 }} />
          </Form.Item>
          <Form.Item name="deliveryPrefix" label="التسليم">
            <Input style={{ maxWidth: 150 }} />
          </Form.Item>
          <Form.Item name="returnPrefix" label="المرتجع">
            <Input style={{ maxWidth: 150 }} />
          </Form.Item>
          <Divider>المشتريات</Divider>
          <Form.Item name="rfqPrefix" label="طلب العرض">
            <Input style={{ maxWidth: 150 }} />
          </Form.Item>
          <Form.Item name="purchaseOrderPrefix" label="أمر الشراء">
            <Input style={{ maxWidth: 150 }} />
          </Form.Item>
          <Form.Item name="billPrefix" label="الفاتورة الواردة">
            <Input style={{ maxWidth: 150 }} />
          </Form.Item>
          <Form.Item name="receiptPrefix" label="الإيصال">
            <Input style={{ maxWidth: 150 }} />
          </Form.Item>
        </Card>

        <Card title="بيانات الفاتورة الإلكترونية" loading={isLoading} style={{ marginBottom: 16 }}>
          <Form.Item name="country" label="الدولة">
            <Select style={{ maxWidth: 200 }}>
              <Select.Option value="EG">مصر</Select.Option>
              <Select.Option value="SA">السعودية</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="taxRegNumber" label="الرقم الضريبي">
            <Input style={{ maxWidth: 300 }} />
          </Form.Item>
          <Form.Item name="commercialReg" label="السجل التجاري">
            <Input style={{ maxWidth: 300 }} />
          </Form.Item>
          <Form.Item name="activityCode" label="كود النشاط">
            <Input style={{ maxWidth: 300 }} />
          </Form.Item>
        </Card>

        <Card title="ETA (مصر)" loading={isLoading} style={{ marginBottom: 16 }}>
          <Form.Item name="etaEnabled" label="تفعيل ETA" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="etaEnvironment" label="البيئة">
            <Select style={{ maxWidth: 200 }}>
              <Select.Option value="sandbox">تجريبية</Select.Option>
              <Select.Option value="production">إنتاجية</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="etaClientId" label="Client ID">
            <Input.Password style={{ maxWidth: 400 }} />
          </Form.Item>
          <Form.Item name="etaClientSecret" label="Client Secret">
            <Input.Password style={{ maxWidth: 400 }} />
          </Form.Item>
        </Card>

        <Card title="ZATCA (السعودية)" loading={isLoading} style={{ marginBottom: 16 }}>
          <Form.Item name="zatcaEnabled" label="تفعيل ZATCA" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="zatcaEnvironment" label="البيئة">
            <Select style={{ maxWidth: 200 }}>
              <Select.Option value="sandbox">تجريبية</Select.Option>
              <Select.Option value="production">إنتاجية</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="zatcaCSID" label="CSID">
            <Input.Password style={{ maxWidth: 400 }} />
          </Form.Item>
        </Card>

      </Form>
    </div>
  );
}