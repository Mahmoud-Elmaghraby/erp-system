import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Col, Divider, Row, Space, Spin, Table, Typography, Empty } from 'antd';
import { ArrowRightOutlined, PrinterOutlined, FilePdfOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useEffect } from 'react';
import { useCustomerAccountStatement, type AccountMovement } from '../../hooks/useCustomerAccountStatement';

const { Title, Text } = Typography;

export default function CustomerAccountStatementPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: statementData, isLoading } = useCustomerAccountStatement(id as string);
  const statement = (statementData as any)?.data || statementData;

  useEffect(() => {
    if (statement && statement.id && new URLSearchParams(window.location.search).get('print') === 'true') {
      setTimeout(() => window.print(), 500);
    }
  }, [statement]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    const element = document.getElementById('account-statement-content');
    if (!element) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <meta charset="utf-8">
        <title>كشف حساب - ${statement?.name || 'عميل'}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Cairo', 'Tajawal', Arial, sans-serif; font-size: 12px; line-height: 1.5; }
          .container { max-width: 900px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 15px; }
          .header h1 { font-size: 24px; margin-bottom: 5px; }
          .header p { color: #666; }
          .customer-info { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
          .info-group { border: 1px solid #ddd; padding: 15px; border-radius: 4px; }
          .info-group strong { color: #001529; display: block; margin-bottom: 5px; }
          .info-group span { color: #666; }
          .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 30px; }
          .summary-item { background: #f5f5f5; padding: 15px; border-radius: 4px; border-left: 4px solid #1890ff; text-align: center; }
          .summary-item .label { font-size: 12px; color: #666; margin-bottom: 5px; }
          .summary-item .value { font-size: 18px; font-weight: bold; color: #001529; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th { background: #001529; color: white; padding: 10px; text-align: right; font-weight: bold; }
          td { padding: 10px; border-bottom: 1px solid #ddd; text-align: right; }
          tr:nth-child(even) { background: #f9f9f9; }
          .total-row { background: #f0f0f0; font-weight: bold; }
          .footer { margin-top: 30px; text-align: center; color: #999; font-size: 11px; }
          @media print {
            body { background: white; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        ${element.innerHTML}
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!statement || !statement.id) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }} dir="rtl">
        <Title level={4}>كشف الحساب غير موجود</Title>
        <Button onClick={() => navigate('/sales/customers')}>العودة للعملاء</Button>
      </div>
    );
  }

  const columns: ColumnsType<AccountMovement> = [
    {
      title: 'التاريخ',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => new Date(date).toLocaleDateString('ar-EG'),
      width: 100,
    },
    {
      title: 'البيان',
      dataIndex: 'reference',
      key: 'reference',
      render: (v: string) => v || '—',
    },
    {
      title: 'الوصف',
      dataIndex: 'description',
      key: 'description',
      render: (v: string) => v || '—',
    },
    {
      title: 'مدين (ج.م)',
      dataIndex: 'debit',
      key: 'debit',
      align: 'right' as const,
      render: (v: number) => `${Number(v || 0).toLocaleString('ar-EG')}`,
      width: 100,
    },
    {
      title: 'دائن (ج.م)',
      dataIndex: 'credit',
      key: 'credit',
      align: 'right' as const,
      render: (v: number) => `${Number(v || 0).toLocaleString('ar-EG')}`,
      width: 100,
    },
    {
      title: 'الرصيد (ج.م)',
      dataIndex: 'balance',
      key: 'balance',
      align: 'right' as const,
      render: (v: number) => (
        <span style={{ color: v > 0 ? '#52c41a' : '#f5222d', fontWeight: 'bold' }}>
          {Number(v || 0).toLocaleString('ar-EG')}
        </span>
      ),
      width: 120,
    },
  ];

  return (
    <div
      style={{
        padding: '24px 16px',
        backgroundColor: '#f0f2f5',
        minHeight: '100vh',
        fontFamily: "'Cairo', 'Tajawal', sans-serif",
      }}
      dir="rtl"
    >
      {/* Action Bar (Hidden when printing) */}
      <div className="no-print" style={{ marginBottom: 16 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Button icon={<ArrowRightOutlined />} onClick={() => navigate('/sales/customers')}>
              رجوع
            </Button>
          </Col>
          <Col>
            <Space>
              <Button
                type="primary"
                icon={<PrinterOutlined />}
                onClick={handlePrint}
                style={{ backgroundColor: '#001529', borderColor: '#001529' }}
              >
                طباعة
              </Button>
              <Button
                type="default"
                icon={<FilePdfOutlined />}
                onClick={handleExportPDF}
              >
                تحميل PDF
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* Main Content */}
      <Card
        bordered={false}
        style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
        bodyStyle={{ padding: '24px' }}
      >
        <div id="account-statement-content">
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 32, paddingBottom: 16, borderBottom: '2px solid #ddd' }}>
            <Title level={2} style={{ margin: '0 0 8px 0', color: '#001529' }}>
              كشف حساب العميل
            </Title>
            <Text type="secondary">Account Statement</Text>
            <div style={{ marginTop: 8, color: '#999', fontSize: 12 }}>
              كما في {new Date(statement?.asOfDate || new Date()).toLocaleDateString('ar-EG')}
            </div>
          </div>

          {/* Customer Info Section */}
          <div style={{ marginBottom: 32 }}>
            <Title level={4} style={{ marginBottom: 16, color: '#001529' }}>
              بيانات العميل
            </Title>
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={12} md={6}>
                <div style={{ padding: '12px', backgroundColor: '#f5f5f5', borderRadius: 4 }}>
                  <Text strong style={{ display: 'block', marginBottom: 4, color: '#001529' }}>
                    اسم العميل
                  </Text>
                  <Text type="secondary">{statement?.name || '—'}</Text>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div style={{ padding: '12px', backgroundColor: '#f5f5f5', borderRadius: 4 }}>
                  <Text strong style={{ display: 'block', marginBottom: 4, color: '#001529' }}>
                    رقم العميل
                  </Text>
                  <Text type="secondary">{statement?.code || '—'}</Text>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div style={{ padding: '12px', backgroundColor: '#f5f5f5', borderRadius: 4 }}>
                  <Text strong style={{ display: 'block', marginBottom: 4, color: '#001529' }}>
                    البريد الإلكتروني
                  </Text>
                  <Text type="secondary">{statement?.email || '—'}</Text>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div style={{ padding: '12px', backgroundColor: '#f5f5f5', borderRadius: 4 }}>
                  <Text strong style={{ display: 'block', marginBottom: 4, color: '#001529' }}>
                    الهاتف
                  </Text>
                  <Text type="secondary">{statement?.phone || '—'}</Text>
                </div>
              </Col>
              {statement?.address && (
                <Col xs={24}>
                  <div style={{ padding: '12px', backgroundColor: '#f5f5f5', borderRadius: 4 }}>
                    <Text strong style={{ display: 'block', marginBottom: 4, color: '#001529' }}>
                      العنوان
                    </Text>
                    <Text type="secondary">{statement.address}</Text>
                  </div>
                </Col>
              )}
            </Row>
          </div>

          <Divider />

          {/* Account Summary */}
          <div style={{ marginBottom: 32 }}>
            <Title level={4} style={{ marginBottom: 16, color: '#001529' }}>
              ملخص الحساب
            </Title>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Card
                  bordered={false}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderRadius: 8,
                  }}
                  bodyStyle={{ padding: '16px', textAlign: 'center' }}
                >
                  <div style={{ fontSize: 12, marginBottom: 8, opacity: 0.9 }}>
                    الرصيد الافتتاحي
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 'bold' }}>
                    {Number(statement?.openingBalance || 0).toLocaleString('ar-EG')}
                  </div>
                  <div style={{ fontSize: 11, marginTop: 4, opacity: 0.8 }}>ج.م</div>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card
                  bordered={false}
                  style={{
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: 'white',
                    borderRadius: 8,
                  }}
                  bodyStyle={{ padding: '16px', textAlign: 'center' }}
                >
                  <div style={{ fontSize: 12, marginBottom: 8, opacity: 0.9 }}>
                    إجمالي المديون
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 'bold' }}>
                    {Number(statement?.totalDebit || 0).toLocaleString('ar-EG')}
                  </div>
                  <div style={{ fontSize: 11, marginTop: 4, opacity: 0.8 }}>ج.م</div>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card
                  bordered={false}
                  style={{
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    color: 'white',
                    borderRadius: 8,
                  }}
                  bodyStyle={{ padding: '16px', textAlign: 'center' }}
                >
                  <div style={{ fontSize: 12, marginBottom: 8, opacity: 0.9 }}>
                    إجمالي الدائن
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 'bold' }}>
                    {Number(statement?.totalCredit || 0).toLocaleString('ar-EG')}
                  </div>
                  <div style={{ fontSize: 11, marginTop: 4, opacity: 0.8 }}>ج.م</div>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card
                  bordered={false}
                  style={{
                    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                    color: 'white',
                    borderRadius: 8,
                  }}
                  bodyStyle={{ padding: '16px', textAlign: 'center' }}
                >
                  <div style={{ fontSize: 12, marginBottom: 8, opacity: 0.9 }}>
                    الرصيد الختامي
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 'bold' }}>
                    {Number(statement?.closingBalance || 0).toLocaleString('ar-EG')}
                  </div>
                  <div style={{ fontSize: 11, marginTop: 4, opacity: 0.8 }}>ج.م</div>
                </Card>
              </Col>
            </Row>
          </div>

          <Divider />

          {/* Transactions Table */}
          <div>
            <Title level={4} style={{ marginBottom: 16, color: '#001529' }}>
              حركات الحساب
            </Title>
            {statement?.movements && statement.movements.length > 0 ? (
              <Table
                columns={columns}
                dataSource={statement.movements}
                rowKey="id"
                pagination={{
                  pageSize: 15,
                  showTotal: (total) => `إجمالي: ${total} حركة`,
                  position: ['bottomCenter'],
                  showSizeChanger: true,
                }}
                scroll={{ x: 1200 }}
                locale={{
                  emptyText: <Empty description="لا توجد حركات" />,
                }}
              />
            ) : (
              <Empty description="لا توجد حركات حتى الآن" />
            )}
          </div>

          {/* Footer */}
          <div style={{ marginTop: 40, textAlign: 'center', color: '#999', fontSize: 12 }}>
            <Divider />
            <Text type="secondary">
              تم إنشاء هذا التقرير بواسطة نظام إدارة المبيعات
            </Text>
          </div>
        </div>
      </Card>
    </div>
  );
}
