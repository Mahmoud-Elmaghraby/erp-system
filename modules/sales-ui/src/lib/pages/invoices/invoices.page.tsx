import { useState } from 'react';
import { Table, Tag, Button, Modal, Form, InputNumber, Select, Space, Input, Popconfirm } from 'antd';
import { SearchOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useInvoices, usePayInvoice, useCancelInvoice } from '../../hooks/useInvoices';

const { Option } = Select;

const statusColors: Record<string, string> = {
  UNPAID: 'red', PAID: 'green', PARTIAL: 'orange', CANCELLED: 'default',
  OVERDUE: 'darkred', DUE: 'orange', DRAFT: 'default', OVERPAID: 'cyan'
};
const statusLabels: Record<string, string> = {
  UNPAID: 'غير مدفوع', PAID: 'مدفوع', PARTIAL: 'جزئي', CANCELLED: 'ملغي',
  OVERDUE: 'متأخر', DUE: 'مستحقة الدفع', DRAFT: 'مسودة', OVERPAID: 'مدفوع بالزيادة'
};

const getDerivedStatus = (invoice: any) => {
  if (invoice.status === 'CANCELLED') return 'CANCELLED';
  if (invoice.status === 'PAID') return 'PAID';
  if (Number(invoice.paidAmount) > Number(invoice.totalAmount)) return 'OVERPAID';
  
  if (invoice.dueDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(invoice.dueDate);
    due.setHours(0, 0, 0, 0);
    
    if (due < today) return 'OVERDUE';
    if (due >= today) return 'DUE';
  }
  return invoice.status === 'UNPAID' ? 'UNPAID' : (invoice.status || 'DRAFT');
};

export default function InvoicesPage() {
  const [payOpen, setPayOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { data: invoices, isLoading } = useInvoices();
  const payInvoice = usePayInvoice();
  const cancelInvoice = useCancelInvoice();

  const handlePay = async () => {
    const values = await form.validateFields();
    await payInvoice.mutateAsync({ id: selectedInvoice.id, data: values });
    setPayOpen(false);
    form.resetFields();
  };

  const derivedInvoices = (invoices as any[] ?? []).map((i: any) => ({
    ...i,
    derivedStatus: getDerivedStatus(i)
  }));

  const filtered = derivedInvoices.filter((i: any) => {
    const searchLower = search.toLowerCase();
    const matchSearch = !search || 
      i.invoiceNumber?.toLowerCase().includes(searchLower) ||
      i.order?.customer?.name?.toLowerCase().includes(searchLower) ||
      i.customer?.name?.toLowerCase().includes(searchLower);

    const matchStatus = !statusFilter || i.derivedStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const columns = [
    { title: 'رقم الفاتورة', dataIndex: 'invoiceNumber', key: 'invoiceNumber' },
    {
      title: 'العميل',
      key: 'customerName',
      render: (_: any, r: any) => r.order?.customer?.name || r.customer?.name || '---',
    },
    {
      title: 'الحالة', dataIndex: 'derivedStatus', key: 'status',
      render: (v: string) => <Tag color={statusColors[v] ?? 'default'}>{statusLabels[v] ?? v}</Tag>,
    },
    {
      title: 'الإجمالي', dataIndex: 'totalAmount', key: 'totalAmount',
      render: (v: number) => `${Number(v).toFixed(2)} ج.م`,
      align: 'right' as const,
    },
    {
      title: 'المدفوع', dataIndex: 'paidAmount', key: 'paidAmount',
      render: (v: number) => `${Number(v).toFixed(2)} ج.م`,
      align: 'right' as const,
    },
    {
      title: 'المتبقي', key: 'remaining',
      render: (_: any, r: any) => (
        <span style={{ color: Number(r.totalAmount) > Number(r.paidAmount) ? 'red' : 'green' }}>
          {(Number(r.totalAmount) - Number(r.paidAmount)).toFixed(2)} ج.م
        </span>
      ),
      align: 'right' as const,
    },
    {
      title: 'تاريخ الإصدار', dataIndex: 'dateTimeIssued', key: 'dateTimeIssued',
      render: (v: string) => new Date(v).toLocaleDateString('ar-EG'),
    },
    {
      title: 'إجراءات', key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          {record.status !== 'PAID' && record.status !== 'CANCELLED' && (
            <Button size="small" type="primary"
              onClick={() => { setSelectedInvoice(record); setPayOpen(true); }}>
              تسجيل دفع
            </Button>
          )}
          {record.status !== 'PAID' && record.status !== 'CANCELLED' && (
            <Popconfirm title="إلغاء الفاتورة؟" onConfirm={() => cancelInvoice.mutate(record.id)}>
              <Button size="small" danger icon={<CloseOutlined />}>إلغاء</Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }} dir="rtl">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>الفواتير</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/sales/invoices/create')}>
          فاتورة جديدة
        </Button>
      </div>

      <Space style={{ marginBottom: 16 }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="بحث برقم الفاتورة أو العميل..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 260 }}
          allowClear
        />
        <Select placeholder="فلتر بالحالة" allowClear style={{ width: 150 }}
          onChange={(v) => setStatusFilter(v)}>
          <Option value="OVERPAID">مدفوع بالزيادة</Option>
          <Option value="DRAFT">مسودة</Option>
          <Option value="UNPAID">غير مدفوعة</Option>
          <Option value="DUE">مستحقة الدفع</Option>
          <Option value="OVERDUE">متأخر</Option>
          <Option value="PARTIAL">جزئي</Option>
          <Option value="PAID">مدفوع</Option>
          <Option value="CANCELLED">ملغي</Option>
        </Select>
      </Space>

      <Table
        columns={columns}
        dataSource={filtered}
        loading={isLoading}
        rowKey="id"
        pagination={{ pageSize: 15, showTotal: (t) => `إجمالي: ${t} فاتورة` }}
      />

      <Modal
        title={`تسجيل دفع — فاتورة ${selectedInvoice?.invoiceNumber ?? ''}`}
        open={payOpen}
        onOk={handlePay}
        onCancel={() => { setPayOpen(false); form.resetFields(); }}
        confirmLoading={payInvoice.isPending}
        okText="تأكيد الدفع"
        cancelText="إلغاء"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="amount" label="المبلغ" rules={[{ required: true, message: 'مطلوب' }]}>
            <InputNumber
              min={0.01}
              precision={2}
              style={{ width: '100%' }}
              addonAfter="ج.م"
              max={selectedInvoice
                ? Number(selectedInvoice.totalAmount) - Number(selectedInvoice.paidAmount)
                : undefined}
            />
          </Form.Item>
          <Form.Item name="paymentMethod" label="طريقة الدفع" rules={[{ required: true, message: 'مطلوب' }]}>
            <Select>
              <Option value="CASH">نقدي</Option>
              <Option value="BANK_TRANSFER">تحويل بنكي</Option>
              <Option value="CHEQUE">شيك</Option>
              <Option value="CARD">بطاقة بنكية</Option>
            </Select>
          </Form.Item>
          <Form.Item name="reference" label="مرجع الدفع">
            <Input placeholder="رقم الإيصال أو المرجع (اختياري)" />
          </Form.Item>
          <Form.Item name="notes" label="ملاحظات">
            <Input.TextArea rows={2} placeholder="ملاحظات اختيارية" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}