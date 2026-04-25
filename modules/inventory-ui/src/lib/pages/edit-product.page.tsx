import { useNavigate, useParams } from 'react-router-dom';
import { useProduct, useUpdateProduct } from '../hooks/useProducts';
import ProductForm from '../components/products/product-form';
import { message, Spin, Typography, Card, Row, Col, ConfigProvider } from 'antd';

const { Title } = Typography;

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading: isProductLoading } = useProduct(id as string);
  const updateMutation = useUpdateProduct();

  const handleSubmit = (values: any) => {
    if (!id) return;
    const hide = message.loading('جاري حفظ التعديلات...', 0);
    updateMutation.mutate(
      { id, data: values },
      {
        onSuccess: () => {
          hide();
          message.success('تم حفظ التعديلات بنجاح');
          navigate('/inventory/products');
        },
        onError: (error) => {
          hide();
          message.error('حدث خطأ أثناء حفظ التعديلات');
          console.error(error);
        }
      }
    );
  };

  const handleCancel = () => {
    navigate('/inventory/products');
  };

  if (isProductLoading) {
    return <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />;
  }

  if (!product) {
    return <div dir="rtl" style={{ padding: 24, textAlign: 'center' }}>المنتج غير موجود</div>;
  }

  return (
    <ConfigProvider theme={{ token: { fontSize: 16 } }}>
      <div style={{ padding: '24px 16px', backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: "'Cairo', 'Tajawal', sans-serif" }} dir="rtl">
        <div style={{ marginBottom: 24 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={3} style={{ margin: 0, color: '#001529', fontWeight: 700 }}>تعديل المنتج: {product.name}</Title>
            </Col>
          </Row>
        </div>

        <Card 
          bordered={false} 
          style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
          bodyStyle={{ padding: '24px' }}
        >
          <ProductForm 
            initialValues={{
              ...product,
              categoryId: product.categoryId || product.category?.id,
              brandId: product.brandId || product.brand?.id,
            }}
            onSubmit={handleSubmit} 
            onCancel={handleCancel} 
            loading={updateMutation.isPending} 
          />
        </Card>
      </div>
    </ConfigProvider>
  );
}
