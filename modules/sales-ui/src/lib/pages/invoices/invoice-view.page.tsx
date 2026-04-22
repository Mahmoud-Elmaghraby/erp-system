import { useParams, useNavigate } from 'react-router-dom';
import { Button, Spin, Typography, Space, Row, Col, Tag, Divider, Table } from 'antd';
import { ArrowRightOutlined, PrinterOutlined, EditOutlined, FilePdfOutlined, CreditCardOutlined } from '@ant-design/icons';
import { useInvoice } from '../../hooks/useInvoices';

const { Title, Text } = Typography;

export default function InvoiceViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: invoice, isLoading, error } = useInvoice(id || '');

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Title level={4}>لم يتم العثور على الفاتورة</Title>
        <Button onClick={() => navigate('/sales/invoices')}>العودة للفواتير</Button>
      </div>
    );
  }

  const items = invoice.items || invoice.order?.items || [];
  const customerName = invoice.customer?.name || invoice.order?.customer?.name || 'عميل نقدي';
  const invoiceDate = invoice.dateTimeIssued 
    ? new Date(invoice.dateTimeIssued).toLocaleDateString('ar-EG') 
    : new Date().toLocaleDateString('ar-EG');
    
  const subTotal = items.reduce((acc: number, item: any) => acc + (Number(item.totalPrice || (item.unitPrice * item.quantity)) || 0), 0);
  const totalAmount = Number(invoice.totalAmount || 0);
  const paidAmount = Number(invoice.paidAmount || 0);
  const dueAmount = totalAmount - paidAmount;
  const vatAmount = totalAmount - subTotal;

  const handlePrint = () => {
    window.print();
  };

  const columns = [
    {
      title: 'البند',
      dataIndex: ['product', 'name'],
      key: 'productName',
      render: (_: any, record: any) => record.product?.name || record.description || 'بند غير معروف',
    },
    {
      title: 'الوصف',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => text || '-',
    },
    {
      title: 'سعر الوحدة',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (val: any) => `${Number(val || 0).toFixed(2)} ج.م`,
    },
    {
      title: 'الكمية',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (val: any) => Number(val || 0),
    },
    {
      title: 'المجموع',
      key: 'total',
      render: (_: any, record: any) => `${(Number(record.unitPrice || 0) * Number(record.quantity || 0)).toFixed(2)} ج.م`,
    },
  ];

  return (
    <div style={{ padding: '24px 16px', backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: "'Cairo', 'Tajawal', sans-serif" }} dir="rtl" className="invoice-view-container">
      {/* Action Bar (Not printed) */}
      <div className="no-print" style={{ marginBottom: '24px' }}>
        <Row justify="space-between" align="middle" style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <Col>
            <Space>
              <Button icon={<ArrowRightOutlined />} onClick={() => navigate('/sales/invoices')}>
                العودة
              </Button>
              <Tag color={invoice.status === 'PAID' ? 'green' : invoice.status === 'UNPAID' ? 'red' : 'orange'} style={{ fontSize: '14px', padding: '4px 8px' }}>
                {invoice.status === 'PAID' ? 'مدفوعة' : invoice.status === 'UNPAID' ? 'غير مدفوعة' : invoice.status || 'مسودة'}
              </Tag>
              <Title level={5} style={{ margin: 0, paddingRight: '10px' }}>فاتورة #{invoice.invoiceNumber}</Title>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button icon={<EditOutlined />}>تعديل</Button>
              <Button icon={<FilePdfOutlined />}>PDF</Button>
              <Button type="primary" icon={<PrinterOutlined />} onClick={handlePrint} style={{ backgroundColor: '#001529' }}>
                طباعة
              </Button>
              {invoice.status !== 'PAID' && invoice.status !== 'CANCELLED' && (
                 <Button type="primary" icon={<CreditCardOutlined />} style={{ backgroundColor: '#52c41a' }}>
                  إضافة عملية دفع
                 </Button>
              )}
            </Space>
          </Col>
        </Row>
      </div>

      {/* A4 Paper Container */}
      <div 
        className="invoice-paper" 
        style={{ 
          maxWidth: '800px', 
          margin: '0 auto', 
          backgroundColor: '#fff', 
          padding: '40px', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          minHeight: '1000px'
        }}
      >
        <Row justify="space-between">
          <Col span={10}>
             <Title level={1} style={{ marginBottom: '40px' }}>فاتورة</Title>
             <div style={{ marginBottom: '8px' }}>
               <Text strong style={{ width: '100px', display: 'inline-block' }}>رقم الفاتورة</Text>
               <Text>{invoice.invoiceNumber || '---'}</Text>
             </div>
             <div>
               <Text strong style={{ width: '100px', display: 'inline-block' }}>تاريخ الفاتورة</Text>
               <Text>{invoiceDate}</Text>
             </div>
          </Col>
          <Col span={10} style={{ textAlign: 'left' }}>
             <Title level={4} style={{ margin: 0 }}>Lama</Title>
             <Text type="secondary" style={{ display: 'block' }}>Company Register: Lama</Text>
             <Text type="secondary" style={{ display: 'block' }}>Gamal Abd El Nasr Rd, Sidi Beshr</Text>
             <Text type="secondary" style={{ display: 'block' }}>Alexandria</Text>
          </Col>
        </Row>

        <Divider style={{ margin: '30px 0' }} />

        <Row justify="end" style={{ marginBottom: '30px', textAlign: 'left' }}>
          <Col span={10}>
            <Text strong style={{ display: 'block', marginBottom: '8px' }}>فاتورة لـ:</Text>
            <Title level={5} style={{ margin: 0 }}>{customerName}</Title>
          </Col>
        </Row>

        <Table
          dataSource={items}
          columns={columns}
          pagination={false}
          rowKey={record => record.id || Math.random().toString()}
          bordered
          style={{ marginBottom: '30px' }}
        />

        <Row justify="space-between">
          <Col span={12}></Col>
          <Col span={10}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <Text strong>المجموع:</Text>
              <Text>{subTotal.toFixed(2)} ج.م</Text>
            </div>
            {vatAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <Text strong>ضريبة (14%):</Text>
                <Text>{vatAmount.toFixed(2)} ج.م</Text>
              </div>
            )}
            <Divider style={{ margin: '10px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <Text strong style={{ fontSize: '18px' }}>الإجمالي:</Text>
              <Text strong style={{ fontSize: '18px' }}>{totalAmount.toFixed(2)} ج.م</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <Text strong>مدفوعة:</Text>
              <Text>{paidAmount.toFixed(2)} ج.م</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <Text strong>المبلغ المستحق:</Text>
              <Text strong style={{ color: dueAmount > 0 ? '#cf1322' : '#389e0d' }}>
                {dueAmount.toFixed(2)} ج.م
              </Text>
            </div>
          </Col>
        </Row>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          .invoice-view-container {
             background-color: transparent !important;
             padding: 0 !important;
          }
          .no-print, .no-print * {
            display: none !important;
          }
          .invoice-paper, .invoice-paper * {
            visibility: visible;
          }
          .invoice-paper {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background-color: white !important;
            box-shadow: none !important;
            padding: 0 !important;
          }
        }
      `}} />
    </div>
  );
}
