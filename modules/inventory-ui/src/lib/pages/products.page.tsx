import { useState } from 'react';
import { Button, Input, Typography, Card, Row, Col, ConfigProvider } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useProducts, useDeleteProduct } from '../hooks/useProducts';
import ProductTable from '../components/products/product-table';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

export default function ProductsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: products, isLoading } = useProducts();
  const deleteMutation = useDeleteProduct();

  const handleCreate = () => {
    navigate('/inventory/products/create');
  };

  const handleEdit = (record: any) => {
    navigate(`/inventory/products/${record.id}/edit`);
  };

  const filteredProducts = products?.filter((product: any) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (product.name && product.name.toLowerCase().includes(term)) ||
      (product.barcode && product.barcode.toLowerCase().includes(term)) ||
      (product.sku && product.sku.toLowerCase().includes(term))
    );
  });

  return (
    <ConfigProvider theme={{ token: { fontSize: 16 } }}>
      <div style={{ padding: '24px 16px', backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: "'Cairo', 'Tajawal', sans-serif" }} dir="rtl">
        <div style={{ marginBottom: 24 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={3} style={{ margin: 0, color: '#001529', fontWeight: 700 }}>المنتجات</Title>
            </Col>
            <Col>
              <div style={{ display: 'flex', gap: '16px' }}>
                <Input
                  placeholder="بحث بالاسم أو الباركود"
                  prefix={<SearchOutlined />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: 300, borderRadius: 6 }}
                  size="large"
                />
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  onClick={handleCreate}
                  size="large"
                  style={{ backgroundColor: '#001529', borderColor: '#001529', fontWeight: 600, borderRadius: 6 }}
                >
                  إضافة منتج
                </Button>
              </div>
            </Col>
          </Row>
        </div>

        <Card 
          bordered={false} 
          style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
          bodyStyle={{ padding: '0' }}
        >
          <div style={{ padding: '24px' }}>
            <ProductTable
              data={filteredProducts || []}
              loading={isLoading}
              onEdit={handleEdit}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          </div>
        </Card>
      </div>
    </ConfigProvider>
  );
}