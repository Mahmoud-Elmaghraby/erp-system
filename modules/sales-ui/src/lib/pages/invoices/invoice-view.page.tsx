import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { salesApi } from '../../api/sales.api';
import { Button, Card, Col, Divider, Row, Space, Spin, Table, Tag, Typography } from 'antd';
import { PrinterOutlined, ArrowRightOutlined, DollarOutlined, CloseOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useEffect } from 'react';

const { Title, Text } = Typography;

const statusColors: Record<string, string> = {
  UNPAID: 'red', PAID: 'green', PARTIAL: 'orange', CANCELLED: 'default',
};
const statusLabels: Record<string, string> = {
  UNPAID: 'غير مدفوع', PAID: 'مدفوع', PARTIAL: 'جزئي', CANCELLED: 'ملغي',
};


export default function InvoiceViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: queryData, isLoading } = useQuery({
    queryKey: ['invoice', id],
    queryFn: () => salesApi.invoices.getById(id as string),
    enabled: !!id,
  });

  // Unwrap the data if the backend returns it in a data property
  const invoice = (queryData as any)?.data || queryData;

  useEffect(() => {
    if (invoice && invoice.id && new URLSearchParams(window.location.search).get('print') === 'true') {
      setTimeout(() => window.print(), 500);
    }
  }, [invoice]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!invoice || !invoice.id) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }} dir="rtl">
        <Title level={4}>الفاتورة غير موجودة</Title>
        <Button onClick={() => navigate('/sales/invoices')}>العودة للفواتير</Button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const columns: ColumnsType<any> = [
    {
      title: 'البند',
      key: 'item',
      render: (_, record) => record.product?.name || 'منتج غير معروف',
    },
    {
      title: 'الوصف',
      key: 'description',
      render: (_, record) => record.product?.description || '-',
    },
    {
      title: 'سعر الوحدة',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      align: 'right',
      render: (v) => `${Number(v || 0).toLocaleString()} ج.م`,
    },
    {
      title: 'الكمية',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
    },
    {
      title: 'المجموع',
      dataIndex: 'total',
      key: 'total',
      align: 'right',
      render: (v) => `${Number(v || 0).toLocaleString()} ج.م`,
    },
  ];

  return (
    <div className="invoice-page-wrapper" style={{ padding: '24px 16px', backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: "'Cairo', 'Tajawal', sans-serif" }} dir="rtl">
      {/* Action Bar (Hidden when printing) */}
      <div className="no-print" style={{ marginBottom: 16 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Button icon={<ArrowRightOutlined />} onClick={() => navigate('/sales/invoices')}>
              رجوع
            </Button>
          </Col>
          <Col>
            <Space>
              <Button type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>
                طباعة PDF
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      <div className="print-container">
        <Card
          className="invoice-print-card"
          bordered={false}
          style={{ maxWidth: 900, margin: '0 auto', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
          bodyStyle={{ padding: '40px' }}
        >
          {/* Status Tag */}
          <div style={{ marginBottom: 24, textAlign: 'left' }}>
            <Tag color={statusColors[invoice.status] || 'default'} style={{ fontSize: 14, padding: '4px 12px', borderRadius: 4 }}>
              {statusLabels[invoice.status] || invoice.status}
            </Tag>
          </div>

          {/* Header */}
          <Row justify="space-between" align="top" style={{ marginBottom: 40 }}>
            <Col span={12}>
              <Title level={2} style={{ margin: 0, fontWeight: 700 }}>فاتورة</Title>
            </Col>
            <Col span={12} style={{ textAlign: 'left' }}>
            {invoice.company?.logoUrl ? (
              <img src={invoice.company.logoUrl} alt="Company Logo" style={{ maxHeight: 60, maxWidth: 150, marginBottom: 8, objectFit: 'contain' }} />
            ) : (
              <div style={{ 
                width: 120, 
                height: 40, 
                backgroundColor: '#e6f7ff', 
                border: '1px dashed #91d5ff', 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: '#1890ff',
                fontWeight: 'bold',
                borderRadius: 4,
                marginBottom: 8
              }}>
                Logo Placeholder
              </div>
            )}
            <div>
              <Text strong style={{ fontSize: 16 }}>{invoice.company?.name || 'شركتي (My Company)'}</Text>
            </div>
            <div>
              <Text type="secondary">{invoice.company?.address || 'القاهرة، مصر'}</Text>
            </div>
            {(invoice.company?.commercialRegister || invoice.company?.taxNumber) ? (
              <>
                {invoice.company?.commercialRegister && (
                  <div><Text type="secondary">سجل تجاري: {invoice.company.commercialRegister}</Text></div>
                )}
                {invoice.company?.taxNumber && (
                  <div><Text type="secondary">بطاقة ضريبية: {invoice.company.taxNumber}</Text></div>
                )}
              </>
            ) : (
              <div>
                <Text type="secondary">سجل تجاري: 123456</Text>
              </div>
            )}
            </Col>
          </Row>

          {/* Invoice Info */}
          <Row justify="space-between" style={{ marginBottom: 40 }}>
            <Col span={12}>
              <Space direction="vertical" size={2}>
                <Text type="secondary">فاتورة لـ:</Text>
                <Text strong style={{ fontSize: 16 }}>{invoice.order?.customer?.name || 'عميل غير مسجل'}</Text>
                {invoice.order?.customer?.address && (
                  <Text>{invoice.order.customer.address}</Text>
                )}
                {(invoice.order?.customer?.taxRegNumber || invoice.order?.customer?.commercialReg) && (
                  <div style={{ marginTop: 4 }}>
                    {invoice.order?.customer?.taxRegNumber && (
                      <div><Text type="secondary" style={{ fontSize: 12 }}>بطاقة ضريبية: {invoice.order.customer.taxRegNumber}</Text></div>
                    )}
                    {invoice.order?.customer?.commercialReg && (
                      <div><Text type="secondary" style={{ fontSize: 12 }}>سجل تجاري: {invoice.order.customer.commercialReg}</Text></div>
                    )}
                  </div>
                )}
              </Space>
            </Col>
            <Col span={12} style={{ textAlign: 'left' }}>
              <Space direction="vertical" size={2}>
                <Text type="secondary">رقم الفاتورة: <Text strong style={{ color: '#000' }}>{invoice.invoiceNumber}</Text></Text>
                {invoice.dateTimeIssued && (
                  <Text type="secondary">تاريخ الفاتورة: <Text strong style={{ color: '#000' }}>{new Date(invoice.dateTimeIssued).toLocaleDateString('ar-EG')}</Text></Text>
                )}
                {invoice.dueDate && (
                  <Text type="secondary">تاريخ الاستحقاق: <Text strong style={{ color: '#000' }}>{new Date(invoice.dueDate).toLocaleDateString('ar-EG')}</Text></Text>
                )}
              </Space>
            </Col>
          </Row>

          {/* Items Table */}
          <Table
            dataSource={invoice.items || []}
            columns={columns}
            pagination={false}
            rowKey="id"
            style={{ marginBottom: 32 }}
            bordered
            size="small"
          />

          {/* Totals */}
          <Row justify="end">
            <Col xs={24} sm={12} md={8}>
              <div style={{ padding: '16px', backgroundColor: '#fafafa', borderRadius: '8px' }}>
                <Row justify="space-between" style={{ marginBottom: 8 }}>
                  <Text>المجموع:</Text>
                  <Text>{Number(invoice.untaxedAmount || 0).toLocaleString()} ج.م</Text>
                </Row>
                <Row justify="space-between" style={{ marginBottom: 8 }}>
                  <Text>الخصم:</Text>
                  <Text>{Number(invoice.discountAmount || 0).toLocaleString()} ج.م</Text>
                </Row>
                <Row justify="space-between" style={{ marginBottom: 8 }}>
                  <Text>الضريبة ({(invoice.taxAmount > 0 && invoice.untaxedAmount > 0) ? `${Math.round((Number(invoice.taxAmount) / Number(invoice.untaxedAmount)) * 100)}%` : '0%'}):</Text>
                  <Text>{Number(invoice.taxAmount || 0).toLocaleString()} ج.م</Text>
                </Row>
                <Divider style={{ margin: '12px 0' }} />
                <Row justify="space-between" style={{ marginBottom: 8 }}>
                  <Text strong style={{ fontSize: 16 }}>الإجمالي:</Text>
                  <Text strong style={{ fontSize: 16 }}>{Number(invoice.totalAmount || 0).toLocaleString()} ج.م</Text>
                </Row>
                <Row justify="space-between" style={{ marginBottom: 8 }}>
                  <Text style={{ color: '#389e0d' }}>مدفوعة:</Text>
                  <Text style={{ color: '#389e0d' }}>{Number(invoice.paidAmount || 0).toLocaleString()} ج.م</Text>
                </Row>
                <Divider style={{ margin: '12px 0' }} />
                <Row justify="space-between">
                  <Text strong style={{ color: '#cf1322' }}>المبلغ المستحق:</Text>
                  <Text strong style={{ color: '#cf1322' }}>{(Number(invoice.totalAmount || 0) - Number(invoice.paidAmount || 0)).toLocaleString()} ج.م</Text>
                </Row>
              </div>
            </Col>
          </Row>

        </Card>
      </div>

      <style>{`
        @media print {
          /* Force white background on the entire page */
          html, body, #root, .ant-layout, .ant-layout-content, .invoice-page-wrapper {
            background-color: #fff !important;
            background: #fff !important;
            height: auto !important;
            min-height: 0 !important;
          }
          
          /* Hide everything by default */
          body * {
            visibility: hidden;
          }
          
          /* Show only the print container and its contents */
          .print-container, .print-container * {
            visibility: visible;
          }
          
          /* Position print container at the top left */
          .print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* Remove padding and backgrounds from our own wrapper */
          .print-container > .ant-card {
            margin: 0 !important;
            padding: 20px !important; /* Give some breathing room since page margin is 0 */
            box-shadow: none !important;
          }

          /* Ensure colors print correctly */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Hide browser default header (date/title) and footer (URL/page numbers) */
          @page {
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
