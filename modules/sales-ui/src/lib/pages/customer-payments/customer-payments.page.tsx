import { useState } from 'react';
import { Card, Table, Button, Input, Select, Row, Col, Space, Typography, Modal, Form, InputNumber, Radio, message, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { PlusOutlined, SearchOutlined, PrinterOutlined, EllipsisOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

interface Payment {
  key: string;
  receiptNumber: string;
  customerName: string;
  amount: number;
  paymentMethod: string;
  date: string;
  linkedInvoice: string;
}

const mockPayments: Payment[] = [
  {
    key: '1',
    receiptNumber: 'RCP-0001',
    customerName: 'شركة الأمل',
    amount: 1500,
    paymentMethod: 'كاش',
    date: '2026-04-19',
    linkedInvoice: 'INV-0010',
  },
  {
    key: '2',
    receiptNumber: 'RCP-0002',
    customerName: 'مؤسسة النور',
    amount: 3200,
    paymentMethod: 'تحويل بنكي',
    date: '2026-04-18',
    linkedInvoice: 'INV-0008',
  },
];

const mockUnpaidInvoices: Record<string, { id: string; amount: number; remaining: number }[]> = {
  'c1': [{ id: 'INV-0010', amount: 5000, remaining: 3500 }, { id: 'INV-0012', amount: 1200, remaining: 1200 }],
  'c2': [{ id: 'INV-0008', amount: 4000, remaining: 800 }],
};

export default function CustomerPaymentsPage() {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [payments, setPayments] = useState<Payment[]>(mockPayments);

  const columns = [
    { title: 'رقم السند', dataIndex: 'receiptNumber', key: 'receiptNumber' },
    { title: 'اسم العميل', dataIndex: 'customerName', key: 'customerName' },
    { title: 'المبلغ', dataIndex: 'amount', key: 'amount', render: (val: number) => `${val.toFixed(2)} ج.م` },
    { title: 'طريقة الدفع', dataIndex: 'paymentMethod', key: 'paymentMethod' },
    { title: 'التاريخ', dataIndex: 'date', key: 'date' },
    { title: 'الفاتورة المرتبطة', dataIndex: 'linkedInvoice', key: 'linkedInvoice' },
    {
      title: 'الإجراءات',
      key: 'actions',
      render: (_: any, record: Payment) => (
        <Space>
          <Button 
            type="text" 
            icon={<PrinterOutlined />} 
            onClick={() => handlePrint(record)}
            style={{ color: '#001529' }}
            title="طباعة إيصال"
          />
        </Space>
      ),
    },
  ];

  const handlePrint = (record: Payment) => {
    message.success(`جاري طباعة إيصال استلام نقدية للسند ${record.receiptNumber}...`);
    // Logic for printing the receipt can go here (e.g. generate PDF or window.print)
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setSelectedCustomer(null);
  };

  const handleAddPayment = (values: any) => {
    const newPayment: Payment = {
      key: Date.now().toString(),
      receiptNumber: `RCP-000${payments.length + 1}`,
      customerName: values.customerId === 'c1' ? 'شركة الأمل' : 'مؤسسة النور',
      amount: values.amount,
      paymentMethod: values.paymentMethod,
      date: new Date().toISOString().split('T')[0],
      linkedInvoice: values.invoiceId || 'دفعة مقدمة',
    };
    setPayments([newPayment, ...payments]);
    message.success('تم تسجيل الدفعة بنجاح');
    handleCancel();
  };

  const handleCustomerChange = (value: string) => {
    setSelectedCustomer(value);
    form.setFieldsValue({ invoiceId: undefined }); // Reset invoice selection when customer changes
  };

  const unpaidInvoicesOptions = selectedCustomer ? mockUnpaidInvoices[selectedCustomer] : [];

  return (
    <div style={{ padding: '24px 16px', backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: "'Cairo', 'Tajawal', sans-serif" }} dir="rtl">
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0, color: '#001529', fontWeight: 700 }}>مدفوعات العملاء</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ backgroundColor: '#001529', borderColor: '#001529', fontWeight: 600 }}
          onClick={showModal}
        >
          سند قبض جديد
        </Button>
      </div>

      <Card bordered={false} style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={8}>
            <Input placeholder="بحث برقم السند، العميل..." prefix={<SearchOutlined />} />
          </Col>
        </Row>
      </Card>

      <Card bordered={false} style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Table
          columns={columns}
          dataSource={payments}
          locale={{ emptyText: 'لا توجد مدفوعات' }}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={<span style={{ color: '#001529', fontSize: '18px' }}>تسجيل دفعة جديدة (سند قبض)</span>}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleAddPayment} initialValues={{ paymentMethod: 'كاش' }}>
          <Form.Item label="العميل" name="customerId" rules={[{ required: true, message: 'يرجى اختيار العميل' }]}>
            <Select 
              showSearch 
              placeholder="اختر العميل" 
              onChange={handleCustomerChange}
              filterOption={(input, option) =>
                (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
              }
            >
              <Option value="c1">شركة الأمل</Option>
              <Option value="c2">مؤسسة النور</Option>
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="المبلغ" name="amount" rules={[{ required: true, message: 'يرجى إدخال المبلغ' }]}>
                <InputNumber min={1} style={{ width: '100%' }} placeholder="0.00" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="طريقة الدفع" name="paymentMethod" rules={[{ required: true }]}>
                <Radio.Group style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                  <Radio value="كاش">كاش</Radio>
                  <Radio value="تحويل بنكي">بنك</Radio>
                  <Radio value="فيزا">فيزا</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          {/* Invoice selection only appears if the customer has unpaid invoices */}
          <Form.Item label="الفاتورة المرتبطة (اختياري)" name="invoiceId">
            <Select placeholder="اختر الفاتورة المراد سدادها" disabled={!selectedCustomer || unpaidInvoicesOptions?.length === 0} allowClear>
              {unpaidInvoicesOptions?.map((inv) => (
                <Option key={inv.id} value={inv.id}>
                  {inv.id} - المتبقي: {inv.remaining} ج.م
                </Option>
              ))}
            </Select>
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24, gap: 8 }}>
            <Button onClick={handleCancel}>إلغاء</Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: '#001529', borderColor: '#001529' }}>
              حفظ وطباعة إيصال
            </Button>
          </div>
        </Form>
      </Modal>

    </div>
  );
}
