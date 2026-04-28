
import { Form, Input, Button, Row, Col, Typography, Card, message, Select, Divider } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateCustomer, useUpdateCustomer, useCustomers } from '../../hooks/useCustomers';

const { Title, Text } = Typography;
const { Option } = Select;

interface CustomerFormValues {
  name?: string;
  code?: string;
  email?: string;
  phone?: string;
  nationalId?: string;
  taxNumber?: string;
  address?: string;
  city?: string;
  country?: string;
  status?: string;
}

interface Customer extends CustomerFormValues {
  id?: string;
}

export default function CreateCustomerPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: customers } = useCustomers();
  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer();

  // Load customer data if editing
  const isEditing = !!id;
  const customerData = isEditing ? (customers as Customer[])?.find((c: Customer) => c.id === id) : null;

  // Generate auto customer code
  const generateCustomerCode = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `CUST-${timestamp}-${random}`;
  };



  const onFinish = async (values: CustomerFormValues) => {
    const payload = {
      ...values,
    };

    if (isEditing && id) {
      updateMutation.mutate(
        { id, data: payload },
        {
          onSuccess: () => {
            message.success('تم تحديث العميل بنجاح');
            navigate('/sales/customers');
          },
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          message.success('تم إضافة العميل بنجاح');
          navigate('/sales/customers');
        },
      });
    }
  };

  return (
    <div style={{ padding: '24px 16px', backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: "'Cairo', 'Tajawal', sans-serif" }} dir="rtl">
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Card 
          bordered={false} 
          style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
          bodyStyle={{ padding: '24px' }}
        >
          {/* Header */}
          <Row justify="space-between" align="middle" style={{ marginBottom: 32 }}>
            <Col>
              <Title level={3} style={{ margin: 0, color: '#001529', fontWeight: 700 }}>
                {isEditing ? 'تعديل العميل' : 'عميل جديد'}
              </Title>
              <Text type="secondary">
                {isEditing ? 'قم بتحديث معلومات العميل' : 'أضف عميل جديد إلى النظام'}
              </Text>
            </Col>
          </Row>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={customerData ? { ...customerData } : { status: 'active', code: generateCustomerCode() }}
            autoComplete="off"
          >
            {/* Basic Information Section */}
            <div style={{ marginBottom: '32px' }}>
              <Title level={5} style={{ color: '#001529', marginBottom: '16px', fontWeight: 600 }}>
                بيانات أساسية
              </Title>
              
              <Row gutter={[16, 0]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="name"
                    label="اسم العميل *"
                    rules={[{ required: true, message: 'الرجاء إدخال اسم العميل' }]}
                  >
                    <Input placeholder="أدخل اسم العميل" size="large" style={{ borderRadius: '6px' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="email"
                    label="البريد الإلكتروني"
                    rules={[{ type: 'email', message: 'الرجاء إدخال بريد إلكتروني صحيح' }]}
                  >
                    <Input type="email" placeholder="example@domain.com" size="large" style={{ borderRadius: '6px' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 0]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="code"
                    label="رمز العميل"
                  >
                    <Input placeholder="يتم إنشاؤه تلقائياً" size="large" style={{ borderRadius: '6px' }} disabled />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="phone"
                    label="رقم الهاتف"
                    rules={[{ pattern: /^[\d\s+\-()]*$/, message: 'الرجاء إدخال رقم هاتف صحيح' }]}
                  >
                    <Input placeholder="20 123456789+" size="large" style={{ borderRadius: '6px' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 0]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="nationalId"
                    label="رقم الهوية الوطنية"
                  >
                    <Input placeholder="أدخل رقم الهوية الوطنية" size="large" style={{ borderRadius: '6px' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="taxNumber"
                    label="الرقم الضريبي"
                  >
                    <Input placeholder="أدخل الرقم الضريبي" size="large" style={{ borderRadius: '6px' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 0]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="status"
                    label="الحالة"
                  >
                    <Select size="large" style={{ borderRadius: '6px' }}>
                      <Option value="active">نشط</Option>
                      <Option value="inactive">غير نشط</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 0]}>
                <Col xs={24}>
                  <Form.Item
                    name="address"
                    label="العنوان"
                  >
                    <Input placeholder="أدخل عنوان العميل" size="large" style={{ borderRadius: '6px' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 0]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="city"
                    label="المدينة"
                  >
                    <Input placeholder="أدخل المدينة" size="large" style={{ borderRadius: '6px' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="country"
                    label="الدولة"
                  >
                    <Input placeholder="أدخل الدولة" size="large" style={{ borderRadius: '6px' }} />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <Divider />

            {/* Action Buttons */}
            <Row justify="center" gutter={[12, 0]} style={{ marginTop: '32px' }}>
              <Col>
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={createMutation.isPending || updateMutation.isPending}
                  style={{
                    backgroundColor: '#001529',
                    borderColor: '#001529',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    minWidth: '120px',
                  }}
                >
                  {isEditing ? 'تحديث' : 'حفظ'}
                </Button>
              </Col>
              <Col>
                <Button
                  size="large"
                  icon={<CloseOutlined />}
                  onClick={() => navigate('/sales/customers')}
                  style={{ borderRadius: '8px', fontWeight: 'bold', minWidth: '120px' }}
                >
                  إلغاء
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    </div>
  );
}
