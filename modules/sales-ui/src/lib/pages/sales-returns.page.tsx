import { useState } from 'react';
import { Table, Tag, Button, Popconfirm, Space, Input, Select, Card, Typography, DatePicker, Row, Col, Empty, Tooltip } from 'antd';
import { CheckOutlined, SearchOutlined, CloseOutlined, EyeOutlined, PrinterOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useSalesReturns, useConfirmSalesReturn, useCancelSalesReturn } from '../hooks/useSalesReturns';
import dayjs from 'dayjs';

const { Option } = Select;
const { Title } = Typography;
const { RangePicker } = DatePicker;

const statusColors: Record<string, string> = {
  DRAFT: 'orange', // معلق
  CONFIRMED: 'green', // مقبول
  CANCELLED: 'red', // مرفوض
};
const statusLabels: Record<string, string> = {
  DRAFT: 'معلق', 
  CONFIRMED: 'مقبول', 
  CANCELLED: 'مرفوض',
};

export default function SalesReturnsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [warehouseFilter, setWarehouseFilter] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<any>(null);
  
  const { data: returns, isLoading } = useSalesReturns();
  const confirmReturn = useConfirmSalesReturn();
  const cancelReturn = useCancelSalesReturn();

  // تصفية البيانات
  const filtered = (returns as any[] ?? []).filter((r: any) => {
    const matchSearch = !search || 
      r.returnNumber?.toLowerCase().includes(search.toLowerCase()) ||
      r.customerName?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || r.status === statusFilter;
    const matchWarehouse = !warehouseFilter || r.warehouseId === warehouseFilter;
    
    let matchDate = true;
    if (dateRange && dateRange.length === 2 && r.createdAt) {
      const returnDate = dayjs(r.createdAt);
      matchDate = returnDate.isAfter(dateRange[0]) && returnDate.isBefore(dateRange[1].add(1, 'day'));
    }
    
    return matchSearch && matchStatus && matchWarehouse && matchDate;
  });

  const columns = [
    { 
      title: 'رقم المرتجع', 
      dataIndex: 'returnNumber', 
      key: 'returnNumber',
      render: (v: string) => <b style={{ color: '#1890ff' }}>{v}</b> 
    },
    { 
      title: 'العميل', 
      dataIndex: 'customerName', 
      key: 'customerName',
      render: (v: string) => v || <span style={{ color: '#999' }}>—</span>
    },
    { 
      title: 'رقم الفاتورة الأصلية', 
      dataIndex: 'invoiceNumber', 
      key: 'invoiceNumber',
      render: (v: string) => v || <Tag>بدون فاتورة</Tag>
    },
    {
      title: 'المبلغ الإجمالي', dataIndex: 'totalAmount', key: 'totalAmount',
      render: (v: number) => <span style={{ fontWeight: 'bold', color: '#001529' }}>{`${Number(v).toLocaleString()} ج.م`}</span>,
      align: 'right' as const,
    },
    {
      title: 'حالة المرتجع', dataIndex: 'status', key: 'status',
      render: (v: string) => <Tag color={statusColors[v] || 'default'} style={{ borderRadius: '4px', padding: '2px 8px' }}>{statusLabels[v] || v}</Tag>,
    },
    {
      title: 'تاريخ العملية', dataIndex: 'createdAt', key: 'createdAt',
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
          <Tooltip title="حذف">
            <Popconfirm title="هل أنت متأكد من حذف هذا المرتجع؟" onConfirm={() => cancelReturn.mutate(record.id)}>
              <Button type="text" danger icon={<DeleteOutlined />} size="small" />
            </Popconfirm>
          </Tooltip>
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
            <Title level={3} style={{ margin: 0, color: '#001529', fontWeight: 700 }}>المرتجعات</Title>
            <Typography.Text type="secondary">إدارة مرتجعات المبيعات ومتابعة حالتها</Typography.Text>
          </Col>
          <Col>
            <Button type="primary" size="large" icon={<PlusOutlined />} style={{ backgroundColor: '#001529', borderColor: '#001529', borderRadius: '8px', fontWeight: 'bold' }}>
              إضافة مرتجع جديد
            </Button>
          </Col>
        </Row>

        {/* Filters Section */}
        <div style={{ backgroundColor: '#fafafa', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8} lg={8}>
              <Input 
                prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />} 
                placeholder="بحث برقم المرتجع أو اسم العميل..."
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
                allowClear 
                size="large"
                style={{ borderRadius: '6px' }}
              />
            </Col>
            <Col xs={24} sm={12} md={5} lg={5}>
              <Select 
                placeholder="حالة المرتجع" 
                allowClear 
                style={{ width: '100%' }}
                size="large"
                onChange={(v) => setStatusFilter(v)}
              >
                <Option value="DRAFT">معلق</Option>
                <Option value="CONFIRMED">مقبول</Option>
                <Option value="CANCELLED">مرفوض</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={5} lg={5}>
              <Select 
                placeholder="المخزن المستلم" 
                allowClear 
                style={{ width: '100%' }}
                size="large"
                onChange={(v) => setWarehouseFilter(v)}
              >
                <Option value="WH-1">المخزن الرئيسي</Option>
                <Option value="WH-2">مخزن فرعي 1</Option>
                {/* سيتم جلب المخازن من الـ API */}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6} lg={6}>
              <RangePicker 
                style={{ width: '100%' }} 
                size="large" 
                placeholder={['تاريخ البدء', 'تاريخ الانتهاء']}
                onChange={(dates) => setDateRange(dates)}
                popupClassName="single-calendar-range" // Add custom class for styling
                panelRender={(panelNode) => (
                  <div className="custom-range-picker-panel">
                    {panelNode}
                  </div>
                )}
              />
            </Col>
          </Row>
        </div>

        {/* Data Table */}
        <Table 
          columns={columns} 
          dataSource={filtered} 
          loading={isLoading} 
          rowKey="id"
          scroll={{ x: 800 }} // لدعم التجاوب (Responsive) على الشاشات الصغيرة
          pagination={{ 
            pageSize: 10, 
            showTotal: (t) => `إجمالي: ${t} مرتجع`,
            position: ['bottomCenter'],
            showSizeChanger: true,
            className: 'custom-pagination'
          }}
          locale={{
            emptyText: (
              <Empty 
                image={Empty.PRESENTED_IMAGE_SIMPLE} 
                description={<span style={{ color: '#8c8c8c', fontSize: '16px' }}>لا توجد بيانات مرتجعات حتى الآن</span>}
              >
                <Button type="primary" onClick={() => {}} style={{ backgroundColor: '#001529', borderColor: '#001529' }}>إضافة أول مرتجع</Button>
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
        /* CSS hack to hide the second (right) calendar panel in RangePicker */
        .single-calendar-range .ant-picker-panels {
          display: block !important;
        }
        .single-calendar-range .ant-picker-panel:last-child {
          display: none !important;
        }
        /* Make the single calendar larger and more spacious */
        .single-calendar-range .ant-picker-panel-container,
        .single-calendar-range .ant-picker-panel,
        .single-calendar-range .ant-picker-date-panel {
          width: 460px !important;
          min-width: 460px !important;
        }
        .single-calendar-range .ant-picker-body {
          padding: 16px 24px !important;
        }
        .single-calendar-range .ant-picker-content {
          width: 100% !important;
          table-layout: fixed;
        }
        .single-calendar-range th {
          font-size: 15px !important;
          padding: 12px 0 !important;
        }
        .single-calendar-range td {
          padding: 8px 0 !important;
        }
        .single-calendar-range td .ant-picker-cell-inner {
          min-width: unset !important;
          width: 42px !important;
          height: 42px !important;
          line-height: 42px !important;
          margin: 0 auto;
          font-size: 16px !important;
          border-radius: 50% !important;
        }
      `}</style>
    </div>
  );
}