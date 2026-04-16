import { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, Popconfirm, Tag, Select, Divider, Typography } from 'antd';
import { PlusOutlined, CheckOutlined, DeleteOutlined, SearchOutlined, MinusCircleOutlined, SendOutlined, CloseOutlined } from '@ant-design/icons';
import { useQuotations, useCreateQuotation, useConfirmQuotation, useDeleteQuotation, useSendQuotation, useCancelQuotation } from '../hooks/useQuotations';
import { useCustomers } from '../hooks/useCustomers';
import { useProducts } from '@org/inventory-ui';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const { Option } = Select;
const { Text } = Typography;

const fetchBranches = async () => {
  const token = localStorage.getItem('access_token');
  const res = await axios.get(
    `${import.meta.env['VITE_API_URL'] || 'http://localhost:3000/api'}/branches`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data?.data ?? res.data ?? [];
};

const statusColors: Record<string, string> = {
  DRAFT: 'default', SENT: 'blue', CONFIRMED: 'green', CANCELLED: 'red', EXPIRED: 'orange',
};
const statusLabels: Record<string, string> = {
  DRAFT: 'مسودة', SENT: 'مرسل', CONFIRMED: 'مؤكد', CANCELLED: 'ملغي', EXPIRED: 'منتهي',
};

export default function QuotationsPage() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [form] = Form.useForm();

  const { data: quotations, isLoading } = useQuotations();
  const { data: customers } = useCustomers();
  const { data: products } = useProducts();
  const { data: branches = [] } = useQuery({ queryKey: ['branches'], queryFn: fetchBranches });

  const createQuotation = useCreateQuotation();
  const confirmQuotation = useConfirmQuotation();
  const sendQuotation = useSendQuotation();
  const cancelQuotation = useCancelQuotation();
  const deleteQuotation = useDeleteQuotation();

  const calculateTotal = () => {
    const items = form.getFieldValue('items') || [];
    const discount = Number(form.getFieldValue('discountAmount') ?? 0);
    const sum = items.reduce((acc: number, item: any) => {
      return acc + Number(item?.quantity ?? 0) * Number(item?.unitPrice ?? 0) - Number(item?.discount ?? 0);
    }, 0);
    setTotal(Math.max(0, sum - discount));
  };

  const handleProductChange = (productId: string, name: number) => {
    const product = (products as any[] ?? []).find((p: any) => p.id === productId);
    if (product) {
      const items = form.getFieldValue('items');
      items[name] = { ...items[name], unitPrice: Number(product.price ?? 0) };
      form.setFieldsValue({ items });
      calculateTotal();
    }
  };

const handleSubmit = async () => {
  const values = await form.validateFields();

  if (values.validUntil) {
    values.validUntil = new Date(values.validUntil).toISOString();
  }

  await createQuotation.mutateAsync(values);

  setOpen(false);
  form.resetFields();
  setTotal(0);
};

  const filtered = (quotations as any[] ?? []).filter((q: any) => {
    const matchSearch = !search || q.quotationNumber?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || q.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const columns = [
    { title: 'الرقم', dataIndex: 'quotationNumber', key: 'quotationNumber' },
    {
      title: 'العميل', dataIndex: 'customer', key: 'customer',
      render: (c: any) => c?.name ?? <span style={{ color: '#999' }}>—</span>,
    },
    {
      title: 'الحالة', dataIndex: 'status', key: 'status',
      render: (v: string) => <Tag color={statusColors[v]}>{statusLabels[v]}</Tag>,
    },
    {
      title: 'الإجمالي', dataIndex: 'totalAmount', key: 'totalAmount',
      render: (v: number) => `${Number(v).toFixed(2)} ج.م`,
      align: 'right' as const,
    },
    {
      title: 'صالح حتى', dataIndex: 'validUntil', key: 'validUntil',
      render: (v: string) => v ? new Date(v).toLocaleDateString('ar-EG') : '—',
    },
    {
      title: 'إجراءات', key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          {record.status === 'DRAFT' && (
            <Popconfirm title="إرسال عرض السعر للعميل؟"
              onConfirm={() => sendQuotation.mutate(record.id)}>
              <Button icon={<SendOutlined />} size="small">إرسال</Button>
            </Popconfirm>
          )}
          {(record.status === 'DRAFT' || record.status === 'SENT') && (
            <Popconfirm title="تأكيد وتحويل لأمر بيع؟"
              onConfirm={() => confirmQuotation.mutate(record.id)}>
              <Button icon={<CheckOutlined />} size="small" type="primary">تأكيد</Button>
            </Popconfirm>
          )}
          {(record.status === 'DRAFT' || record.status === 'SENT') && (
            <Popconfirm title="إلغاء عرض السعر؟"
              onConfirm={() => cancelQuotation.mutate(record.id)}>
              <Button icon={<CloseOutlined />} size="small" danger>إلغاء</Button>
            </Popconfirm>
          )}
          {record.status === 'DRAFT' && (
            <Popconfirm title="حذف عرض السعر؟"
              onConfirm={() => deleteQuotation.mutate(record.id)}>
              <Button icon={<DeleteOutlined />} size="small" danger />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }} dir="rtl">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>عروض الأسعار</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
          عرض سعر جديد
        </Button>
      </div>

      <Space style={{ marginBottom: 16 }}>
        <Input prefix={<SearchOutlined />} placeholder="بحث برقم العرض..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          style={{ width: 220 }} allowClear />
        <Select placeholder="فلتر بالحالة" allowClear style={{ width: 150 }}
          onChange={(v) => setStatusFilter(v)}>
          <Option value="DRAFT">مسودة</Option>
          <Option value="SENT">مرسل</Option>
          <Option value="CONFIRMED">مؤكد</Option>
          <Option value="CANCELLED">ملغي</Option>
          <Option value="EXPIRED">منتهي</Option>
        </Select>
      </Space>

      <Table columns={columns} dataSource={filtered} loading={isLoading} rowKey="id"
        pagination={{ pageSize: 15, showTotal: (t) => `إجمالي: ${t} عرض` }} />

      <Modal
        title="عرض سعر جديد"
        open={open}
        onOk={handleSubmit}
        onCancel={() => { setOpen(false); form.resetFields(); setTotal(0); }}
        confirmLoading={createQuotation.isPending}
        okText="حفظ" cancelText="إلغاء" width={880}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }} onValuesChange={calculateTotal} dir="rtl">

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item name="branchId" label="الفرع" rules={[{ required: true, message: 'اختر الفرع' }]}>
              <Select
                placeholder="اختر الفرع"
                options={(branches as any[]).map((b: any) => ({ label: b.name, value: b.id }))}
              />
            </Form.Item>
            <Form.Item name="customerId" label="العميل">
              <Select allowClear showSearch placeholder="اختر العميل"
                filterOption={(input, option) =>
                  (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
                }
                options={(customers as any[] ?? []).map((c: any) => ({ label: c.name, value: c.id }))} />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <Form.Item name="currency" label="العملة" initialValue="EGP">
              <Select>
                <Option value="EGP">جنيه مصري (EGP)</Option>
                <Option value="USD">دولار (USD)</Option>
                <Option value="EUR">يورو (EUR)</Option>
              </Select>
            </Form.Item>
            <Form.Item name="validUntil" label="صالح حتى">
              <Input type="date" />
            </Form.Item>
            <Form.Item name="discountAmount" label="خصم كلي">
              <InputNumber min={0} precision={2} style={{ width: '100%' }} addonAfter="ج.م" />
            </Form.Item>
          </div>

          <Form.Item name="notes" label="ملاحظات">
            <Input.TextArea rows={2} />
          </Form.Item>

          <Divider>البنود</Divider>

          <Form.List name="items" initialValue={[{}]}>
            {(fields, { add, remove }) => (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: 8, marginBottom: 8, fontWeight: 'bold', color: '#666' }}>
                  <span>المنتج</span><span>الكمية</span><span>السعر</span><span>خصم</span><span></span>
                </div>
                {fields.map(({ key, name }) => (
                  <div key={key} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: 8, marginBottom: 8, alignItems: 'start' }}>
                    <Form.Item name={[name, 'productId']} rules={[{ required: true, message: 'مطلوب' }]} style={{ margin: 0 }}>
                      <Select placeholder="اختر المنتج" showSearch
                        filterOption={(input, option) =>
                          (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
                        }
                        options={(products as any[] ?? []).map((p: any) => ({ label: p.name, value: p.id }))}
                        onChange={(val) => handleProductChange(val, name)} />
                    </Form.Item>
                    <Form.Item name={[name, 'quantity']} rules={[{ required: true, message: 'مطلوب' }]} style={{ margin: 0 }}>
                      <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name={[name, 'unitPrice']} rules={[{ required: true, message: 'مطلوب' }]} style={{ margin: 0 }}>
                      <InputNumber min={0} precision={2} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name={[name, 'discount']} style={{ margin: 0 }}>
                      <InputNumber min={0} precision={2} style={{ width: '100%' }} />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => { remove(name); calculateTotal(); }} style={{ color: 'red', marginTop: 8 }} />
                  </div>
                ))}
                <Button type="dashed" onClick={() => add({})} icon={<PlusOutlined />} block>
                  إضافة بند
                </Button>
              </>
            )}
          </Form.List>

          <Divider />
          <div style={{ textAlign: 'left' }}>
            <Text strong style={{ fontSize: 16 }}>الإجمالي: {total.toFixed(2)} ج.م</Text>
          </div>
        </Form>
      </Modal>
    </div>
  );
}