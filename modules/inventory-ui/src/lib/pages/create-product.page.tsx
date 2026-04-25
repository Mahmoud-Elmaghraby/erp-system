import { useNavigate } from 'react-router-dom';
import { useCreateProduct } from '../hooks/useProducts';
import ProductForm from '../components/products/product-form';
import { message, Typography, Card, Row, Col, ConfigProvider } from 'antd';

const { Title } = Typography;

export default function CreateProductPage() {
  const navigate = useNavigate();
  const createMutation = useCreateProduct();

  const handleSubmit = (values: any) => {
    const hide = message.loading('جاري إضافة المنتج...', 0);
    createMutation.mutate(values, {
      onSuccess: () => {
        hide();
        message.success('تمت إضافة المنتج بنجاح');
        navigate('/inventory/products');
      },
      onError: (error) => {
        hide();
        message.error('حدث خطأ أثناء إضافة المنتج');
        console.error(error);
      }
    });
  };

  const handleCancel = () => {
    navigate('/inventory/products');
  };

  return (
    <ConfigProvider theme={{ token: { fontSize: 16 } }}>
      <div style={{ padding: '24px 16px', backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: "'Cairo', 'Tajawal', sans-serif" }} dir="rtl">
        <div style={{ marginBottom: 24 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={3} style={{ margin: 0, color: '#001529', fontWeight: 700 }}>إضافة منتج جديد</Title>
            </Col>
          </Row>
        </div>

        <Card 
          bordered={false} 
          style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
          bodyStyle={{ padding: '24px' }}
        >
          <ProductForm 
            onSubmit={handleSubmit} 
            onCancel={handleCancel} 
            loading={createMutation.isPending} 
          />
        </Card>
      </div>
    </ConfigProvider>
  );
}
