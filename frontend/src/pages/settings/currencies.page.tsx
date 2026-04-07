import { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Switch, Tag, message } from 'antd';
import { PlusOutlined, DollarOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../core/api/axios.config';

export default function CurrenciesPage() {
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<any>(null);
  const [currencyForm] = Form.useForm();
  const [rateForm] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: currencies, isLoading } = useQuery({
    queryKey: ['currencies'],
    queryFn: async () => (await api.get('/currencies')).data,
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => (await api.post('/currencies', data)).data,
    onSuccess: () => {
      message.success('تم إضافة العملة');
      queryClient.invalidateQueries({ queryKey: ['currencies'] });
      setIsCurrencyModalOpen(false);
      currencyForm.resetFields();
    },
    onError: () => message.error('حدث خطأ'),
  });

  const addRateMutation = useMutation({
    mutationFn: async ({ id, rate }: { id: string; rate: number }) =>
      (await api.post(`/currencies/${id}/exchange-rate`, { rate })).data,
    onSuccess: () => {
      message.success('تم تحديث سعر الصرف');
      queryClient.invalidateQueries({ queryKey: ['currencies'] });
      setIsRateModalOpen(false);
      rateForm.resetFields();
    },
    onError: () => message.error('حدث خطأ'),
  });

  const columns = [
    { title: 'الرمز', dataIndex: 'code', key: 'code', render: (v: string) => <Tag color="blue">{v}</Tag> },
    { title: 'الاسم', dataIndex: 'name', key: 'name' },
    { title: 'الرمز', dataIndex: 'symbol', key: 'symbol' },
    {
      title: 'العملة الأساسية',
      dataIndex: 'isBase',
      key: 'isBase',
      render: (v: boolean) => v ? <Tag color="green">نعم</Tag> : <Tag>لا</Tag>,
    },
    {
      title: 'إجراءات',
      key: 'actions',
      render: (_: any, record: any) => (
        !record.isBase && (
          <Button
            icon={<DollarOutlined />}
            size="small"
            onClick={() => { setSelectedCurrency(record); setIsRateModalOpen(true); }}
          >
            تحديث سعر الصرف
          </Button>
        )
      ),
    },
  ];

  return (
    <div dir="rtl">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>العملات</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCurrencyModalOpen(true)}>
          إضافة عملة
        </Button>
      </div>

      <Table columns={columns} dataSource={currencies || []} rowKey="id" loading={isLoading} />

      <Modal
        title="إضافة عملة جديدة"
        open={isCurrencyModalOpen}
        onCancel={() => setIsCurrencyModalOpen(false)}
        onOk={() => currencyForm.submit()}
        confirmLoading={createMutation.isPending}
        okText="إضافة"
        cancelText="إلغاء"
      >
        <Form form={currencyForm} layout="vertical" onFinish={createMutation.mutate} dir="rtl">
          <Form.Item label="الرمز (مثال: USD)" name="code" rules={[{ required: true }]}>
            <Input maxLength={3} />
          </Form.Item>
          <Form.Item label="الاسم" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="الرمز (مثال: $)" name="symbol" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="عملة أساسية؟" name="isBase" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`تحديث سعر صرف ${selectedCurrency?.code}`}
        open={isRateModalOpen}
        onCancel={() => setIsRateModalOpen(false)}
        onOk={() => rateForm.submit()}
        confirmLoading={addRateMutation.isPending}
        okText="تحديث"
        cancelText="إلغاء"
      >
        <Form
          form={rateForm}
          layout="vertical"
          dir="rtl"
          onFinish={(values) => addRateMutation.mutate({ id: selectedCurrency.id, rate: values.rate })}
        >
          <Form.Item
            label={`سعر الصرف (1 ${selectedCurrency?.code} = ? EGP)`}
            name="rate"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: '100%' }} min={0} step={0.01} precision={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}