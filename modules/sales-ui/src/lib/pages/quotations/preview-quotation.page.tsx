import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { salesApi } from '../../api/sales.api';
import { Button, Card, Col, Divider, Row, Space, Spin, Table, Tag, Typography, Dropdown, message } from 'antd';
import type { MenuProps } from 'antd';
import { PrinterOutlined, ArrowRightOutlined, EditOutlined, SaveOutlined, DownOutlined, CloseOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useEffect } from 'react';
import { useUpdateQuotation, useSendQuotation } from '../../hooks/useQuotations';

const { Title, Text } = Typography;

const statusColors: Record<string, string> = {
  DRAFT: 'default', SENT: 'blue', CONFIRMED: 'green', CANCELLED: 'red', EXPIRED: 'orange',
};
const statusLabels: Record<string, string> = {
  DRAFT: 'مسودة', SENT: 'مرسل', CONFIRMED: 'مؤكد', CANCELLED: 'ملغي', EXPIRED: 'منتهي',
};

export default function PreviewQuotationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const updateMutation = useUpdateQuotation();
  const sendMutation = useSendQuotation();

  const { data: queryData, isLoading, refetch } = useQuery({
    queryKey: ['quotation', id],
    queryFn: () => salesApi.quotations.getById(id as string),
    enabled: !!id,
  });

  const quotation = (queryData as any)?.data || queryData;

  useEffect(() => {
    if (quotation && quotation.id && new URLSearchParams(window.location.search).get('print') === 'true') {
      setTimeout(() => window.print(), 500);
    }
  }, [quotation]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!quotation || !quotation.id) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }} dir="rtl">
        <Title level={4}>عرض السعر غير موجود</Title>
        <Button onClick={() => navigate('/sales/quotations')}>العودة لعروض الأسعار</Button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleSaveWithoutPrinting = () => {
    sendMutation.mutate(id!, {
        onSuccess: () => {
            message.success('تم الحفظ بنجاح');
            refetch();
        }
    });
  };

  const handleSaveAndPrint = () => {
    sendMutation.mutate(id!, {
        onSuccess: () => {
            message.success('تم الحفظ بنجاح');
            refetch();
            setTimeout(() => window.print(), 500);
        }
    });
  };

  const handleSaveAsDraft = () => {
    // Already in draft or we can just update status
    updateMutation.mutate({ id: id!, data: { status: 'DRAFT' } }, {
        onSuccess: () => {
            message.success('تم الحفظ كمسودة');
            refetch();
        }
    });
  };

  const saveMenu: MenuProps['items'] = [
    {
      key: '1',
      label: 'حفظ وطباعة',
      onClick: handleSaveAndPrint,
    },
  ];

  const columns: ColumnsType<any> = [
    {
      title: 'البند',
      key: 'item',
      render: (_, record) => record.product?.name || 'منتج غير معروف',
    },
    {
      title: 'الوصف',
      key: 'description',
      render: (_, record) => record.description || record.product?.description || '-',
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
    <div className="quotation-page-wrapper" style={{ padding: '24px 16px', backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: "'Cairo', 'Tajawal', sans-serif" }} dir="rtl">
      {/* Action Bar (Hidden when printing) */}
      <div className="no-print" style={{ marginBottom: 16 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
               <Button icon={<ArrowRightOutlined />} onClick={() => navigate('/sales/quotations')}>
                رجوع
              </Button>
              <Button onClick={handleSaveAsDraft} style={{ fontWeight: 600 }}>
                حفظ كمسودة
              </Button>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button 
                type="primary" 
                icon={<EditOutlined />} 
                onClick={() => navigate(`/sales/quotations/create?id=${id}`)}
                style={{ backgroundColor: '#1890ff' }}
              >
                تعديل
              </Button>
              <Dropdown.Button 
                type="primary" 
                menu={{ items: saveMenu }} 
                onClick={handleSaveWithoutPrinting}
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                className="green-save-button"
                icon={<DownOutlined />}
              >
                حفظ دون طباعة
              </Dropdown.Button>
            </Space>
          </Col>
        </Row>
      </div>

      <div className="print-container">
        <Card
          className="quotation-print-card"
          bordered={false}
          style={{ maxWidth: 900, margin: '0 auto', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
          bodyStyle={{ padding: '40px' }}
        >
          {/* Status Tag */}
          <div style={{ marginBottom: 24, textAlign: 'left' }}>
            <Tag color={statusColors[quotation.status] || 'default'} style={{ fontSize: 14, padding: '4px 12px', borderRadius: 4 }}>
              {statusLabels[quotation.status] || quotation.status}
            </Tag>
          </div>

          {/* Header */}
          <Row justify="space-between" align="top" style={{ marginBottom: 40 }}>
            <Col span={12}>
              <Title level={2} style={{ margin: 0, fontWeight: 700 }}>عروض الأسعار</Title>
            </Col>
            <Col span={12} style={{ textAlign: 'left' }}>
            {quotation.company?.logoUrl ? (
              <img src={quotation.company.logoUrl} alt="Company Logo" style={{ maxHeight: 60, maxWidth: 150, marginBottom: 8, objectFit: 'contain' }} />
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
              <Text strong style={{ fontSize: 16 }}>{quotation.company?.name || 'شركتي (My Company)'}</Text>
            </div>
            <div>
              <Text type="secondary">{quotation.company?.address || 'القاهرة، مصر'}</Text>
            </div>
            {(quotation.company?.commercialRegister || quotation.company?.taxNumber) ? (
              <>
                {quotation.company?.commercialRegister && (
                  <div><Text type="secondary">سجل تجاري: {quotation.company.commercialRegister}</Text></div>
                )}
                {quotation.company?.taxNumber && (
                  <div><Text type="secondary">بطاقة ضريبية: {quotation.company.taxNumber}</Text></div>
                )}
              </>
            ) : (
              <div>
                <Text type="secondary">سجل تجاري: 123456</Text>
              </div>
            )}
            </Col>
          </Row>

          {/* Quotation Info */}
          <Row justify="space-between" style={{ marginBottom: 40 }}>
            <Col span={12}>
              <Space direction="vertical" size={2}>
                <Text type="secondary">عرض السعر لـ:</Text>
                <Text strong style={{ fontSize: 16 }}>{quotation.customer?.name || 'عميل غير مسجل'}</Text>
                {quotation.customer?.address && (
                  <Text>{quotation.customer.address}</Text>
                )}
                {(quotation.customer?.taxRegNumber || quotation.customer?.commercialReg) && (
                  <div style={{ marginTop: 4 }}>
                    {quotation.customer?.taxRegNumber && (
                      <div><Text type="secondary" style={{ fontSize: 12 }}>بطاقة ضريبية: {quotation.customer.taxRegNumber}</Text></div>
                    )}
                    {quotation.customer?.commercialReg && (
                      <div><Text type="secondary" style={{ fontSize: 12 }}>سجل تجاري: {quotation.customer.commercialReg}</Text></div>
                    )}
                  </div>
                )}
              </Space>
            </Col>
            <Col span={12} style={{ textAlign: 'left' }}>
              <Space direction="vertical" size={2}>
                <Text type="secondary">عرض الأسعار #: <Text strong style={{ color: '#000' }}>{quotation.quotationNumber}</Text></Text>
                {quotation.createdAt && (
                  <Text type="secondary">تاريخ عرض الأسعار: <Text strong style={{ color: '#000' }}>{new Date(quotation.createdAt).toLocaleDateString('ar-EG')}</Text></Text>
                )}
                {quotation.validUntil && (
                  <Text type="secondary">تاريخ الانتهاء: <Text strong style={{ color: '#000' }}>{new Date(quotation.validUntil).toLocaleDateString('ar-EG')}</Text></Text>
                )}
              </Space>
            </Col>
          </Row>

          {/* Items Table */}
          <Table
            dataSource={quotation.items || []}
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
                  <Text>{Number(quotation.untaxedAmount || 0).toLocaleString()} ج.م</Text>
                </Row>
                <Row justify="space-between" style={{ marginBottom: 8 }}>
                  <Text>الخصم:</Text>
                  <Text>{Number(quotation.discountAmount || 0).toLocaleString()} ج.م</Text>
                </Row>
                <Row justify="space-between" style={{ marginBottom: 8 }}>
                  <Text>الضريبة:</Text>
                  <Text>{Number(quotation.taxAmount || 0).toLocaleString()} ج.م</Text>
                </Row>
                <Divider style={{ margin: '12px 0' }} />
                <Row justify="space-between">
                  <Text strong style={{ fontSize: 18 }}>الإجمالي:</Text>
                  <Text strong style={{ fontSize: 18, color: '#1890ff' }}>{Number(quotation.totalAmount || 0).toLocaleString()} ج.م</Text>
                </Row>
              </div>
            </Col>
          </Row>

        </Card>
      </div>

      <style>{`
        .green-save-button .ant-btn-primary {
            background-color: #52c41a !important;
            border-color: #52c41a !important;
        }
        .green-save-button .ant-btn-primary:hover {
            background-color: #73d13d !important;
            border-color: #73d13d !important;
        }
        @media print {
          html, body, #root, .ant-layout, .ant-layout-content, .quotation-page-wrapper {
            background-color: #fff !important;
            background: #fff !important;
            height: auto !important;
            min-height: 0 !important;
          }
          body * {
            visibility: hidden;
          }
          .print-container, .print-container * {
            visibility: visible;
          }
          .print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0 !important;
            padding: 0 !important;
          }
          .print-container > .ant-card {
            margin: 0 !important;
            padding: 20px !important;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @page {
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
