import { useState } from 'react';
import { Table, Button, Modal, Space, Input, Card, Typography, Row, Col, Empty, Tooltip, Popconfirm, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { FileTextOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useCustomers, useDeleteCustomer } from '../../hooks/useCustomers';

const { Title } = Typography;

interface Customer {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  status?: string;
  createdAt?: string;
}

export default function CustomersPage() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const { data: customers, isLoading } = useCustomers();
  const deleteCustomer = useDeleteCustomer();

  const filtered = ((customers as Customer[] | undefined) ?? []).filter((c) => {
    const searchLower = search.toLowerCase();
    return !search || 
      c.name?.toLowerCase().includes(searchLower) ||
      c.email?.toLowerCase().includes(searchLower) ||
      c.phone?.toLowerCase().includes(searchLower);
  });

  const columns: ColumnsType<Customer> = [
      {
        title: 'رقم العميل',
        dataIndex: 'code',
        key: 'code',
        render: (v: string) => v || <span style={{ color: '#999' }}>—</span>,
      },
    { 
      title: 'اسم العميل', 
      dataIndex: 'name', 
      key: 'name',
      render: (v: string) => <b style={{ color: '#1890ff' }}>{v}</b> 
    },
    {
      title: 'الهاتف',
      dataIndex: 'phone',
      key: 'phone',
      render: (v: string) => v || <span style={{ color: '#999' }}>—</span>,
    },
    {
      title: 'الحالة',
      dataIndex: 'status',
      key: 'status',
      render: (v: string) => {
        const statusLabels: Record<string, string> = {
          'active': 'نشط',
          'inactive': 'غير نشط',
        };
        const colors: Record<string, string> = {
          'active': 'green',
          'inactive': 'default',
        };
        return <Tag color={colors[v] ?? 'default'} style={{ borderRadius: '4px', padding: '2px 8px' }}>{statusLabels[v] ?? v}</Tag>;
      },
    },
    {
      title: 'الإجراءات',
      key: 'actions',
      render: (_: unknown, record: Customer) => (
        <Space size="small">
          <Tooltip title="عرض">
            <Button type="text" icon={<EyeOutlined style={{ color: '#1890ff' }} />} size="small" onClick={() => navigate(`/sales/customers/${record.id}`)} />
          </Tooltip>
            <Tooltip title="كشف حساب">
              <Button type="text" icon={<FileTextOutlined style={{ color: '#722ed1' }} />} size="small" onClick={() => navigate(`/sales/customers/${record.id}/account-statement`)} />
            </Tooltip>
          <Tooltip title="تعديل">
            <Button type="text" icon={<EditOutlined style={{ color: '#faad14' }} />} size="small" onClick={() => navigate(`/sales/customers/${record.id}/edit`)} />
          </Tooltip>
          <Tooltip title="حذف">
            <Popconfirm title="حذف العميل؟" description="هل أنت متأكد من حذف هذا العميل؟" onConfirm={() => deleteCustomer.mutate(record.id)}>
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
            <Title level={3} style={{ margin: 0, color: '#001529', fontWeight: 700 }}>العملاء</Title>
            <Typography.Text type="secondary">إدارة قائمة العملاء والعلاقات معهم</Typography.Text>
          </Col>
          <Col>
            <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => navigate('/sales/customers/create')} style={{ backgroundColor: '#001529', borderColor: '#001529', borderRadius: '8px', fontWeight: 'bold' }}>
              عميل جديد
            </Button>
          </Col>
        </Row>

        {/* Filters Section */}
        <div style={{ backgroundColor: '#fafafa', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={10} lg={10}>
              <Input
                prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="بحث باسم العميل أو رقم العميل أو الهاتف"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                allowClear
                size="large"
                style={{ borderRadius: '6px' }}
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
          scroll={{ x: 800 }}
          pagination={{ 
            pageSize: 10, 
            showTotal: (t) => `إجمالي: ${t} عميل`,
            position: ['bottomCenter'],
            showSizeChanger: true,
            className: 'custom-pagination'
          }}
          locale={{
            emptyText: (
              <Empty 
                image={Empty.PRESENTED_IMAGE_SIMPLE} 
                description={<span style={{ color: '#8c8c8c', fontSize: '16px' }}>لا توجد بيانات عملاء حتى الآن</span>}
              >
                <Button type="primary" onClick={() => navigate('/sales/customers/create')} style={{ backgroundColor: '#001529', borderColor: '#001529' }}>إضافة أول عميل</Button>
              </Empty>
            )
          }}
          rowClassName={() => 'table-row-hover'}
        />
      </Card>
    </div>
  );
}
