import { useState } from 'react';
import { Table, Tag, Button, Modal, Form, InputNumber, Select, Space, Input, Popconfirm, Card, Typography, Row, Col, Empty, Tooltip } from 'antd';
import { SearchOutlined, CloseOutlined, PlusOutlined, EyeOutlined, PrinterOutlined, DollarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useInvoices, usePayInvoice, useCancelInvoice } from '../../hooks/useInvoices';

const { Option } = Select;
const { Title } = Typography;

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
    { 
      title: 'رقم الفاتورة', 
      dataIndex: 'invoiceNumber', 
      key: 'invoiceNumber',
      render: (v: string) => <b style={{ color: '#1890ff' }}>{v}</b> 
    },
    {
      title: 'العميل',
      key: 'customerName',
      render: (_: any, r: any) => r.order?.customer?.name || r.customer?.name || <span style={{ color: '#999' }}>—</span>,
    },
    {
      title: 'الحالة', dataIndex: 'derivedStatus', key: 'status',
      render: (v: string) => <Tag color={statusColors[v] ?? 'default'} style={{ borderRadius: '4px', padding: '2px 8px' }}>{statusLabels[v] ?? v}</Tag>,
    },
    {
      title: 'الإجمالي', dataIndex: 'totalAmount', key: 'totalAmount',
      render: (v: number) => <span style={{ fontWeight: 'bold', color: '#001529' }}>{`${Number(v).toLocaleString()} ج.م`}</span>,
      align: 'right' as const,
    },
    {
      title: 'المدفوع', dataIndex: 'paidAmount', key: 'paidAmount',
      render: (v: number) => `${Number(v).toLocaleString()} ج.م`,
      align: 'right' as const,
    },
    {
      title: 'المتبقي', key: 'remaining',
      render: (_: any, r: any) => (
        <span style={{ fontWeight: 'bold', color: Number(r.totalAmount) > Number(r.paidAmount) ? '#cf1322' : '#389e0d' }}>
          {(Number(r.totalAmount) - Number(r.paidAmount)).toLocaleString()} ج.م
        </span>
      ),
      align: 'right' as const,
    },
    {
      title: 'تاريخ الإصدار', dataIndex: 'dateTimeIssued', key: 'dateTimeIssued',
      render: (v: string) => new Date(v).toLocaleDateString('ar-EG'),
    },
    {
      title: 'الإجراءات', key: 'actions',
      render: (_: any, record: any) => (
        <Space size="small">
          <Tooltip title="عرض">
            <Button type="text" icon={<EyeOutlined style={{ color: '#1890ff' }} />} size="small" />
          </Tooltip>
          <Tooltip title="طباعة PDF">
            <Button type="text" icon={<PrinterOutlined style={{ color: '#595959' }} />} size="small" />
          </Tooltip>
          {record.status !== 'PAID' && record.status !== 'CANCELLED' && (
            <Tooltip title="تسجيل دفع">
              <Button type="text" icon={<DollarOutlined style={{ color: '#52c41a' }} />} size="small"
                onClick={() => { setSelectedInvoice(record); setPayOpen(true); }} />
            </Tooltip>
          )}
          {record.status !== 'PAID' && record.status !== 'CANCELLED' && (
            <Tooltip title="إلغاء الفاتورة">
              <Popconfirm title="إلغاء الفاتورة؟" onConfirm={() => cancelInvoice.mutate(record.id)}>
                <Button type="text" danger icon={<CloseOutlined />} size="small" />
              </Popconfirm>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px 16px', backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: "'Cairo', 'Tajawal', sans-serif" }} dir="rtl">
      <Card 
        bordered={false} 
        style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
        bodyStyle={{ padding: '24px' }}
      >
        {/* Header Section */}
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Title level={3} style={{ margin: 0, color: '#001529', fontWeight: 700 }}>الفواتير</Title>
            <Typography.Text type="secondary">إدارة الفواتير وتسجيل المدفوعات السابقة والقادمة</Typography.Text>
          </Col>
          <Col>
            <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => navigate('/sales/invoices/create')} style={{ backgroundColor: '#001529', borderColor: '#001529', borderRadius: '8px', fontWeight: 'bold' }}>
              فاتورة جديدة
            </Button>
          </Col>
        </Row>

        {/* Filters Section */}
        <div style={{ backgroundColor: '#fafafa', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={10} lg={10}>
              <Input
                prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="بحث برقم الفاتورة أو العميل..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                allowClear
                size="large"
                style={{ borderRadius: '6px' }}
              />
            </Col>
            <Col xs={24} sm={12} md={6} lg={6}>
              <Select 
                placeholder="حالة الفاتورة" 
                allowClear 
                style={{ width: '100%' }}
                size="large"
                onChange={(v) => setStatusFilter(v)}
              >
                <Option value="OVERPAID">مدفوع بالزيادة</Option>
                <Option value="DRAFT">مسودة</Option>
                <Option value="UNPAID">غير مدفوعة</Option>
                <Option value="DUE">مستحقة الدفع</Option>
                <Option value="OVERDUE">متأخر</Option>
                <Option value="PARTIAL">جزئي</Option>
                <Option value="PAID">مدفوع</Option>
                <Option value="CANCELLED">ملغي</Option>
              </Select>
            </Col>
          </Row>
        </div>

        {/* Data Table */}
        <Table
          columns={columns}
          dataSource={filtered}
          loading={isLoading}
          rowKey="id"
          scroll={{ x: 800 }}
          pagination={{ 
            pageSize: 10, 
            showTotal: (t) => `إجمالي: ${t} فاتورة`,
            position: ['bottomCenter'],
            showSizeChanger: true,
            className: 'custom-pagination'
          }}
          locale={{
            emptyText: (
              <Empty 
                image={Empty.PRESENTED_IMAGE_SIMPLE} 
                description={<span style={{ color: '#8c8c8c', fontSize: '16px' }}>لا توجد بيانات فواتير حتى الآن</span>}
              >
                <Button type="primary" onClick={() => navigate('/sales/invoices/create')} style={{ backgroundColor: '#001529', borderColor: '#001529' }}>إضافة أول فاتورة</Button>
              </Empty>
            )
          }}
          rowClassName={() => 'table-row-hover'}
        />
      </Card>

      <style>{`
        .table-row-hover:hover > td {
          background-color: #f0f7ff !important;
          transition: background-color 0.3s;
        }
        .custom-pagination .ant-pagination-item-active {
          border-color: #001529;
          font-weight: bold;
        }
        .custom-pagination .ant-pagination-item-active a {
          color: #001529;
        }
      `}</style>

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