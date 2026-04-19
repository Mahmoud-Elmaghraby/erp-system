import { useState } from 'react';
import { Card, Table, Button, Input, Select, DatePicker, Row, Col, Space, Typography, Modal, Form, message, Tag, Steps } from 'antd';
import { PlusOutlined, SearchOutlined, EyeOutlined, FileTextOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

export default function SalesReturnsPage() {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    { title: 'رقم الإرجاع', dataIndex: 'returnNumber', key: 'returnNumber' },
    { title: 'تاريخ الإرجاع', dataIndex: 'date', key: 'date' },
    { title: 'العميل', dataIndex: 'customer', key: 'customer' },
    { title: 'الفاتورة الأصلية', dataIndex: 'invoiceNumber', key: 'invoiceNumber' },
    { title: 'المبلغ', dataIndex: 'amount', key: 'amount' },
    {
      title: 'الحالة',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'مؤكد' ? 'green' : 'gold';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'الإجراءات',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="text" icon={<EyeOutlined />} style={{ color: '#001529' }} />
          {record.status === 'مؤكد' && !record.hasCreditNote && (
             <Button type="text" icon={<FileTextOutlined />} style={{ color: '#001529' }} onClick={() => navigate('/sales/credit-notes/create', { state: { invoiceNumber: record.invoiceNumber, amount: record.amount } })}>
               إصدار إشعار دائن
             </Button>
          )}
        </Space>
      ),
    },
  ];

  const handleAddReturn = () => {
    form.validateFields().then(values => {
      message.success('تم إنشاء طلب الإرجاع وتحديث المخزون بنجاح');
      setIsModalVisible(false);
      
      Modal.confirm({
        title: 'إصدار إشعار دائن',
        content: 'تم تحديث المخزون بنجاح، هل تريد إصدار إشعار دائن (Credit Note) بالمبلغ الآن؟',
        okText: 'نعم، إصدار الآن',
        cancelText: 'لاحقاً',
        okButtonProps: { style: { backgroundColor: '#001529', borderColor: '#001529' } },
        onOk: () => {
           navigate('/sales/credit-notes/create', { 
             state: { invoiceNumber: values.invoiceNumber, customer: 'شركة الأمل', items: [] } 
           });
        }
      });
    });
  };

  return (
    <div style={{ padding: '24px 16px', backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: "'Cairo', 'Tajawal', sans-serif" }} dir="rtl">
      <style>{`
        .wide-calendar-popup .ant-picker-panel {
          width: 380px !important;
          min-width: 380px !important;
        }
        .wide-calendar-popup .ant-picker-date-panel {
          width: 380px !important;
        }
        .wide-calendar-popup .ant-picker-content {
          width: 100% !important;
          table-layout: fixed;
        }
        .wide-calendar-popup th {
          font-size: 13px !important;
          padding: 8px 0 !important;
        }
        .wide-calendar-popup td .ant-picker-cell-inner {
          min-width: unset !important;
          width: 32px !important;
          margin: 0 auto;
        }
      `}</style>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0, color: '#001529', fontWeight: 700 }}>إدارة المرتجعات</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ backgroundColor: '#001529', borderColor: '#001529', fontWeight: 600 }}
          onClick={() => setIsModalVisible(true)}
        >
          إضافة مرتجع
        </Button>
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
            <RangePicker style={{ width: '100%' }} popupClassName="wide-calendar-popup" />
          </Col>
          <Col span={6}>
            <Button type="primary" style={{ backgroundColor: '#001529', borderColor: '#001529' }} block>بحث متقدم</Button>
          </Col>
        </Row>
      </Card>

      <Card bordered={false} style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Table
          columns={columns}
          dataSource={[]}
          locale={{ emptyText: 'لا توجد إيصالات ارتجاع' }}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="إضافة مرتجع جديد"
        open={isModalVisible}
        onOk={handleAddReturn}
        onCancel={() => setIsModalVisible(false)}
        okText="حفظ وتأكيد"
        cancelText="إلغاء"
        okButtonProps={{ style: { backgroundColor: '#001529', borderColor: '#001529' } }}
      >
        <Steps current={0} style={{ marginBottom: 24 }} size="small" items={[{ title: 'المرتجع' }, { title: 'الفحص' }, { title: 'الإشعار الدائن' }]} />
        <Form form={form} layout="vertical">
          <Form.Item name="invoiceNumber" label="رقم الفاتورة الأصلية" rules={[{ required: true, message: 'يرجى إدخال رقم الفاتورة' }]}>
             <Input placeholder="مثال: INV-2024-001" />
          </Form.Item>
          {/* Products representation would dynamically load here */}
        </Form>
      </Modal>
    </div>
  );
}
