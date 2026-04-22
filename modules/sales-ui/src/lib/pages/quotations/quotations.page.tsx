import { useState } from 'react';
import { Table, Button, Modal, Input, Space, Popconfirm, Tag, Select, Typography, Card, Row, Col, Empty, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, CheckOutlined, DeleteOutlined, SearchOutlined, SendOutlined, CloseOutlined, EyeOutlined, PrinterOutlined } from '@ant-design/icons';
import { useQuotations, useConfirmQuotation, useDeleteQuotation, useSendQuotation, useCancelQuotation } from '../../hooks/useQuotations';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;
const { Title } = Typography;

interface CustomerRef {
  name?: string;
}

interface QuotationRow {
  id: string;
  quotationNumber?: string;
  customer?: CustomerRef;
  status?: string;
  totalAmount?: number | string;
  validUntil?: string;
}

const statusColors: Record<string, string> = {
  DRAFT: 'default', SENT: 'blue', CONFIRMED: 'green', CANCELLED: 'red', EXPIRED: 'orange',
};
const statusLabels: Record<string, string> = {
  DRAFT: 'مسودة', SENT: 'مرسل', CONFIRMED: 'مؤكد', CANCELLED: 'ملغي', EXPIRED: 'منتهي',
};

export default function QuotationsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const { data: quotations, isLoading } = useQuotations();

  const confirmQuotation = useConfirmQuotation();
  const sendQuotation = useSendQuotation();
  const cancelQuotation = useCancelQuotation();
  const deleteQuotation = useDeleteQuotation();

  const filtered = (((quotations as QuotationRow[] | undefined) ?? []).filter((q) => {
    const matchSearch = !search || q.quotationNumber?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || q.status === statusFilter;
    return matchSearch && matchStatus;
  }));

  const columns: ColumnsType<QuotationRow> = [
    { 
      title: 'الرقم', 
      dataIndex: 'quotationNumber', 
      key: 'quotationNumber',
      render: (v: string) => <b style={{ color: '#1890ff' }}>{v}</b> 
    },
    {
      title: 'العميل', dataIndex: 'customer', key: 'customer',
      render: (c: CustomerRef | undefined) => c?.name ?? <span style={{ color: '#999' }}>—</span>,
    },
    {
      title: 'الحالة', dataIndex: 'status', key: 'status',
      render: (v: string) => <Tag color={statusColors[v] || 'default'} style={{ borderRadius: '4px', padding: '2px 8px' }}>{statusLabels[v] || v}</Tag>,
    },
    {
      title: 'الإجمالي', dataIndex: 'totalAmount', key: 'totalAmount',
      render: (v: number) => <span style={{ fontWeight: 'bold', color: '#001529' }}>{`${Number(v).toLocaleString()} ج.م`}</span>,
      align: 'right' as const,
    },
    {
      title: 'صالح حتى', dataIndex: 'validUntil', key: 'validUntil',
      render: (v: string) => v ? new Date(v).toLocaleDateString('ar-EG') : '—',
    },
    {
      title: 'إجراءات', key: 'actions',
      render: (_: unknown, record: QuotationRow) => (
        <Space size="small">
          <Tooltip title="عرض">
            <Button type="text" icon={<EyeOutlined style={{ color: '#1890ff' }} />} size="small" />
          </Tooltip>
          <Tooltip title="طباعة PDF">
            <Button type="text" icon={<PrinterOutlined style={{ color: '#595959' }} />} size="small" />
          </Tooltip>
          {record.status === 'DRAFT' && (
            <Tooltip title="إرسال">
              <Popconfirm title="إرسال عرض السعر للعميل؟" onConfirm={() => sendQuotation.mutate(record.id)}>
                <Button type="text" icon={<SendOutlined style={{ color: '#2f54eb' }} />} size="small" />
              </Popconfirm>
            </Tooltip>
          )}
          {(record.status === 'DRAFT' || record.status === 'SENT') && (
            <Tooltip title="تأكيد">
              <Popconfirm title="تأكيد وتحويل لأمر بيع؟"
                onConfirm={() => {
                  if (record.validUntil && new Date(record.validUntil) < new Date()) {
                    Modal.error({ title: 'عرض السعر منتهي', content: 'عفواً، لقد انتهت صلاحية عرض السعر ولا يمكن تأكيده.' });
                    return;
                  }
                  confirmQuotation.mutate(record.id);
                }}>
                <Button type="text" icon={<CheckOutlined style={{ color: '#52c41a' }} />} size="small" />
              </Popconfirm>
            </Tooltip>
          )}
          {(record.status === 'DRAFT' || record.status === 'SENT') && (
            <Tooltip title="إلغاء">
              <Popconfirm title="إلغاء عرض السعر؟" onConfirm={() => cancelQuotation.mutate(record.id)}>
                <Button type="text" icon={<CloseOutlined style={{ color: '#faad14' }} />} size="small" />
              </Popconfirm>
            </Tooltip>
          )}
          {record.status === 'DRAFT' && (
            <Tooltip title="حذف">
              <Popconfirm title="حذف عرض السعر؟" onConfirm={() => deleteQuotation.mutate(record.id)}>
                <Button type="text" danger icon={<DeleteOutlined />} size="small" />
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
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Title level={3} style={{ margin: 0, color: '#001529', fontWeight: 700 }}>عروض الأسعار</Title>
            <Typography.Text type="secondary">إدارة عروض الأسعار ومتابعة حالتها مع العملاء</Typography.Text>
          </Col>
          <Col>
            <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => navigate('/sales/quotations/create')} style={{ backgroundColor: '#001529', borderColor: '#001529', borderRadius: '8px', fontWeight: 'bold' }}>
              عرض سعر جديد
            </Button>
          </Col>
        </Row>

        <div style={{ backgroundColor: '#fafafa', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={10} lg={10}>
              <Input 
                prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />} 
                placeholder="بحث برقم العرض..."
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
                allowClear 
                size="large"
                style={{ borderRadius: '6px' }} 
              />
            </Col>
            <Col xs={24} sm={12} md={6} lg={6}>
              <Select 
                placeholder="فلتر بالحالة" 
                allowClear 
                style={{ width: '100%' }}
                size="large"
                onChange={(v) => setStatusFilter(v)}
              >
                <Option value="DRAFT">مسودة</Option>
                <Option value="SENT">مرسل</Option>
                <Option value="CONFIRMED">مؤكد</Option>
                <Option value="CANCELLED">ملغي</Option>
                <Option value="EXPIRED">منتهي</Option>
              </Select>
            </Col>
          </Row>
        </div>

        <Table 
          columns={columns} 
          dataSource={filtered} 
          loading={isLoading} 
          rowKey="id"
          scroll={{ x: 800 }}
          pagination={{ 
            pageSize: 10, 
            showTotal: (t) => `إجمالي: ${t} عرض`,
            position: ['bottomCenter'],
            showSizeChanger: true,
            className: 'custom-pagination'
          }}
          locale={{
            emptyText: (
              <Empty 
                image={Empty.PRESENTED_IMAGE_SIMPLE} 
                description={<span style={{ color: '#8c8c8c', fontSize: '16px' }}>لا توجد بيانات عروض أسعار حتى الآن</span>}
              >
                <Button type="primary" onClick={() => navigate('/sales/quotations/create')} style={{ backgroundColor: '#001529', borderColor: '#001529' }}>إضافة أول عرض سعر</Button>
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
    </div>
  );
}