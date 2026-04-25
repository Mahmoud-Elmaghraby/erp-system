import { Form, Input, InputNumber, Select, Switch, Row, Col, Card, Upload, Button, message, Tabs } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { inventoryApi } from '../../api/inventory.api';
import { useQuery } from '@tanstack/react-query';

interface Props {
  initialValues?: any;
  onSubmit: (values: any) => void;
  loading: boolean;
  onCancel: () => void;
}

export default function ProductForm({ initialValues, onSubmit, loading, onCancel }: Props) {
  const [form] = Form.useForm();
  const { data: categories } = useCategories();
  
  // Assuming a generic API for brands if available, or just mocking/using categories API pattern
  const { data: brands } = useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      // Mocking or fetching brands. If inventoryApi doesn't have brands, it will be handled gracefully
      try {
        if ((inventoryApi as any).brands) {
          const res = await (inventoryApi as any).brands.getAll();
          return res.data;
        }
        return []; // Fallback
      } catch (e) {
        return [];
      }
    }
  });

  const { data: warehouses } = useQuery({
    queryKey: ['warehouses'],
    queryFn: async () => {
      try {
        const res = await inventoryApi.warehouses.getAll();
        return res?.data ?? res ?? [];
      } catch (e) {
        return [];
      }
    }
  });

  const [imageUrl, setImageUrl] = useState<string | undefined>(initialValues?.image);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      if (initialValues.image) {
        setImageUrl(initialValues.image);
      }
    } else {
      form.setFieldsValue({
        isActive: true,
        price: 0,
        cost: 0,
        taxAmount: 0,
        discountPercentage: 0,
        discountAmount: 0,
        stock: 0,
        quantity: 0,
        reserved: 0,
        available: 0,
        reorderPoint: 0,
        reorderQuantity: 0,
      });
    }
  }, [initialValues, form]);

  const handleValuesChange = (changedValues: any, allValues: any) => {
    // Auto calculations
    const price = allValues.price || 0;
    
    if (changedValues.price !== undefined || changedValues.discountPercentage !== undefined) {
      const discountPercentage = allValues.discountPercentage || 0;
      const discountAmount = (price * discountPercentage) / 100;
      form.setFieldsValue({ discountAmount });
    }

    if (changedValues.tax !== undefined || changedValues.price !== undefined) {
      const tax = allValues.tax || 0;
      const taxAmount = (price * tax) / 100;
      form.setFieldsValue({ taxAmount });
    }
  };

  const handleFinish = (values: any) => {
    onSubmit({ ...values, image: imageUrl });
  };

  const uploadProps = {
    beforeUpload: (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      return false; // Prevent actual upload
    },
    showUploadList: false,
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      onValuesChange={handleValuesChange}
      dir="rtl"
    >
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16, gap: 8 }}>
        <Button onClick={onCancel} disabled={loading} style={{ fontWeight: 600, color: '#001529', borderColor: '#001529' }}>
          إلغاء
        </Button>
        <Button type="primary" htmlType="submit" loading={loading} style={{ backgroundColor: '#001529', borderColor: '#001529', fontWeight: 600 }}>
          {initialValues ? 'حفظ التعديلات' : 'إضافة المنتج'}
        </Button>
      </div>

      <style>{`
        .dark-blue-tabs .ant-tabs-ink-bar {
          background: #001529 !important;
        }
        .dark-blue-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
          color: #001529 !important;
        }
        .dark-blue-tabs .ant-tabs-tab:hover {
          color: #00284d !important;
        }
      `}</style>

      <Tabs
        className="dark-blue-tabs"
        items={[
          {
            key: 'details',
            label: 'تفاصيل المنتج',
            children: (
              <Card bordered={false} style={{ marginBottom: 24, borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Form.Item label="صورة المنتج" name="image">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        {imageUrl && (
                          <img
                            src={imageUrl}
                            alt="Product"
                            style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8, border: '1px solid #d9d9d9' }}
                          />
                        )}
                        <Upload {...uploadProps}>
                          <Button icon={<UploadOutlined />}>اختر صورة</Button>
                        </Upload>
                      </div>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="اسم المنتج"
                      name="name"
                      rules={[{ required: true, message: 'هذا الحقل مطلوب' }]}
                    >
                      <Input placeholder="اسم المنتج" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="الحالة"
                      name="isActive"
                      rules={[{ required: true, message: 'هذا الحقل مطلوب' }]}
                      valuePropName="checked"
                    >
                      <Switch checkedChildren="نشط" unCheckedChildren="معطل" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item label="باركود المنتج" name="barcode" tooltip="يتم إنشاؤه تلقائيًا إذا ترك فارغًا">
                      <Input placeholder="الباركود" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item label="رمز المنتج (SKU)" name="sku" tooltip="يتم إنشاؤه تلقائيًا إذا ترك فارغًا">
                      <Input placeholder="SKU" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="الفئة"
                      name="categoryId"
                      rules={[{ required: true, message: 'هذا الحقل مطلوب' }]}
                    >
                      <Select
                        allowClear
                        placeholder="اختر الفئة"
                        options={(categories as any[] ?? []).map((c: any) => ({ label: c.name, value: c.id }))}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="العلامة التجارية"
                      name="brandId"
                      rules={[{ required: true, message: 'هذا الحقل مطلوب' }]}
                    >
                      <Select
                        allowClear
                        placeholder="اختر العلامة التجارية"
                        options={(brands as any[] ?? []).map((b: any) => ({ label: b.name, value: b.id }))}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Form.Item label="وصف المنتج" name="description">
                      <Input.TextArea rows={4} placeholder="اكتب وصفًا للمنتج..." />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            ),
          },
          {
            key: 'pricing',
            label: 'تفاصيل التسعير',
            children: (
              <Card bordered={false} style={{ marginBottom: 24, borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="سعر البيع"
                      name="price"
                      rules={[{ required: true, message: 'هذا الحقل مطلوب' }]}
                    >
                      <InputNumber style={{ width: '100%' }} min={0} />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item
                      label="تكلفة المنتج"
                      name="cost"
                      rules={[{ required: true, message: 'هذا الحقل مطلوب' }]}
                    >
                      <InputNumber style={{ width: '100%' }} min={0} />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item label="أقل سعر للبيع" name="lowestPrice">
                      <InputNumber style={{ width: '100%' }} min={0} />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item label="ضريبة (%)" name="tax">
                      <InputNumber style={{ width: '100%' }} min={0} max={100} />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item label="قيمة الضريبة" name="taxAmount">
                      <InputNumber style={{ width: '100%' }} min={0} disabled />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item label="نسبة الخصم (%)" name="discountPercentage">
                      <InputNumber style={{ width: '100%' }} min={0} max={100} />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item label="قيمة الخصم" name="discountAmount">
                      <InputNumber style={{ width: '100%' }} min={0} disabled />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            ),
          },
          {
            key: 'inventory',
            label: 'إدارة المخزون',
            children: (
              <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Form.Item name="trackInventory" valuePropName="checked">
                      <Switch checkedChildren="تتبع المخزون مفعل" unCheckedChildren="بدون تتبع" />
                    </Form.Item>
                  </Col>

                  {/* We use Form.Item dependencies to conditionally render these fields */}
                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) => prevValues.trackInventory !== currentValues.trackInventory}
                  >
                    {({ getFieldValue }) =>
                      getFieldValue('trackInventory') ? (
                        <>
                          <Col xs={24} md={12}>
                            <Form.Item label="نوع التتبع" name="trackingType" rules={[{ required: true, message: 'هذا الحقل مطلوب' }]}>
                              <Select placeholder="اختر نوع التتبع">
                                <Select.Option value="serial">الرقم التسلسلي</Select.Option>
                                <Select.Option value="batch">رقم الشحنة</Select.Option>
                                <Select.Option value="expiration">تاريخ الانتهاء</Select.Option>
                                <Select.Option value="batch_expiration">رقم الشحنة وتاريخ الانتهاء</Select.Option>
                                <Select.Option value="quantity">الكمية فقط</Select.Option>
                              </Select>
                            </Form.Item>
                          </Col>

                          <Col xs={24} md={12}>
                            <Form.Item label="المستودع" name="warehouseId" rules={[{ required: true, message: 'هذا الحقل مطلوب' }]}>
                              <Select
                                allowClear
                                placeholder="اختر المستودع"
                                options={(warehouses as any[] ?? []).map((w: any) => ({ label: w.name, value: w.id }))}
                              />
                            </Form.Item>
                          </Col>

                          <Col xs={24} md={8}>
                            <Form.Item label="الكمية بالمخزون" name="stockQuantity">
                              <InputNumber style={{ width: '100%' }} min={0} />
                            </Form.Item>
                          </Col>

                          <Col xs={24} md={8}>
                            <Form.Item label="نقطة إعادة الطلب" name="reorderPoint">
                              <InputNumber style={{ width: '100%' }} min={0} />
                            </Form.Item>
                          </Col>

                          <Col xs={24} md={8}>
                            <Form.Item label="كمية إعادة الطلب" name="reorderQuantity">
                              <InputNumber style={{ width: '100%' }} min={0} />
                            </Form.Item>
                          </Col>
                        </>
                      ) : null
                    }
                  </Form.Item>
                </Row>
              </Card>
            ),
          },
        ]}
      />
    </Form>
  );
}