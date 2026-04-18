import { useState } from 'react';
import { Form, Input, Select, DatePicker, Button, Tabs, InputNumber, Row, Col, Typography, Space, Divider, message, Switch, Upload } from 'antd';
import { PlusOutlined, DeleteOutlined, SaveOutlined, PrinterOutlined, EyeOutlined, CloseOutlined, QuestionCircleOutlined, CloudUploadOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/ar';
import updateLocale from 'dayjs/plugin/updateLocale';
import { useCustomers } from '../../hooks/useCustomers';
import { useCreateInvoice } from '../../hooks/useInvoices';
import { useProducts } from '@org/inventory-ui'; // Assuming this exists based on order-form.tsx

dayjs.extend(updateLocale);
dayjs.updateLocale('ar', {
  weekStart: 6,
  weekdaysMin: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
});

const { Option } = Select;
const { Text, Title } = Typography;
const { TabPane } = Tabs;

export default function CreateInvoicePage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [totalAmount, setTotalAmount] = useState(0);
  const [untaxedAmount, setUntaxedAmount] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);

  const { data: customers } = useCustomers();
  const { data: products } = useProducts();
  const createMutation = useCreateInvoice();

  const calculateTotals = () => {
    const items = form.getFieldValue('items') || [];
    let _untaxed = 0;
    let _tax = 0;
    let _discount = 0;

    items.forEach((item: any) => {
      const q = Number(item?.quantity || 0);
      const p = Number(item?.unitPrice || 0);
      const d = Number(item?.discount || 0);
      const t = Number(item?.tax || 0);

      const subtotal = q * p;
      const itemDiscount = (subtotal * d) / 100; // Assuming discount is percentage
      const afterDiscount = subtotal - itemDiscount;
      const itemTax = (afterDiscount * t) / 100;

      _untaxed += subtotal;
      _discount += itemDiscount;
      _tax += itemTax;
    });

    const overallDiscountVal = Number(form.getFieldValue('overallDiscount') || 0);
    const overallDiscountType = form.getFieldValue('overallDiscountType') || 'percentage';
    
    let additionalDiscount = 0;
    if (overallDiscountType === 'percentage') {
      additionalDiscount = ((_untaxed - _discount) * overallDiscountVal) / 100;
    } else {
      additionalDiscount = overallDiscountVal;
    }

    _discount += additionalDiscount;
    const _total = _untaxed - _discount + _tax;

    setUntaxedAmount(_untaxed);
    setDiscountAmount(_discount);
    setTaxAmount(_tax);
    setTotalAmount(_total);
  };

  const handleProductChange = (productId: string, name: number) => {
    const product = (products as any[] ?? []).find((p: any) => p.id === productId);
    if (product) {
      const items = form.getFieldValue('items');
      items[name] = { 
        ...items[name], 
        unitPrice: Number(product.price ?? 0),
        tax: 14 // standard tax rate example
      };
      form.setFieldsValue({ items });
      calculateTotals();
    }
  };

  const onFinish = (values: any) => {
    const payload = {
      ...values,
      untaxedAmount,
      taxAmount,
      discountAmount,
      totalAmount,
      items: values.items?.map((item: any) => ({
        productId: item.productId,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        discount: Number(item.discount || 0),
        taxId: item.taxId, // if mapping to DB
        total: (Number(item.quantity) * Number(item.unitPrice)) * (1 - Number(item.discount || 0)/100) * (1 + Number(item.tax || 0)/100)
      })) ?? []
    };

    createMutation.mutate(payload, {
      onSuccess: () => {
        message.success('تم الحفظ بنجاح');
        navigate('/sales/invoices');
      }
    });
  };

  return (
    <div style={{ padding: 24, backgroundColor: '#f0f2f5', minHeight: '100vh' }} dir="rtl">
      <style>{`
        .wide-calendar-popup .ant-picker-panel-container,
        .wide-calendar-popup .ant-picker-panel,
        .wide-calendar-popup .ant-picker-date-panel {
          width: 400px !important;
          min-width: 400px !important;
        }
        .wide-calendar-popup .ant-picker-body {
          padding: 8px 16px !important;
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
      <Form 
        form={form} 
        layout="vertical" 
        onFinish={onFinish} 
        onValuesChange={calculateTotals}
        initialValues={{ items: [{}], overallDiscountType: 'percentage' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' }}>
          <Title level={3} style={{ margin: 0 }}>فاتورة جديدة</Title>
          <Space>
            <Button icon={<PrinterOutlined />}>طباعة فاتورة</Button>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={createMutation.isPending}>حفظ وطباعة</Button>
            <Button htmlType="submit" icon={<SaveOutlined />}>حفظ كمسودة</Button>
            <Button icon={<EyeOutlined />}>معاينة</Button>
            <Button danger icon={<CloseOutlined />} onClick={() => navigate('/sales/invoices')}>الغاء</Button>
          </Space>
        </div>

        <div style={{ background: '#fff', padding: 24, borderRadius: 8, marginBottom: 16, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item label="رقم الفاتورة" name="invoiceNumber">
                <Input placeholder="تلقائي" disabled />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="التاريخ" name="date" rules={[{ required: true, message: 'مطلوب' }]}>
                <DatePicker style={{ width: '100%' }} placeholder="اختيار التاريخ" format="YYYY-MM-DD" popupClassName="wide-calendar-popup" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="مسئول المبيعات" name="salesRepId">
                <Select placeholder="اختر المسئول">
                  {/* Options would come from users/employees API */}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="تاريخ الإصدار / شروط الدفع" name="dueDate">
                <DatePicker style={{ width: '100%' }} placeholder="اختيار التاريخ" format="YYYY-MM-DD" popupClassName="wide-calendar-popup" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="اسم العميل" name="customerId" rules={[{ required: true, message: 'مطلوب' }]}>
                <Select
                  showSearch
                  placeholder="اختر العميل"
                  filterOption={(input, option) => (option?.label as string)?.toLowerCase().includes(input.toLowerCase())}
                  options={(customers as any[] ?? []).map((c: any) => ({ label: c.name, value: c.id }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="طريقة" name="method">
                <Select placeholder="الطريقة">
                  <Option value="print">طباعة</Option>
                  <Option value="email">إرسال بالبريد</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </div>

        <div style={{ background: '#fff', padding: 24, borderRadius: 8, marginBottom: 16, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <Form.List name="items">
            {(fields, { add, remove }) => (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr 1fr 1fr auto', gap: 12, marginBottom: 8, fontWeight: 'bold', color: '#666' }}>
                  <span>العنصر / الوصف</span>
                  <span>سعر الوحدة</span>
                  <span>الكمية</span>
                  <span>الخصم %</span>
                  <span>الضريبة 1 %</span>
                  <span>المجموع</span>
                  <span></span>
                </div>
                {fields.map(({ key, name, ...restField }) => {
                  const q = form.getFieldValue(['items', name, 'quantity']) || 0;
                  const p = form.getFieldValue(['items', name, 'unitPrice']) || 0;
                  const d = form.getFieldValue(['items', name, 'discount']) || 0;
                  const t = form.getFieldValue(['items', name, 'tax']) || 0;
                  
                  const sub = q * p;
                  const aftDisc = sub - (sub * d / 100);
                  const totalLine = aftDisc + (aftDisc * t / 100);

                  return (
                    <div key={key} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr 1fr 1fr auto', gap: 12, marginBottom: 16, alignItems: 'start' }}>
                      <Form.Item {...restField} name={[name, 'productId']} rules={[{ required: true, message: 'مطلوب' }]} style={{ margin: 0 }}>
                        <Select
                          showSearch
                          placeholder="اختر العنصر"
                          filterOption={(input, option) => (option?.label as string)?.toLowerCase().includes(input.toLowerCase())}
                          options={(products as any[] ?? []).map((p: any) => ({ label: p.name, value: p.id }))}
                          onChange={(val) => handleProductChange(val, name)}
                        />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'unitPrice']} rules={[{ required: true, message: 'مطلوب' }]} style={{ margin: 0 }}>
                        <InputNumber min={0} precision={2} style={{ width: '100%' }} />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'quantity']} rules={[{ required: true, message: 'مطلوب' }]} style={{ margin: 0 }}>
                        <InputNumber min={1} style={{ width: '100%' }} />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'discount']} style={{ margin: 0 }}>
                        <InputNumber min={0} max={100} style={{ width: '100%' }} />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'tax']} style={{ margin: 0 }}>
                        <InputNumber min={0} max={100} style={{ width: '100%' }} />
                      </Form.Item>
                      <div style={{ padding: '4px 11px', background: '#f5f5f5', borderRadius: 4, height: 32, display: 'flex', alignItems: 'center' }}>
                        {totalLine.toFixed(2)}
                      </div>
                      <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)} />
                    </div>
                  );
                })}
                <Button type="dashed" onClick={() => add({})} icon={<PlusOutlined />} style={{ alignSelf: 'flex-start', marginTop: 8 }}>
                  إضافة سطر
                </Button>
              </>
            )}
          </Form.List>

          <Divider />
          <Row>
            <Col span={14}>
              <Form.Item name="notes" label="الملاحظات/الشروط" labelCol={{span: 24}}>
                <Input.TextArea rows={4} placeholder="الملاحظات والشروط تظهر أسفل الفاتورة" />
              </Form.Item>
            </Col>
            <Col span={9} offset={1}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, background: '#fafafa', padding: 16, borderRadius: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">الإجمالي قبل الضريبة</Text>
                  <Text>{untaxedAmount.toFixed(2)} ج.م</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">الضريبة</Text>
                  <Text>{taxAmount.toFixed(2)} ج.م</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="danger">إجمالي الخصم</Text>
                  <Text type="danger">({discountAmount.toFixed(2)}) ج.م</Text>
                </div>
                <Divider style={{ margin: '8px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text strong style={{ fontSize: 18 }}>الإجمالي الكلي</Text>
                  <Text strong style={{ fontSize: 18, color: '#1890ff' }}>{totalAmount.toFixed(2)} ج.م</Text>
                </div>
              </div>
            </Col>
          </Row>
        </div>

        <div style={{ background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="الخصم والتسوية" key="1">
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="الخصم الإضافي" name="overallDiscount">
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="نوع الخصم" name="overallDiscountType" initialValue="percentage">
                    <Select>
                      <Option value="percentage">نسبة مئوية (%)</Option>
                      <Option value="fixed">مبلغ ثابت</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </TabPane>
            
            <TabPane tab="إيداع" key="2">
              <Row gutter={24}>
                <Col span={6}>
                  <Form.Item label={<Space>الدفعة المقدمة <QuestionCircleOutlined style={{ color: '#aaa', cursor: 'help' }}/></Space>} name="advancePayment">
                    <InputNumber min={0} style={{ width: '100%' }} placeholder="0" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item 
                    label={<Space>(مدفوع بالفعل) <QuestionCircleOutlined style={{ color: '#aaa', cursor: 'help' }}/> <Switch size="small" /></Space>} 
                    name="advancePaymentType" 
                    initialValue="amount"
                  >
                    <Select>
                      <Option value="amount">المبلغ</Option>
                      <Option value="percentage">نسبة مئوية (%)</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </TabPane>

            <TabPane tab="بيانات الشحن" key="3">
              <Row gutter={24}>
                <Col span={8}>
                  <Form.Item label={<Space>بيانات الشحن <QuestionCircleOutlined style={{ color: '#aaa', cursor: 'help' }}/></Space>} name="shippingDetails" initialValue="auto">
                    <Select>
                      <Option value="auto">آلي</Option>
                      <Option value="none">لا تظهر</Option>
                      <Option value="customer">اظهر عنوان العميل</Option>
                      <Option value="secondary">اظهر عنوان العميل الثانوي</Option>
                    </Select>
                  </Form.Item>
                </Col>
                 <Col span={8}>
                  <Form.Item label="مصاريف الشحن" name="shippingCost">
                    <Input style={{ width: '100%' }} placeholder="" />
                  </Form.Item>
                </Col>
              </Row>
            </TabPane>

            <TabPane tab={<Space><QuestionCircleOutlined style={{ color: '#aaa' }} /> إرفاق المستندات</Space>} key="4">
              <Tabs type="card" defaultActiveKey="new_doc" tabBarGutter={8} style={{ padding: '8px 0' }}>
                <TabPane tab="مستند جديد" key="new_doc">
                  <div style={{ marginTop: 16 }}>
                    <Form.Item label={<span style={{ fontWeight: 'bold' }}>المرفقات</span>} style={{ marginBottom: 0 }}>
                      <Upload.Dragger name="files" action="/upload.do" multiple style={{ padding: 24 }}>
                        <p className="ant-upload-drag-icon">
                          <CloudUploadOutlined style={{ fontSize: 32, color: '#1890ff' }} />
                        </p>
                        <p className="ant-upload-text" style={{ color: '#1890ff' }}>
                          افلت الملف هنا او اختر من جهازك
                        </p>
                      </Upload.Dragger>
                    </Form.Item>
                  </div>
                </TabPane>
                <TabPane tab="الملفات التي تم رفعها مسبقاً" key="pre_uploaded">
                  <div style={{ marginTop: 16, maxWidth: 600 }}>
                    <Form.Item label={<span style={{ fontWeight: 'bold' }}>المستند</span>}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Select placeholder="Select Document" style={{ flex: 1 }} />
                        <Button type="primary" style={{ backgroundColor: '#00b96b', borderColor: '#00b96b' }}>أرفق</Button>
                        <Button type="primary" icon={<SearchOutlined />} style={{ backgroundColor: '#00b96b', borderColor: '#00b96b' }}>بحث متقدم</Button>
                      </div>
                    </Form.Item>
                  </div>
                </TabPane>
              </Tabs>
            </TabPane>
          </Tabs>
        </div>
      </Form>
    </div>
  );
}
