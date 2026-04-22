import { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Switch, Tag, Space, message } from 'antd';
import { PlusOutlined, DollarOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { currenciesApi } from '../../core/api/core.api';

export default function CurrenciesPage() {
  const [currencyModal, setCurrencyModal] = useState(false);
  const [rateModal, setRateModal] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<any>(null);
  const [currencyForm] = Form.useForm();
  const [rateForm] = Form.useForm();
  const qc = useQueryClient();

  const { data: currencies, isLoading } = useQuery({
    queryKey: ['currencies'],
    queryFn: currenciesApi.getAll,
  });

  const createCurrency = useMutation({
    mutationFn: currenciesApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['currencies'] });
      message.success('تم إضافة العملة');
      setCurrencyModal(false);
      currencyForm.resetFields();
    },
    onError: () => message.error('حدث خطأ'),
  });

  const addRate = useMutation({
    mutationFn: ({ id, rate }: { id: string; rate: number }) =>
      currenciesApi.addRate(id, rate),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['currencies'] });
      message.success('تم تحديث سعر الصرف');
      setRateModal(false);
      rateForm.resetFields();
    },
    onError: () => message.error('حدث خطأ'),
  });

  const columns = [
    {
      title: 'الرمز', dataIndex: 'code', key: 'code',
      render: (v: string) => <Tag color="blue">{v}</Tag>,
    },
    { title: 'الاسم', dataIndex: 'name', key: 'name' },
    { title: 'العلامة', dataIndex: 'symbol', key: 'symbol' },
    {
      title: 'العملة الأساسية', dataIndex: 'isBase', key: 'isBase',
      render: (v: boolean) => v ? <Tag color="green">نعم</Tag> : <Tag>لا</Tag>,
    },
    {
      title: 'آخر سعر صرف', key: 'rate',
      render: (_: any, r: any) => {
        const rate = r.exchangeRates?.[0];
        return rate ? <Tag color="orange">{Number(rate.rate).toFixed(4)}</Tag> : '—';
      },
    },
    {
      title: 'إجراءات', key: 'actions',
      render: (_: any, record: any) =>
        !record.isBase && (
          <Button
            icon={<DollarOutlined />}
            size="small"
            onClick={() => { setSelectedCurrency(record); setRateModal(true); }}
          >
            تحديث سعر الصرف
          </Button>
        ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>العملات</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setCurrencyModal(true)}>
          إضافة عملة
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={currencies || []}
        rowKey="id"
        loading={isLoading}
        pagination={false}
      />

      <Modal
        title="إضافة عملة جديدة"
        open={currencyModal}
        onCancel={() => { setCurrencyModal(false); currencyForm.resetFields(); }}
        onOk={() => currencyForm.submit()}
        confirmLoading={createCurrency.isPending}
        okText="إضافة"
        cancelText="إلغاء"
      >
        <Form form={currencyForm} layout="vertical" onFinish={(v) => createCurrency.mutate(v)}>
          <Form.Item name="code" label="الرمز (مثال: USD)" rules={[{ required: true }]}>
            <Input maxLength={3} style={{ maxWidth: 150 }} />
          </Form.Item>
          <Form.Item name="name" label="الاسم" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="symbol" label="العلامة (مثال: $)" rules={[{ required: true }]}>
            <Input style={{ maxWidth: 100 }} />
          </Form.Item>
          <Form.Item name="isBase" label="عملة أساسية؟" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`تحديث سعر صرف ${selectedCurrency?.code}`}
        open={rateModal}
        onCancel={() => { setRateModal(false); rateForm.resetFields(); }}
        onOk={() => rateForm.submit()}
        confirmLoading={addRate.isPending}
        okText="تحديث"
        cancelText="إلغاء"
      >
        <Form
          form={rateForm}
          layout="vertical"
          onFinish={(v) => addRate.mutate({ id: selectedCurrency.id, rate: v.rate })}
        >
          <Form.Item
            name="rate"
            label={`سعر الصرف (1 ${selectedCurrency?.code} = ? من العملة الأساسية)`}
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: '100%' }} min={0} step={0.01} precision={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}