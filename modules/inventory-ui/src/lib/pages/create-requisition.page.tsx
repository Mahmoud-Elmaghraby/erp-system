import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Form, Input, Button, DatePicker, Select, Card, Row, Col, Typography, Table, Upload, Space, InputNumber, Divider } from 'antd';
import { PlusOutlined, SettingOutlined, InboxOutlined, MinusCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;

interface RequisitionItem {
  key: string;
  item: string;
  unitPrice: number;
  quantity: number;
  stockBefore: number;
  stockAfter: number;
  total: number;
}

export default function CreateRequisitionPage() {
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get('type') || 'issue';
  const typeText = typeParam === 'add' ? 'إذن إضافة مخزن' : 'إذن صرف مخزن';

  const [items, setItems] = useState<RequisitionItem[]>([
    { key: '1', item: 'book', unitPrice: 0, quantity: 0, stockBefore: 0, stockAfter: 0, total: 0 }
  ]);

  const handleAddItem = () => {
    const newItem: RequisitionItem = {
      key: Date.now().toString(),
      item: '',
      unitPrice: 0,
      quantity: 0,
      stockBefore: 0,
      stockAfter: 0,
      total: 0
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (key: string) => {
    setItems(items.filter(item => item.key !== key));
  };

  const columns: ColumnsType<RequisitionItem> = [
    {
      title: '',
      key: 'action',
      width: 50,
      render: (_, record) => (
        <MinusCircleOutlined style={{ color: '#ff4d4f', cursor: 'pointer', fontSize: '16px' }} onClick={() => handleRemoveItem(record.key)} />
      )
    },
    {
      title: 'الإجمالي',
      dataIndex: 'total',
      width: 100,
      render: (val) => val.toFixed(2),
      align: 'center'
    },
    {
      title: 'رصيد المخزن بعد',
      dataIndex: 'stockAfter',
      width: 120,
      align: 'center'
    },
    {
      title: 'رصيد المخزن قبل',
      dataIndex: 'stockBefore',
      width: 120,
      align: 'center',
      render: (val) => <span style={{ backgroundColor: '#fffbe6', padding: '2px 8px', borderRadius: '4px' }}>{val}</span>
    },
    {
      title: 'الكمية',
      dataIndex: 'quantity',
      width: 100,
      align: 'center',
      render: (val) => <InputNumber min={0} value={val} style={{ width: '100%' }} />
    },
    {
      title: 'سعر الوحدة',
      dataIndex: 'unitPrice',
      width: 120,
      align: 'center',
      render: (val) => (
        <InputNumber 
          min={0} 
          value={val} 
          style={{ width: '100%' }} 
          addonAfter={
            <Select defaultValue="EGP" style={{ width: 60 }} bordered={false}>
              <Option value="EGP">ج.م</Option>
            </Select>
          } 
        />
      )
    },
    {
      title: 'البنود',
      dataIndex: 'item',
      align: 'right',
      render: (val) => val ? val : <Input placeholder="اختر بند..." />
    }
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: "'Cairo', 'Tajawal', sans-serif" }} dir="rtl">
      
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', backgroundColor: '#fff', padding: '16px 24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <Title level={4} style={{ margin: 0, color: '#00284d' }}>الأذون المخزنية  &gt; {typeText}</Title>
        <Space>
          <Button type="primary" style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', minWidth: '100px' }}>تأكيد</Button>
        </Space>
      </div>

      <Form form={form} layout="horizontal" labelAlign="right" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        
        {/* بيانات الإذن المخزني */}
        <Card bordered={false} style={{ marginBottom: '2px', borderRadius: '8px 8px 0 0' }} bodyStyle={{ padding: '24px' }}>
          <Row>
            <Col span={4}>
              <Text strong style={{ color: '#00284d', fontSize: '16px' }}>بيانات الإذن المخزني</Text>
            </Col>
            <Col span={20}>
              <Form.Item label="التاريخ" name="date" style={{ marginBottom: '16px' }}>
                <DatePicker showTime style={{ width: '50%' }} format="DD/MM/YYYY HH:mm" />
              </Form.Item>
              <Form.Item label="نوع الإذن" style={{ marginBottom: 0 }}>
                <Text style={{ color: '#595959' }}>{typeText}</Text>
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* بيانات المصدر */}
        <Card bordered={false} style={{ marginBottom: '2px', borderRadius: '0' }} bodyStyle={{ padding: '24px', backgroundColor: '#fafafa' }}>
          <Row>
            <Col span={4}>
              <Text strong style={{ color: '#00284d', fontSize: '16px' }}>بيانات المصدر</Text>
            </Col>
            <Col span={20}>
              <Form.Item label="المرجع" name="reference" style={{ marginBottom: 0 }}>
                <Input addonAfter={<SettingOutlined />} style={{ width: '50%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* معلومات أخرى */}
        <Card bordered={false} style={{ marginBottom: '24px', borderRadius: '0 0 8px 8px' }} bodyStyle={{ padding: '24px' }}>
          <Row>
            <Col span={4}>
              <Text strong style={{ color: '#00284d', fontSize: '16px' }}>معلومات أخرى</Text>
            </Col>
            <Col span={20}>
              
              <Form.Item label="الحساب الفرعي" required style={{ marginBottom: '16px' }}>
                <Input.Group compact style={{ display: 'flex', direction: 'rtl' }}>
                  <Input style={{ width: '40%', borderLeft: 0, textAlign: 'right' }} defaultValue="000003" addonBefore="رقم *" />
                  <Select style={{ width: '60%' }} placeholder="من فضلك اختر">
                    <Option value="1">حساب 1</Option>
                  </Select>
                </Input.Group>
              </Form.Item>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item label="العميل" name="customer" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                    <Select placeholder="اختر عميل" allowClear>
                      <Option value="c1">عميل 1</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="المورد" name="supplier" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                    <Select placeholder="اختر مورد" allowClear>
                      <Option value="s1">مورد 1</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="الملاحظات" name="notes" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                    <TextArea rows={3} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="المرفقات" name="attachments" style={{ marginTop: '16px' }}>
                <Dragger multiple={false} style={{ padding: '16px', backgroundColor: '#fafafa', border: '1px dashed #d9d9d9' }}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined style={{ color: '#1890ff' }} />
                  </p>
                  <p className="ant-upload-text">افلت الملف هنا أو <a href="#">اختر من جهازك</a></p>
                </Dragger>
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Items Table */}
        <Card bordered={false} style={{ borderRadius: '8px' }} bodyStyle={{ padding: 0, overflow: 'hidden' }}>
          <Table
            columns={columns}
            dataSource={items}
            pagination={false}
            rowKey="key"
            bordered={false}
            components={{
              header: {
                cell: (props: any) => <th {...props} style={{ ...props.style, backgroundColor: '#f8f9fa', color: '#595959', borderBottom: '1px solid #f0f0f0' }} />
              }
            }}
          />
          <div style={{ padding: '16px 24px', backgroundColor: '#e6f7ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Button type="link" icon={<PlusOutlined />} onClick={handleAddItem} style={{ padding: 0 }}>إضافة</Button>
            </div>
            <div>
              <Text strong style={{ fontSize: '16px' }}>الإجمالي 0.00</Text>
            </div>
          </div>
        </Card>

      </Form>
    </div>
  );
}
