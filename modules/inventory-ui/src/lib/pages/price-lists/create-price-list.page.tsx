import React, { useState } from 'react';
import { 
  Form, Input, Select, Button, Table, Space, Typography, Card, 
  Modal, Upload, message, Divider, Tag, Popconfirm, InputNumber, Row, Col 
} from 'antd';
import { 
  ArrowLeftOutlined, PlusOutlined, UploadOutlined, 
  SearchOutlined, DeleteOutlined, EditOutlined, SaveOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;

// Dummy product catalog for selection
const CATALOG = [
  { id: 'p1', name: 'لابتوب ديل XPS', defaultPrice: 45000 },
  { id: 'p2', name: 'شاشة سامسونج 27 بوصة', defaultPrice: 8500 },
  { id: 'p3', name: 'لوحة مفاتيح ميكانيكية', defaultPrice: 3200 },
];

export default function CreatePriceListPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  // Items state
  const [items, setItems] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('name');
  
  // Add Product Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [customPrice, setCustomPrice] = useState<number | null>(null);

  // Import Modal State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importStep, setImportStep] = useState(1);
  const [fileList, setFileList] = useState<any[]>([]);
  
  // Handle Add Product
  const handleProductSelect = (val: string) => {
    setSelectedProductId(val);
    const product = CATALOG.find(p => p.id === val);
    if (product) {
      setCustomPrice(product.defaultPrice);
    }
  };

  const handleAddProduct = () => {
    if (!selectedProductId || !customPrice) {
      message.error('يرجى اختيار منتج وتحديد السعر');
      return;
    }
    const product = CATALOG.find(p => p.id === selectedProductId);
    if (!product) return;

    const newItem = {
      key: Date.now().toString(),
      productId: product.id,
      name: product.name,
      defaultPrice: product.defaultPrice,
      customPrice: customPrice,
    };
    
    setItems(prev => [...prev, newItem]);
    message.success('تمت إضافة المنتج للقائمة');
    
    // Reset
    setSelectedProductId(null);
    setCustomPrice(null);
    setIsAddModalOpen(false);
  };

  // Handle Remove
  const handleRemove = (key: string) => {
    setItems(prev => prev.filter(i => i.key !== key));
  };

  // CSV Import Simulation
  const handleImport = () => {
    setImportStep(3);
    setTimeout(() => {
      message.success('تم استيراد المنتجات بنجاح');
      setIsImportModalOpen(false);
      setImportStep(1);
      setFileList([]);
      // Mock imported data
      setItems(prev => [
        ...prev, 
        { key: 'mock1', productId: 'p1', name: 'لابتوب ديل XPS', defaultPrice: 45000, customPrice: 42000 },
        { key: 'mock2', productId: 'p2', name: 'شاشة سامسونج 27 بوصة', defaultPrice: 8500, customPrice: 8000 }
      ]);
      Modal.success({
        title: 'ملخص الاستيراد',
        content: (
          <div>
            <p>تم استيراد بنجاح: <strong>2</strong> منتج</p>
            <p>تم تحديث: <strong>0</strong> منتج</p>
            <p style={{ color: 'red' }}>مرفوض: <strong>0</strong> منتج</p>
          </div>
        )
      });
    }, 1500);
  };

  // Filtering and Sorting
  const filteredItems = items
    .filter(i => i.name.toLowerCase().includes(searchText.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'price_asc') return a.customPrice - b.customPrice;
      if (sortBy === 'price_desc') return b.customPrice - a.customPrice;
      return 0;
    });

  const columns = [
    { title: 'اسم المنتج', dataIndex: 'name', key: 'name' },
    { 
      title: 'السعر الافتراضي', 
      dataIndex: 'defaultPrice', 
      key: 'defaultPrice',
      render: (val: number) => <Text type="secondary">{val} ج.م</Text>
    },
    { 
      title: 'السعر المخصص', 
      dataIndex: 'customPrice', 
      key: 'customPrice',
      render: (val: number) => <Text strong color="#1677ff">{val} ج.م</Text>
    },
    {
      title: 'إجراءات',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" />
          <Popconfirm title="حذف المنتج؟" onConfirm={() => handleRemove(record.key)}>
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/inventory/price-lists')}
          style={{ marginRight: '16px' }}
        />
        <Title level={3} style={{ margin: 0 }}>إنشاء قائمة أسعار جديدة</Title>
      </div>

      <Form form={form} layout="vertical" initialValues={{ status: 'active' }}>
        <Card title="تفاصيل القائمة" style={{ marginBottom: '24px' }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="name" 
                label="اسم القائمة" 
                rules={[{ required: true, message: 'يرجى إدخال اسم القائمة' }]}
              >
                <Input placeholder="مثال: أسعار الجملة" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="حالة القائمة">
                <Select size="large">
                  <Option value="active"><Tag color="green">نشط</Tag></Option>
                  <Option value="inactive"><Tag color="default">معطل</Tag></Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card 
          title="المنتجات والأسعار" 
          extra={
            <Space>
              <Button icon={<UploadOutlined />} onClick={() => setIsImportModalOpen(true)}>
                استيراد (CSV)
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddModalOpen(true)}>
                إضافة منتج يدوياً
              </Button>
            </Space>
          }
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <Input 
              placeholder="ابحث عن منتج..." 
              prefix={<SearchOutlined />} 
              style={{ width: '300px' }}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
            <Select 
              value={sortBy} 
              onChange={setSortBy} 
              style={{ width: '200px' }}
              options={[
                { label: 'ترتيب حسب: الاسم', value: 'name' },
                { label: 'السعر: من الأقل للأعلى', value: 'price_asc' },
                { label: 'السعر: من الأعلى للأقل', value: 'price_desc' },
              ]}
            />
          </div>

          <Table 
            columns={columns} 
            dataSource={filteredItems} 
            pagination={{ pageSize: 10, showSizeChanger: true }}
            locale={{ emptyText: 'لم يتم إضافة أي منتجات لهذه القائمة بعد' }}
          />
        </Card>

        <div style={{ marginTop: '24px', textAlign: 'left' }}>
          <Button type="primary" size="large" icon={<SaveOutlined />}>
            حفظ قائمة الأسعار
          </Button>
        </div>
      </Form>

      {/* Manual Item Entry Modal */}
      <Modal
        title="إضافة منتج للقائمة"
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        footer={[
          <Button key="back" onClick={() => setIsAddModalOpen(false)}>إلغاء</Button>,
          <Button key="submit" type="primary" onClick={handleAddProduct}>حفظ ومتابعة</Button>
        ]}
      >
        <div style={{ padding: '16px 0' }}>
          <Text strong>اختر المنتج:</Text>
          <Select 
            showSearch
            style={{ width: '100%', marginTop: '8px', marginBottom: '16px' }}
            placeholder="ابحث واختر منتج..."
            value={selectedProductId}
            onChange={handleProductSelect}
            options={CATALOG.map(p => ({ label: p.name, value: p.id }))}
          />

          {selectedProductId && (
            <div style={{ background: '#f5f5f5', padding: '16px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <Text>السعر الافتراضي:</Text>
                <Text strong>{CATALOG.find(p => p.id === selectedProductId)?.defaultPrice} ج.م</Text>
              </div>
              <div>
                <Text strong>السعر المخصص الجديد:</Text>
                <InputNumber 
                  style={{ width: '100%', marginTop: '8px' }} 
                  size="large"
                  value={customPrice}
                  onChange={(val) => setCustomPrice(val as number)}
                  addonAfter="ج.م"
                />
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* CSV Import Modal */}
      <Modal
        title="استيراد قائمة أسعار (CSV)"
        open={isImportModalOpen}
        onCancel={() => setIsImportModalOpen(false)}
        footer={
          importStep === 1 ? [
            <Button key="cancel" onClick={() => setIsImportModalOpen(false)}>إلغاء</Button>,
            <Button key="next" type="primary" onClick={() => setImportStep(2)} disabled={fileList.length === 0}>التالي</Button>
          ] : importStep === 2 ? [
            <Button key="back" onClick={() => setImportStep(1)}>رجوع</Button>,
            <Button key="import" type="primary" onClick={handleImport}>بدء الاستيراد</Button>
          ] : null
        }
      >
        {importStep === 1 && (
          <div style={{ padding: '24px 0' }}>
            <Upload.Dragger 
              name="file" 
              accept=".csv"
              fileList={fileList}
              beforeUpload={(file) => {
                setFileList([file]);
                return false;
              }}
              onRemove={() => setFileList([])}
            >
              <p className="ant-upload-drag-icon"><UploadOutlined /></p>
              <p className="ant-upload-text">اسحب ملف CSV هنا أو اضغط للاختيار</p>
              <p className="ant-upload-hint">يجب أن يكون الملف مفصولاً بفواصل (Comma-separated)</p>
            </Upload.Dragger>
          </div>
        )}

        {importStep === 2 && (
          <div style={{ padding: '16px 0' }}>
            <Title level={5}>تطابق الأعمدة (Data Mapping)</Title>
            <Text type="secondary">يرجى مطابقة أعمدة ملف CSV مع حقول النظام</Text>
            
            <div style={{ marginTop: '24px' }}>
              <Row style={{ marginBottom: '16px', alignItems: 'center' }}>
                <Col span={10}><Text strong>حقل النظام: اسم المنتج</Text></Col>
                <Col span={2}><ArrowLeftOutlined /></Col>
                <Col span={12}>
                  <Select defaultValue="product_name" style={{ width: '100%' }}>
                    <Option value="product_name">Product Name (موجود في الملف)</Option>
                    <Option value="name">Name</Option>
                  </Select>
                </Col>
              </Row>
              <Row style={{ alignItems: 'center' }}>
                <Col span={10}><Text strong>حقل النظام: السعر المخصص</Text></Col>
                <Col span={2}><ArrowLeftOutlined /></Col>
                <Col span={12}>
                  <Select defaultValue="new_price" style={{ width: '100%' }}>
                    <Option value="new_price">New Price (موجود في الملف)</Option>
                    <Option value="price">Price</Option>
                  </Select>
                </Col>
              </Row>
            </div>
          </div>
        )}

        {importStep === 3 && (
          <div style={{ padding: '40px 0', textAlign: 'center' }}>
            <div className="ant-upload-text">جاري معالجة البيانات...</div>
          </div>
        )}
      </Modal>
    </div>
  );
}
