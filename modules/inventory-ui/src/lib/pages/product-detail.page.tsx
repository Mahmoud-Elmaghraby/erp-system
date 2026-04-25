import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, Button, Select, DatePicker, Popconfirm, Tag, Spin, Typography, Row, Col, Space, Input, InputNumber, Modal, Form, Table, Image, Upload, message, Tooltip, Alert, Dropdown } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, PictureOutlined, CopyOutlined, MinusOutlined, DownOutlined, UpOutlined, ArrowRightOutlined, UploadOutlined, AppstoreOutlined, BarsOutlined, InfoCircleOutlined, RightOutlined, LeftOutlined, FileTextOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useProductVariants, useProductPriceHistory, useCreateVariant, useDeleteVariant } from '../hooks/useProductVariants';
import { useProduct } from '../hooks/useProducts';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function ProductDetailPage() {
  return (
    <>
      <style>{`
        .single-calendar-range .ant-picker-panel:nth-child(2) {
          display: none !important;
        }
        .single-calendar-range .ant-picker-panel-layout {
          display: block !important;
        }
        .single-calendar-range .ant-picker-panels {
          display: block !important;
        }
        .custom-large-calendar .ant-picker-panel-container {
          width: 380px !important;
        }
        .custom-large-calendar .ant-picker-panel,
        .custom-large-calendar .ant-picker-date-panel,
        .custom-large-calendar .ant-picker-body,
        .custom-large-calendar .ant-picker-content {
          width: 100% !important;
        }
        .custom-large-calendar .ant-picker-content th {
          padding: 16px 0 !important;
          font-size: 14px;
        }
        .custom-large-calendar .ant-picker-cell {
          padding: 8px 0 !important;
        }
        .custom-large-calendar .ant-picker-cell-inner {
          min-width: 32px !important;
          height: 32px !important;
          line-height: 32px !important;
          margin: 0 auto;
          font-size: 14px;
        }
      `}</style>
      <InnerProductDetailPage />
    </>
  );
}

function InnerProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [variantForm] = Form.useForm();
  const [timelineDateFilter, setTimelineDateFilter] = useState<string | null>(null);

  const { data: product, isLoading: productLoading } = useProduct(id!);
  const { data: variants, isLoading: variantsLoading } = useProductVariants(id!);
  const createVariantMutation = useCreateVariant();
  const deleteVariantMutation = useDeleteVariant();

  const variantColumns = [
    { title: 'الاسم', dataIndex: 'name', key: 'name' },
    { title: 'SKU', dataIndex: 'sku', key: 'sku', render: (v: any) => v || '-' },
    { title: 'الباركود', dataIndex: 'barcode', key: 'barcode', render: (v: any) => v || '-' },
    { title: 'السعر', dataIndex: 'price', key: 'price', render: (v: any) => `${Number(v || 0).toFixed(2)} ج.م` },
    { title: 'التكلفة', dataIndex: 'cost', key: 'cost', render: (v: any) => `${Number(v || 0).toFixed(2)} ج.م` },
    {
      title: 'الخصائص',
      dataIndex: 'attributes',
      key: 'attributes',
      render: (attrs: any) => Object.entries(attrs || {}).map(([k, v]) => (
        <Tag key={k}>{k}: {v as string}</Tag>
      )),
    },
    {
      title: 'إجراءات',
      key: 'actions',
      render: (_: any, record: any) => (
        <Popconfirm title="هل أنت متأكد من الحذف؟" onConfirm={() => deleteVariantMutation.mutate(record.id)} okText="نعم" cancelText="لا">
          <Button danger icon={<DeleteOutlined />} size="small" />
        </Popconfirm>
      ),
    },
  ];

  const handleCreateVariant = (values: any) => {
    createVariantMutation.mutate(
      { ...values, productId: id },
      { onSuccess: () => { setIsVariantModalOpen(false); variantForm.resetFields(); } }
    );
  };

  if (productLoading) {
    return <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />;
  }

  if (!product) {
    return <div dir="rtl" style={{ padding: 24, textAlign: 'center' }}>المنتج غير موجود</div>;
  }

  return (
    <div style={{ padding: '16px 24px', backgroundColor: '#e9ecef', minHeight: '100vh', fontFamily: "'Cairo', 'Tajawal', sans-serif" }} dir="rtl">
      <style>{`
        .product-tabs .ant-tabs-nav {
          margin-bottom: 0 !important;
          background-color: #fff;
        }
        .product-tabs .ant-tabs-tab {
          padding: 12px 24px !important;
          background-color: transparent !important;
          border: none !important;
          margin: 0 !important;
          border-radius: 0 !important;
        }
        .product-tabs .ant-tabs-tab-active {
          background-color: #fff !important;
          border-top: 3px solid #00284d !important;
          border-right: 1px solid #f0f0f0 !important;
          border-left: 1px solid #f0f0f0 !important;
        }
        .product-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
          color: #333 !important;
          font-weight: bold;
        }
        .top-action-bar .ant-btn {
          border-radius: 0;
          border-color: #d9d9d9;
          color: #595959;
          background-color: #fff;
        }
        .top-action-bar .ant-btn:hover {
          color: #00284d;
          border-color: #00284d;
        }
      `}</style>
      
      {/* Top Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px', direction: 'rtl' }} className="top-action-bar">
        <Space.Compact style={{ direction: 'rtl' }}>
          <Button type="primary" style={{ backgroundColor: '#00a8ff', borderColor: '#00a8ff', borderRadius: '0 4px 4px 0' }} icon={<EditOutlined />} onClick={() => navigate(`/inventory/products/${id}/edit`)}>تعديل</Button>
          <Popconfirm title="هل أنت متأكد من الحذف؟">
            <Button icon={<DeleteOutlined style={{ color: '#8c8c8c' }} />}>حذف</Button>
          </Popconfirm>
          <Button icon={<PlusOutlined style={{ color: '#8c8c8c' }} />} onClick={() => navigate('/inventory/requisitions/create?type=add')}>أضف عملية</Button>
          <Button icon={<MinusOutlined style={{ color: '#8c8c8c' }} />} onClick={() => navigate('/inventory/requisitions/create?type=issue')}>عملية صرف</Button>
          <Dropdown menu={{ items: [{ key: '1', label: 'تصدير' }, { key: '2', label: 'طباعة باركود' }, { key: '3', label: 'طباعة ملصق' }] }}>
            <Button>مطبوعات <DownOutlined style={{ color: '#8c8c8c' }} /></Button>
          </Dropdown>
          <Button icon={<CopyOutlined style={{ color: '#8c8c8c' }} />} style={{ borderRadius: '4px 0 0 4px' }}>نسخ</Button>
        </Space.Compact>
        <Button icon={<ArrowRightOutlined />} onClick={() => navigate('/inventory/products')} style={{ marginRight: 'auto' }}>رجوع</Button>
      </div>

      <div style={{ backgroundColor: '#fff', border: '1px solid #f0f0f0' }}>
        <Tabs
          className="product-tabs"
          defaultActiveKey="info"
          type="card"
          items={[
            {
              key: 'info',
              label: 'معلومات',
              children: (
                <div style={{ padding: '24px', backgroundColor: '#fff' }}>
                  {/* Top Stats */}
                  <div style={{ display: 'flex', direction: 'rtl', border: '1px solid #f0f0f0', borderBottom: 'none' }}>
                    <div style={{ flex: 1, textAlign: 'center', padding: '16px', borderLeft: '1px solid #f0f0f0' }}>
                      <Text strong style={{ color: '#1890ff' }}>إجمالي المخزون</Text>
                      <Title level={3} style={{ margin: '16px 0', fontWeight: 'bold' }}>{product.available || 0}</Title>
                      <Button type="primary" style={{ backgroundColor: '#1890ff', borderColor: '#1890ff', width: '80%', borderRadius: '4px' }} onClick={() => navigate('/inventory/requisitions/create?type=add')}>أضف عملية على مخزون</Button>
                    </div>
                    <div style={{ flex: 1, textAlign: 'center', padding: '16px', borderLeft: '1px solid #f0f0f0' }}>
                      <Text strong style={{ color: '#1890ff' }}>إجمالي القطع المباعة <InfoCircleOutlined style={{ color: '#bfbfbf', fontSize: '12px' }} /></Text>
                      <Title level={3} style={{ margin: '16px 0', fontWeight: 'bold' }}>0</Title>
                    </div>
                    <div style={{ flex: 1, textAlign: 'center', padding: '16px', borderLeft: '1px solid #f0f0f0' }}>
                      <Text strong style={{ color: '#1890ff' }}>آخر 28 أيام</Text>
                      <Title level={3} style={{ margin: '16px 0', fontWeight: 'bold' }}>0</Title>
                    </div>
                    <div style={{ flex: 1, textAlign: 'center', padding: '16px' }}>
                      <Text strong style={{ color: '#1890ff' }}>آخر 7 أيام</Text>
                      <Title level={3} style={{ margin: '16px 0', fontWeight: 'bold' }}>0</Title>
                    </div>
                  </div>

                  {/* Details Section */}
                  <div style={{ border: '1px solid #f0f0f0', borderTop: '2px solid #f0f0f0' }}>
                    <div style={{ backgroundColor: '#f8f9fa', padding: '8px 16px', borderBottom: '1px solid #f0f0f0', textAlign: 'right' }}>
                      <Text strong style={{ color: '#595959' }}>التفاصيل</Text>
                    </div>
                    <Row style={{ padding: '24px' }} align="top">
                      {/* Right: Image */}
                      <Col span={8} style={{ textAlign: 'center' }}>
                        <Upload 
                          name="productImage" 
                          showUploadList={false} 
                          beforeUpload={(file) => {
                            message.success(`Selected file: ${file.name}`);
                            return false;
                          }}
                        >
                          <div style={{ width: '200px', height: '200px', margin: '0 auto', backgroundColor: '#e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#adb5bd', cursor: 'pointer', border: '1px dashed #d9d9d9', borderRadius: '4px' }}>
                            {product.image || product.imageUrl ? (
                              <Image preview={false} src={product.image || product.imageUrl} alt={product.name} style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '4px' }} />
                            ) : (
                              <>
                                <PictureOutlined style={{ fontSize: '64px', marginBottom: '16px' }} />
                                <Text type="secondary" style={{ color: '#adb5bd', fontWeight: 'bold' }}>Click here to upload<br/>product photos</Text>
                              </>
                            )}
                          </div>
                        </Upload>
                      </Col>
                      {/* Middle & Left: Details */}
                      <Col span={16} style={{ paddingRight: '24px', paddingLeft: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '8px' }}>
                          <Text strong style={{ color: '#00284d', width: '120px' }}>كود المنتج SKU:</Text>
                          <Text>{product.sku || product.barcode || '-'}</Text>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '8px' }}>
                          <Text strong style={{ color: '#00284d', width: '120px' }}>سعر البيع:</Text>
                          <Text>{Number(product.price || 0).toFixed(2)} ج.م</Text>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '8px' }}>
                          <Text strong style={{ color: '#00284d', width: '120px' }}>أقل سعر بيع:</Text>
                          <Text>{Number(product.lowestPrice || 0).toFixed(2)}</Text>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '8px' }}>
                          <Text strong style={{ color: '#00284d', width: '120px' }}>الوصف:</Text>
                          <Text>{product.description || '-'}</Text>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '8px' }}>
                          <Text strong style={{ color: '#00284d', width: '120px' }}>سعر الشراء:</Text>
                          <Text>{Number(product.cost || 0).toFixed(2)} ج.م</Text>
                        </div>
                      </Col>
                    </Row>
                  </div>


                </div>
              ),
            },
            {
              key: 'movement',
              label: 'حركة المخزون',
              children: (
                <div style={{ padding: '24px', backgroundColor: '#fff' }}>
                  <div style={{ display: 'flex', gap: '8px', padding: '16px', border: '1px solid #f0f0f0', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'space-between' }}>
                    
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <RangePicker placeholder={['الفترة من', 'إلى']} style={{ width: 250 }} />
                      
                      <Select defaultValue="all" style={{ width: 200 }} options={[
                        {label: 'الكل', value: 'all'}, 
                        {label: 'فاتورة مرتجعة', value: '1'},
                        {label: 'إشعار دائن', value: '2'},
                        {label: 'فاتورة شراء', value: '3'},
                        {label: 'مرتجع مشتريات', value: '4'},
                        {label: 'إشعار مدين المشتريات', value: '5'},
                        {label: 'فاتورة', value: '6'},
                        {label: 'تعديل يدوي', value: '7'},
                        {label: 'منتج مجمع', value: '8'},
                        {label: 'إذن مخزن', value: '9'},
                        {label: 'إذن مخزني فاتورة', value: '10'},
                        {label: 'إذن مخزني مرتجع مبيعات', value: '11'},
                        {label: 'إذن مخزني فاتورة الشراء', value: '12'},
                      ]} />

                      <Select defaultValue="all" style={{ width: 150 }} options={[
                        {label: 'الكل', value: 'all'}, 
                        {label: 'Primary Warehouse', value: 'primary'}
                      ]} />
                    </div>

                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <Space.Compact style={{ direction: 'rtl' }}>
                        <Tooltip title="تصاعدي"><Button style={{ backgroundColor: '#e6f4ff', color: '#1677ff', border: '1px solid #bae0ff' }} icon={<UpOutlined />} /></Tooltip>
                        <Tooltip title="تنازلي"><Button style={{ backgroundColor: '#e6f4ff', color: '#1677ff', border: '1px solid #bae0ff' }} icon={<DownOutlined />} /></Tooltip>
                        <Tooltip title="أضف عملية على مخزون"><Button style={{ backgroundColor: '#52c41a', color: '#fff', border: 'none' }} icon={<PlusOutlined />} /></Tooltip>
                        <Button style={{ backgroundColor: '#52c41a', color: '#fff', border: 'none' }} icon={<MinusOutlined />} />
                      </Space.Compact>
                    </div>

                  </div>
                  <div style={{ border: '1px solid #f0f0f0', borderTop: 'none', height: '300px', backgroundColor: '#e9ecef' }}>
                    {/* Empty table area matching the photo */}
                  </div>
                </div>
              ),
            },
            {
              key: 'timeline',
              label: 'الجدول الزمني',
              children: (
                <div style={{ padding: '24px', backgroundColor: '#fff' }}>
                  <div style={{ display: 'flex', gap: '8px', padding: '16px', border: '1px solid #f0f0f0', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'space-between' }}>
                    
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <Select 
                        mode="multiple"
                        maxTagCount={0}
                        maxTagPlaceholder="كل الإجراءات"
                        placeholder="كل الإجراءات"
                        style={{ width: 170 }} 
                        showSearch
                        options={[
                          { label: 'إضافة منتج', value: 'add_product' },
                          { label: 'تعديل المنتج', value: 'edit_product' },
                          { label: 'حذف المنتج', value: 'delete_product' },
                          { label: 'إضافة مخزون مشتري', value: 'add_purchase_inv' },
                          { label: 'تحديث مخزون مشتر', value: 'update_purchase_inv' },
                          { label: 'إزالة مخزون مشتري', value: 'remove_purchase_inv' },
                          { label: 'إضافة مخزون مباع', value: 'add_sold_inv' },
                          { label: 'تعديل مخزون مباع', value: 'edit_sold_inv' },
                          { label: 'إزالة مخزون مباع', value: 'remove_sold_inv' },
                          { label: 'تعديل يدوي للمخزون', value: 'manual_adjust' },
                          { label: 'Change Price Changed', value: 'change_price' },
                          { label: 'إضافة مخزون إشعار', value: 'add_notice_inv' },
                          { label: 'تحديث مخزون إشعار', value: 'update_notice_inv' },
                          { label: 'Credit Note Stock', value: 'credit_note_stock' },
                          { label: 'إضافة مخزون إيصال', value: 'add_receipt_inv' },
                          { label: 'تعديل مخزون إيصال', value: 'edit_receipt_inv' },
                          { label: 'حذف مخزون إيصال', value: 'delete_receipt_inv' },
                        ]} 
                      />
                      <Space.Compact style={{ direction: 'rtl' }}>
                        <Tooltip title="تصاعدي"><Button style={{ backgroundColor: '#e6f4ff', color: '#1677ff', border: '1px solid #bae0ff' }} icon={<UpOutlined />} /></Tooltip>
                        <Tooltip title="تنازلي"><Button style={{ backgroundColor: '#e6f4ff', color: '#1677ff', border: '1px solid #bae0ff' }} icon={<DownOutlined />} /></Tooltip>
                      </Space.Compact>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <Select 
                        placeholder="الفترة من / إلى" 
                        style={{ width: 250 }} 
                        onChange={(value) => setTimelineDateFilter(value)}
                        options={[
                          { label: 'الأسبوع الماضي', value: 'last_week' },
                          { label: 'الشهر الأخير', value: 'last_month' },
                          { label: 'من أول الشهر حتى اليوم', value: 'month_to_date' },
                          { label: 'السنة الماضية', value: 'last_year' },
                          { label: 'من أول السنة حتى اليوم', value: 'year_to_date' },
                          { label: 'الفترة من / إلى', value: 'custom_range' },
                          { label: 'تاريخ محدد', value: 'specific_date' },
                          { label: 'كل التواريخ قبل', value: 'all_before' },
                          { label: 'كل التواريخ بعد', value: 'all_after' },
                        ]}
                      />
                      {timelineDateFilter === 'custom_range' && (
                        <RangePicker 
                          style={{ width: 250 }} 
                          popupClassName="single-calendar-range custom-large-calendar"
                          popupStyle={{ zIndex: 9999 }} 
                        />
                      )}
                      {['specific_date', 'all_before', 'all_after'].includes(timelineDateFilter || '') && (
                        <DatePicker style={{ width: 150 }} popupClassName="custom-large-calendar" popupStyle={{ zIndex: 9999 }} />
                      )}
                      <Space.Compact style={{ direction: 'rtl' }}>
                        <Tooltip title="عرض كجدول"><Button style={{ backgroundColor: '#e6f4ff', color: '#1677ff', border: '1px solid #bae0ff' }} icon={<AppstoreOutlined />} /></Tooltip>
                        <Tooltip title="عرض الجدول الزمني"><Button style={{ backgroundColor: '#e6f4ff', color: '#1677ff', border: '1px solid #bae0ff' }} icon={<BarsOutlined />} /></Tooltip>
                      </Space.Compact>
                    </div>

                  </div>
                  <div style={{ border: '1px solid #f0f0f0', borderTop: 'none', padding: '24px', backgroundColor: '#e9ecef', minHeight: '300px' }}>
                    <Alert
                      message="لا يوجد أي نشاط يطابق هذه المعايير"
                      type="warning"
                      showIcon
                      icon={<InfoCircleOutlined />}
                    />
                  </div>
                </div>
              )
            },
            {
              key: 'activity',
              label: 'سجل النشاطات',
              children: (
                <div style={{ padding: '24px', backgroundColor: '#fff' }}>
                  <div style={{ display: 'flex', gap: '8px', padding: '16px', border: '1px solid #f0f0f0', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <Space.Compact style={{ direction: 'rtl' }}>
                        <Button style={{ backgroundColor: '#f5f5f5', color: '#bfbfbf', border: '1px solid #d9d9d9' }} icon={<RightOutlined />} />
                        <Button style={{ backgroundColor: '#f5f5f5', color: '#bfbfbf', border: '1px solid #d9d9d9' }} icon={<LeftOutlined />} />
                      </Space.Compact>
                      <Select 
                        mode="multiple"
                        maxTagCount={0}
                        maxTagPlaceholder="كل الإجراءات"
                        placeholder="كل الإجراءات" 
                        style={{ width: 150 }} 
                        showSearch
                        options={[
                          { label: 'إضافة منتج', value: 'add_product' },
                          { label: 'تعديل المنتج', value: 'edit_product' },
                          { label: 'حذف المنتج', value: 'delete_product' },
                          { label: 'إضافة مخزون مشتري', value: 'add_purchase_inv' },
                          { label: 'تحديث مخزون مشتر', value: 'update_purchase_inv' },
                          { label: 'إزالة مخزون مشتري', value: 'remove_purchase_inv' },
                          { label: 'إضافة مخزون مباع', value: 'add_sold_inv' },
                          { label: 'تعديل مخزون مباع', value: 'edit_sold_inv' },
                          { label: 'إزالة مخزون مباع', value: 'remove_sold_inv' },
                          { label: 'تعديل يدوي للمخزون', value: 'manual_adjust' },
                          { label: 'Change Price Changed', value: 'change_price' },
                          { label: 'إضافة مخزون إشعار', value: 'add_notice_inv' },
                          { label: 'تحديث مخزون إشعار', value: 'update_notice_inv' },
                          { label: 'Credit Note Stock', value: 'credit_note_stock' },
                          { label: 'إضافة مخزون إيصال', value: 'add_receipt_inv' },
                          { label: 'تعديل مخزون إيصال', value: 'edit_receipt_inv' },
                          { label: 'حذف مخزون إيصال', value: 'delete_receipt_inv' },
                        ]} 
                      />
                      <Select 
                        mode="multiple" 
                        maxTagCount={0} 
                        maxTagPlaceholder="كل الفاعلين"
                        placeholder="كل الفاعلين" 
                        style={{ width: 150 }} 
                        showSearch
                        options={[
                          { label: 'تحديد الجميع', value: 'all' },
                          { label: 'Omar', value: 'omar' },
                          { label: 'قام بإضافة منتج', value: 'added_product' },
                        ]}
                      />
                      <RangePicker 
                        placeholder={['تحديد الفترة الزمنية', '']} 
                        style={{ width: 200 }} 
                        format="YYYY-MM-DD"
                        popupClassName="single-calendar-range custom-large-calendar"
                        popupStyle={{ zIndex: 9999 }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <Space.Compact style={{ direction: 'rtl' }}>
                        <Tooltip title="Ascending"><Button style={{ backgroundColor: '#e6f4ff', color: '#1677ff', border: '1px solid #bae0ff' }} icon={<UpOutlined />} /></Tooltip>
                        <Tooltip title="Descending"><Button style={{ backgroundColor: '#e6f4ff', color: '#1677ff', border: '1px solid #bae0ff' }} icon={<DownOutlined />} /></Tooltip>
                      </Space.Compact>
                    </div>
                  </div>
                  <div style={{ border: '1px solid #f0f0f0', borderTop: 'none', padding: '24px', backgroundColor: '#e9ecef', minHeight: '300px' }}>
                    <div style={{ display: 'flex', direction: 'rtl', minHeight: '200px' }}>
                      <div style={{ width: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ backgroundColor: '#337ab7', color: '#fff', padding: '4px 16px', borderRadius: '4px', marginBottom: '16px' }}>الأحد</div>
                        <div style={{ width: '4px', backgroundColor: '#bfbfbf', flex: 1, position: 'relative' }}>
                          <div style={{ position: 'absolute', top: '16px', right: '-14px', backgroundColor: '#52c41a', color: '#fff', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FileTextOutlined />
                          </div>
                        </div>
                      </div>
                      <div style={{ flex: 1, paddingRight: '32px' }}>
                        <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '4px', border: '1px solid #f0f0f0', position: 'relative', marginTop: '48px' }}>
                          <div style={{ position: 'absolute', right: '-8px', top: '22px', width: '16px', height: '16px', backgroundColor: '#fff', borderRight: '1px solid #f0f0f0', borderTop: '1px solid #f0f0f0', transform: 'rotate(45deg)' }}></div>
                          
                          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <Text strong>Omar Mohamed</Text>
                            <Text style={{ margin: '0 8px' }}>قام بإضافة منتج</Text>
                            <Text strong underline>book #000001</Text>
                          </div>
                          
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                            {[
                              'الاسم: book', 'سعر البيع: 25', 'الرقم التسلسلي: 000001', 'موظف: Omar Mohamed',
                              'الوصف: book', 'الضريبة الاولى: VAT', 'سعر الشراء: 23', 'تتبع المخزون: نعم',
                              'متوسط السعر: 23', 'النوع: منتج', 'أقل سعر بيع: 30', 'نوع الخصم: نسبة',
                              'الحالة: نشط', 'حقل نوع العنصر: GS1'
                            ].map(tag => (
                              <Tag key={tag} style={{ color: '#389e0d', backgroundColor: '#f6ffed', border: 'none', padding: '4px 8px', fontSize: '13px' }}>{tag}</Tag>
                            ))}
                          </div>
                          
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                            <Tag style={{ backgroundColor: '#fff0f6', color: '#eb2f96', border: 'none', borderRadius: '16px', padding: '2px 8px', display: 'flex', alignItems: 'center' }}>
                              Omar Mohamed <span style={{ backgroundColor: '#eb2f96', color: '#fff', borderRadius: '50%', width: '16px', height: '16px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginRight: '8px', fontSize: '10px' }}>O</span>
                            </Tag>
                            <Tag style={{ backgroundColor: '#e9ecef', color: '#8c8c8c', border: 'none', borderRadius: '16px', padding: '2px 8px', display: 'flex', alignItems: 'center' }}>
                               <span>05:06:05</span> <ClockCircleOutlined style={{ marginRight: '8px' }} />
                            </Tag>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              key: 'variants',
              label: 'المتغيرات',
              children: (
                <div style={{ padding: '24px', backgroundColor: '#fff' }}>
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsVariantModalOpen(true)} style={{ marginBottom: 16 }}>
                    إضافة متغير
                  </Button>
                  <Table columns={variantColumns} dataSource={variants || []} rowKey="id" loading={variantsLoading} bordered />
                </div>
              )
            }
          ]}
        />
      </div>

      <Modal
        title="إضافة متغير جديد"
        open={isVariantModalOpen}
        onCancel={() => setIsVariantModalOpen(false)}
        onOk={() => variantForm.submit()}
        confirmLoading={createVariantMutation.isPending}
        okText="إضافة"
        cancelText="إلغاء"
      >
        <Form form={variantForm} layout="vertical" onFinish={handleCreateVariant} dir="rtl">
          <Form.Item label="الاسم (مثال: أحمر - L)" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="SKU" name="sku">
            <Input />
          </Form.Item>
          <Form.Item label="الباركود" name="barcode">
            <Input />
          </Form.Item>
          <Form.Item label="السعر" name="price">
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item label="التكلفة" name="cost">
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item label="اللون" name={['attributes', 'color']}>
            <Input placeholder="مثال: أحمر" />
          </Form.Item>
          <Form.Item label="الحجم" name={['attributes', 'size']}>
            <Input placeholder="مثال: L, XL" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}