import { useEffect } from 'react';
import { Form, Switch, Select, Button, Card, Divider, message } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountingApi } from '../api/accounting.api';
import { useChartOfAccounts } from '../hooks/useChartOfAccounts';
import { useJournals } from '../hooks/useJournals';

export default function AccountingSettingsPage() {
  const [form] = Form.useForm();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['accounting-settings'],
    queryFn: accountingApi.settings.get,
  });

  const { data: accountsData } = useChartOfAccounts();
  const accounts = accountsData?.data ?? accountsData ?? [];

  const { data: journalsData } = useJournals();
  const journals = journalsData?.data ?? journalsData ?? [];

  const update = useMutation({
    mutationFn: accountingApi.settings.update,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['accounting-settings'] });
      message.success('تم حفظ إعدادات المحاسبة');
    },
    onError: () => message.error('حدث خطأ'),
  });

  useEffect(() => {
    if (data) form.setFieldsValue(data);
  }, [data, form]);

  const AccountSelect = ({ placeholder }: { placeholder: string }) => (
    <Select style={{ maxWidth: 350 }} allowClear placeholder={placeholder} showSearch
      filterOption={(input, option) =>
        String(option?.children ?? '').toLowerCase().includes(input.toLowerCase())
      }>
      {accounts.filter((a: any) => !a.isGroup).map((a: any) => (
        <Select.Option key={a.id} value={a.id}>{a.code} — {a.name}</Select.Option>
      ))}
    </Select>
  );

  const JournalSelect = ({ placeholder }: { placeholder: string }) => (
    <Select style={{ maxWidth: 350 }} allowClear placeholder={placeholder}>
      {journals.map((j: any) => (
        <Select.Option key={j.id} value={j.id}>{j.name}</Select.Option>
      ))}
    </Select>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>إعدادات المحاسبة</h2>
        <Button type="primary" onClick={() => form.submit()} loading={update.isPending}>حفظ</Button>
      </div>
      <Card loading={isLoading}>
        <Form form={form} layout="vertical" onFinish={(values) => update.mutate(values)}>

          <Divider>المحاسبة</Divider>
          <Form.Item name="journalEntriesEnabled" label="تفعيل القيود المحاسبية" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="method" label="طريقة المحاسبة">
            <Select style={{ maxWidth: 300 }}>
              <Select.Option value="ACCRUAL">الاستحقاق</Select.Option>
              <Select.Option value="CASH">النقدية</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="taxMethod" label="طريقة الضريبة">
            <Select style={{ maxWidth: 300 }}>
              <Select.Option value="EXCLUSIVE">حصري — الضريبة تضاف للسعر</Select.Option>
              <Select.Option value="INCLUSIVE">شامل — الضريبة مضمنة في السعر</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="multiCurrency" label="تعدد العملات" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Divider>الحسابات الافتراضية</Divider>
          <Form.Item name="defaultARAccount"    label="حساب القبض (العملاء)">      <AccountSelect placeholder="اختر حساب" /></Form.Item>
          <Form.Item name="defaultAPAccount"    label="حساب الدفع (الموردون)">    <AccountSelect placeholder="اختر حساب" /></Form.Item>
          <Form.Item name="defaultSalesAccount" label="حساب المبيعات">            <AccountSelect placeholder="اختر حساب" /></Form.Item>
          <Form.Item name="defaultCOGSAccount"  label="حساب تكلفة المبيعات">     <AccountSelect placeholder="اختر حساب" /></Form.Item>
          <Form.Item name="defaultCashAccount"  label="حساب الصندوق">            <AccountSelect placeholder="اختر حساب" /></Form.Item>
          <Form.Item name="defaultBankAccount"  label="حساب البنك">              <AccountSelect placeholder="اختر حساب" /></Form.Item>
          <Form.Item name="defaultExpenseAccount" label="حساب المصروفات">       <AccountSelect placeholder="اختر حساب" /></Form.Item>

          <Divider>اليوميات الافتراضية</Divider>
          <Form.Item name="defaultSaleJournalId"     label="يومية المبيعات">    <JournalSelect placeholder="اختر يومية" /></Form.Item>
          <Form.Item name="defaultPurchaseJournalId" label="يومية المشتريات">   <JournalSelect placeholder="اختر يومية" /></Form.Item>
          <Form.Item name="defaultCashJournalId"     label="يومية الصندوق">    <JournalSelect placeholder="اختر يومية" /></Form.Item>
          <Form.Item name="defaultBankJournalId"     label="يومية البنك">       <JournalSelect placeholder="اختر يومية" /></Form.Item>

        </Form>
      </Card>
    </div>
  );
}