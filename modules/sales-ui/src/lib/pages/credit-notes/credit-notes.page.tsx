import { Card, Table, Button, Input, Select, Row, Col, Space, Typography, Tag, Dropdown } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';
import { PlusOutlined, SearchOutlined, EllipsisOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Option } = Select;

interface CreditNoteRow {
  key: string;
  invoiceNumber: string;
  date: string;
  customer: string;
  amount: string;
  status: string;
}

export default function CreditNotesPage() {
  const navigate = useNavigate();

  const handleActionMenuClick = (key: string, record: CreditNoteRow) => {
    if (key === 'linkCustomer') {
      console.log('Linking to customer balance for', record.invoiceNumber);
    } else if (key === 'cashReceipt') {
      console.log('Converting to cash receipt for', record.invoiceNumber);
    }
  };

  const getActionMenu = (record: CreditNoteRow): MenuProps => ({
    items: [
      { key: 'linkCustomer', label: 'ربط هذا الإشعار برصيد العميل' },
      { key: 'cashReceipt', label: 'تحويله لسند صرف نقدي' }
    ],
    onClick: ({ key }) => handleActionMenuClick(key, record)
  });

  const columns: ColumnsType<CreditNoteRow> = [
    { title: 'رقم الفاتورة', dataIndex: 'invoiceNumber', key: 'invoiceNumber' },
    { title: 'تاريخ الإشعار', dataIndex: 'date', key: 'date' },
    { title: 'العميل', dataIndex: 'customer', key: 'customer' },
    { title: 'المبلغ', dataIndex: 'amount', key: 'amount' },
    {
      title: 'الحالة',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'volcano';
        if (status === 'مؤكد') color = 'green';
        if (status === 'تحت التسليم') color = 'gold';
        if (status === 'مسودة') color = 'default';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'الإجراءات',
      key: 'actions',
      render: (_: unknown, record: CreditNoteRow) => (
        <Dropdown menu={getActionMenu(record)} trigger={['click']}>
           <Button icon={<EllipsisOutlined />} style={{ color: '#001529' }} />
        </Dropdown>
      ),
    },
  ];

  const mockData: CreditNoteRow[] = [
     {
       key: '1',
       invoiceNumber: '000001 POS Client',
       date: '19/04/2026',
       customer: 'مستخدم الحالي',
       amount: '28.50 ج.م',
       status: 'تحت التسليم'
     }
  ];

  return (
    <div style={{ padding: '24px 16px', backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: "'Cairo', 'Tajawal', sans-serif" }} dir="rtl">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0, color: '#001529', fontWeight: 700 }}>إشعارات دائنة</Title>
        <Space>
           <Button
             type="primary"
             icon={<PlusOutlined />}
             style={{ backgroundColor: '#1890ff', borderColor: '#1890ff', fontWeight: 600, display:'none' }}
           >
             إضافة
           </Button>
           {/* Overriding green to standard #001529 per requirements */}
           <Button
             type="primary"
             icon={<PlusOutlined />}
             style={{ backgroundColor: '#001529', borderColor: '#001529', fontWeight: 600 }}
             onClick={() => navigate('/sales/credit-notes/create')}
           >
             إنشاء إشعار دائن
           </Button>
        </Space>
      </div>

      <Card bordered={false} style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Input placeholder="رقم الفاتورة" prefix={<SearchOutlined />} />
          </Col>
          <Col span={6}>
            <Select placeholder="أى عميل" style={{ width: '100%' }}>
              <Option value="1">شركة الأمل</Option>
            </Select>
          </Col>
          <Col span={6}>
             {/* Additional filters */}
          </Col>
          <Col span={6} style={{display:'flex', justifyContent:'flex-end'}}>
            <Button type="primary" style={{ backgroundColor: '#001529', borderColor: '#001529' }}>بحث متقدم</Button>
          </Col>
        </Row>
      </Card>

      <Card bordered={false} style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Table
          columns={columns}
          dataSource={mockData}
          locale={{ emptyText: 'لا توجد إيصالات إرتجاع' }}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}
