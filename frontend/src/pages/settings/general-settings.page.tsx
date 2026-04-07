import { useEffect } from 'react';
import { Form, Select, Switch, Button, Card, message } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../core/api/axios.config';

const COMPANY_ID = 'default';

export default function GeneralSettingsPage() {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: settings } = useQuery({
    queryKey: ['company-settings'],
    queryFn: async () => (await api.get(`/company-settings/${COMPANY_ID}`)).data,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => (await api.put(`/company-settings/${COMPANY_ID}`, data)).data,
    onSuccess: () => {
      message.success('تم حفظ الإعدادات');
      queryClient.invalidateQueries({ queryKey: ['company-settings'] });
    },
    onError: () => message.error('حدث خطأ'),
  });

  useEffect(() => {
    if (settings) form.setFieldsValue(settings);
  }, [settings, form]);

  return (
    <div dir="rtl">
      <h2>الإعدادات العامة</h2>
      <Form form={form} layout="vertical" onFinish={updateMutation.mutate} style={{ maxWidth: 600 }}>
        <Card title="إعدادات الشركة" style={{ marginBottom: 16 }}>
          <Form.Item label="العملة الأساسية" name="defaultCurrency">
            <Select options={[
              { label: 'جنيه مصري (EGP)', value: 'EGP' },
              { label: 'دولار أمريكي (USD)', value: 'USD' },
              { label: 'درهم إماراتي (AED)', value: 'AED' },
              { label: 'يورو (EUR)', value: 'EUR' },
            ]} />
          </Form.Item>
          <Form.Item label="بداية السنة المالية (الشهر)" name="fiscalYearStart">
            <Select options={[
              { label: 'يناير', value: 1 },
              { label: 'فبراير', value: 2 },
              { label: 'مارس', value: 3 },
              { label: 'أبريل', value: 4 },
              { label: 'مايو', value: 5 },
              { label: 'يونيو', value: 6 },
              { label: 'يوليو', value: 7 },
              { label: 'أغسطس', value: 8 },
              { label: 'سبتمبر', value: 9 },
              { label: 'أكتوبر', value: 10 },
              { label: 'نوفمبر', value: 11 },
              { label: 'ديسمبر', value: 12 },
            ]} />
          </Form.Item>
          <Form.Item label="الضريبة مضمنة في السعر؟" name="taxIncludedInPrice" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Card>

        <Card title="بادئات المستندات" style={{ marginBottom: 16 }}>
          <Form.Item label="بادئة أوامر البيع" name="salesOrderPrefix">
            <Select options={[
              { label: 'SO', value: 'SO' },
              { label: 'ORD', value: 'ORD' },
              { label: 'SAL', value: 'SAL' },
            ]} />
          </Form.Item>
          <Form.Item label="بادئة الفواتير" name="invoicePrefix">
            <Select options={[
              { label: 'INV', value: 'INV' },
              { label: 'FAT', value: 'FAT' },
            ]} />
          </Form.Item>
          <Form.Item label="بادئة أوامر الشراء" name="purchaseOrderPrefix">
            <Select options={[
              { label: 'PO', value: 'PO' },
              { label: 'PUR', value: 'PUR' },
            ]} />
          </Form.Item>
          <Form.Item label="بادئة الفواتير الواردة" name="billPrefix">
            <Select options={[
              { label: 'BILL', value: 'BILL' },
              { label: 'VB', value: 'VB' },
            ]} />
          </Form.Item>
          <Form.Item label="بادئة الإيصالات" name="receiptPrefix">
            <Select options={[
              { label: 'REC', value: 'REC' },
              { label: 'RCPT', value: 'RCPT' },
            ]} />
          </Form.Item>
        </Card>

        <Button type="primary" htmlType="submit" loading={updateMutation.isPending} size="large">
          حفظ الإعدادات
        </Button>
      </Form>
    </div>
  );
}