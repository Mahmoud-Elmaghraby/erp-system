import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProduct, useUpdateProduct } from '../hooks/useProducts';
import ProductForm from '../components/products/product-form';
import { message, Spin, Typography, Card, Row, Col, ConfigProvider, Button, Table, Space, Modal, Select, InputNumber } from 'antd';
import { TagOutlined, PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading: isProductLoading } = useProduct(id as string);
  const updateMutation = useUpdateProduct();

  // Price List State
  const [isPriceListModalOpen, setIsPriceListModalOpen] = useState(false);
  const [selectedPriceListId, setSelectedPriceListId] = useState<string | null>(null);
  const [newCustomPrice, setNewCustomPrice] = useState<number | null>(null);
  const [productPriceLists, setProductPriceLists] = useState([
    { id: '1', priceListName: 'قائمة أسعار الجملة', customPrice: 42000, dateAdded: '2026-04-20' }
  ]);

  const handleAddPriceList = () => {
    if (!selectedPriceListId || !newCustomPrice) {
      message.error('يرجى اختيار القائمة وتحديد السعر');
      return;
    }
    
    const newList = {
      id: Date.now().toString(),
      priceListName: selectedPriceListId === 'list_1' ? 'قائمة أسعار الجملة' : 'تسعيرة كبار العملاء',
      customPrice: newCustomPrice,
      dateAdded: new Date().toISOString().split('T')[0]
    };

    setProductPriceLists([...productPriceLists, newList]);
    message.success('تم التحديث: أضيف المنتج للقائمة');
    setIsPriceListModalOpen(false);
    setSelectedPriceListId(null);
    setNewCustomPrice(null);
  };

  const handleRemoveFromPriceList = (listId: string) => {
    setProductPriceLists(productPriceLists.filter(p => p.id !== listId));
    message.success('تمت إزالة المنتج من القائمة');
  };

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

        {/* Custom Price Lists Section */}
        <Card 
          bordered={false} 
          style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginTop: '24px' }}
          bodyStyle={{ padding: '24px' }}
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TagOutlined style={{ color: '#1677ff' }} />
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>تفاصيل التسعير وقوائم الأسعار (Pricing Details)</span>
            </div>
          }
          extra={
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsPriceListModalOpen(true)}>
              إضافة لقائمة أسعار
            </Button>
          }
        >
          <Table 
            dataSource={productPriceLists}
            rowKey="id"
            pagination={false}
            locale={{ emptyText: 'المنتج غير مضاف لأي قائمة أسعار مخصصة' }}
            columns={[
              { title: 'اسم القائمة', dataIndex: 'priceListName', key: 'priceListName' },
              { title: 'السعر المخصص', dataIndex: 'customPrice', key: 'customPrice', render: (val: number) => <span style={{ fontWeight: 'bold', color: '#1677ff' }}>{val} ج.م</span> },
              { title: 'تاريخ الإضافة', dataIndex: 'dateAdded', key: 'dateAdded' },
              { 
                title: 'إجراءات', 
                key: 'actions',
                render: (_: any, record: any) => (
                  <Space>
                    <Button size="small" type="link">تعديل</Button>
                    <Button size="small" type="link" danger onClick={() => handleRemoveFromPriceList(record.id)}>إزالة</Button>
                  </Space>
                )
              }
            ]}
          />
        </Card>

        {/* Modal for Adding to Price List */}
        <Modal
          title="إضافة المنتج لقائمة أسعار"
          open={isPriceListModalOpen}
          onCancel={() => setIsPriceListModalOpen(false)}
          onOk={handleAddPriceList}
          okText="تحديث (Update)"
          cancelText="إلغاء"
        >
          <div style={{ padding: '16px 0' }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>اختر قائمة الأسعار:</div>
              <Select
                style={{ width: '100%' }}
                placeholder="اختر القائمة..."
                value={selectedPriceListId}
                onChange={setSelectedPriceListId}
                options={[
                  { label: 'قائمة أسعار الجملة', value: 'list_1' },
                  { label: 'تسعيرة كبار العملاء', value: 'list_2' },
                ]}
              />
            </div>
            
            <div>
              <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>السعر المخصص (Custom Price):</div>
              <InputNumber 
                style={{ width: '100%' }} 
                size="large"
                addonAfter="ج.م"
                value={newCustomPrice}
                onChange={(val) => setNewCustomPrice(val as number)}
              />
            </div>
          </div>
        </Modal>
      </div>
    </ConfigProvider>
  );
}
