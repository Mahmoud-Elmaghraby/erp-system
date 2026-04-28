import { useState, useEffect } from 'react';
import { Form, Input, Select, DatePicker, Button, Tabs, InputNumber, Row, Col, Typography, Space, Divider, message, Switch, Upload, Dropdown, Spin } from 'antd';
import type { MenuProps } from 'antd';
import { PlusOutlined, DeleteOutlined, EyeOutlined, CloseOutlined, QuestionCircleOutlined, CloudUploadOutlined, DownOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/ar';
import updateLocale from 'dayjs/plugin/updateLocale';
import { useQuery } from '@tanstack/react-query';
import { useCustomers } from '../../hooks/useCustomers';
import { useUpdateDirectInvoice } from '../../hooks/useInvoices';
import { useProducts } from '@org/inventory-ui';
import { salesApi } from '../../api/sales.api';

dayjs.extend(updateLocale);
dayjs.updateLocale('ar', {
  weekStart: 6,
  weekdaysMin: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
});

const { Option } = Select;
const { Text, Title } = Typography;
const { TabPane } = Tabs;

interface SelectEntity {
  id: string;
  name: string;
}

interface ProductEntity extends SelectEntity {
  price?: number | string | null;
}

interface InvoiceItemForm {
  productId?: string;
  quantity?: number | string;
  unitPrice?: number | string;
  discount?: number | string;
  tax?: number | string;
  taxId?: string;
}

interface InvoiceFormValues {
  items?: InvoiceItemForm[];
  [key: string]: unknown;
}

export default function EditInvoicePage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [totalAmount, setTotalAmount] = useState(0);
  const [untaxedAmount, setUntaxedAmount] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);

  const { data: customers } = useCustomers();
  const { data: products } = useProducts();
  const updateMutation = useUpdateDirectInvoice?.();

  // Get branchId from user context
  const userStr = localStorage.getItem('erp_user');
  const user = userStr ? JSON.parse(userStr) : null;
  const branchId = user?.branchId || '';

  // Fetch existing invoice
  const { data: queryData, isLoading } = useQuery({
    queryKey: ['invoice', id],
    queryFn: () => salesApi.invoices.getById(id as string),
    enabled: !!id,
  });

  const invoice = (queryData as any)?.data || queryData;

  useEffect(() => {
    if (invoice) {
      const formData = {
        invoiceNumber: invoice.invoiceNumber,
        date: invoice.dateTimeIssued ? dayjs(invoice.dateTimeIssued) : undefined,
        customerId: invoice.customer?.id || invoice.order?.customer?.id,
        salesRepId: invoice.salesRepId,
        paymentTerms: invoice.paymentTerms,
        paymentStatus: invoice.status === 'DRAFT' ? 'UNPAID' : (invoice.status ?? 'UNPAID'),
        notes: invoice.notes,
        overallDiscount: invoice.overallDiscount || 0,
        overallDiscountType: invoice.overallDiscountType || 'percentage',
        advancePayment: invoice.advancePayment || 0,
        advancePaymentType: invoice.advancePaymentType || 'amount',
        shippingDetails: invoice.shippingDetails || 'auto',
        shippingCost: invoice.shippingCost || 0,
        items: invoice.items?.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount || 0,
          tax: item.tax || 0,
          taxId: item.taxId,
        })) || [],
      };
      form.setFieldsValue(formData);
      calculateTotals();
    }
  }, [invoice, form]);

  const calculateTotals = () => {
    const items = (form.getFieldValue('items') || []) as InvoiceItemForm[];
    let _untaxed = 0;
    let _tax = 0;
    let _discount = 0;

    items.forEach((item) => {
      const q = Number(item?.quantity || 0);
      const p = Number(item?.unitPrice || 0);
      const d = Number(item?.discount || 0);
      const t = Number(item?.tax || 0);

      const subtotal = q * p;
      const itemDiscount = (subtotal * d) / 100;
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
    const productList = ((products as ProductEntity[] | undefined) ?? []);
    const product = productList.find((p) => p.id === productId);
    if (product) {
      const items = (form.getFieldValue('items') || []) as InvoiceItemForm[];
      items[name] = { 
        ...items[name], 
        unitPrice: Number(product.price ?? 0),
        quantity: 1,
        tax: 0
      };
      form.setFieldsValue({ items });
      calculateTotals();
    }
  };

  const onFinish = (values: InvoiceFormValues) => {
    const payload = {
      customerId: values.customerId as string,
      branchId,
      date: values.date ? (values.date as any).format?.('YYYY-MM-DD') : undefined,
      currency: 'EGP',
      notes: values.notes as string,
      paymentTerms: values.paymentTerms as number,
      salesRepId: values.salesRepId as string,
      untaxedAmount,
      taxAmount,
      discountAmount,
      totalAmount,
      overallDiscount: values.overallDiscount as number,
      overallDiscountType: values.overallDiscountType as string,
      advancePayment: values.advancePayment as number,
      advancePaymentType: values.advancePaymentType as string,
      shippingDetails: values.shippingDetails as string,
      shippingCost: values.shippingCost as number,
      paymentStatus: values.paymentStatus as string,
      saveMode: 'confirm',
      items: values.items?.map((item) => ({
        productId: item.productId,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        discount: Number(item.discount || 0),
        tax: Number(item.tax || 0),
        taxId: item.taxId,
        total: (Number(item.quantity) * Number(item.unitPrice)) * (1 - Number(item.discount || 0)/100) * (1 + Number(item.tax || 0)/100)
      })) ?? []
    };

    updateMutation?.mutate({ id: id as string, data: payload }, {
      onSuccess: () => {
        message.success('تم تحديث الفاتورة بنجاح');
        navigate('/sales/invoices');
      }
    });
  };

  const previewMenu: MenuProps['items'] = [
    {
      key: '1',
      label: 'معاينة على المتصفح',
    },
    {
      key: '2',
      label: 'عرض PDF',
    },
  ];

  const saveMenu: MenuProps['items'] = [
    {
      key: '1',
      label: 'حفظ وطباعة',
    },
  ];

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }} dir="rtl">
        <Title level={4}>الفاتورة غير موجودة</Title>
        <Button onClick={() => navigate('/sales/invoices')}>العودة للفواتير</Button>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px 16px', backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: "'Cairo', 'Tajawal', sans-serif" }} dir="rtl">
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
        .dark-blue-dropdown .ant-btn {
          background-color: #001529 !important;
          border-color: #001529 !important;
          color: #fff !important;
        }
        .dark-blue-dropdown .ant-btn:hover {
          background-color: #00284d !important;
          border-color: #00284d !important;
        }
        .dark-blue-dropdown .ant-btn::before,
        .dark-blue-dropdown .ant-btn::after {
          background-color: #00284d !important;
        }
        .dark-blue-dropdown.ant-btn-group .ant-btn + .ant-btn,
        .dark-blue-dropdown .ant-btn-group .ant-btn + .ant-btn {
          border-inline-start-color: #00284d !important;
          border-left-color: #00284d !important;
          border-right-color: #00284d !important;
        }
        .ant-tabs-ink-bar {
          background: #001529 !important;
        }
        .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
          color: #001529 !important;
        }
        .ant-tabs-tab:hover {
          color: #00284d !important;
        }
      `}</style>
      <Form 
        form={form} 
        layout="vertical" 
        onFinish={onFinish} 
        onValuesChange={calculateTotals}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, alignItems: 'center' }}>
          <Title level={3} style={{ margin: 0, color: '#001529', fontWeight: 700 }}>تعديل الفاتورة</Title>
          <Space>
            <Dropdown.Button className="dark-blue-dropdown" menu={{ items: saveMenu }} type="primary" htmlType="submit" style={{ fontWeight: 600 }} loading={updateMutation?.isPending}>
              حفظ دون طباعة
            </Dropdown.Button>
            <Dropdown.Button className="dark-blue-dropdown" menu={{ items: previewMenu }} type="primary" style={{ fontWeight: 600 }} icon={<DownOutlined />}>
              <Space>معاينة <EyeOutlined /></Space>
            </Dropdown.Button>
            <Button icon={<ArrowRightOutlined />} onClick={() => navigate('/sales/invoices')} style={{ fontWeight: 600, color: '#001529', borderColor: '#001529' }}>العودة</Button>
          </Space>
        </div>

        <div style={{ background: '#fff', padding: 24, borderRadius: 12, marginBottom: 24, paddingBottom: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="رقم الفاتورة" name="invoiceNumber">
                <Input placeholder="تلقائي" disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="التاريخ" name="date" rules={[{ required: true, message: 'مطلوب' }]}>
                <DatePicker style={{ width: '100%' }} placeholder="اختيار التاريخ" format="YYYY-MM-DD" popupClassName="wide-calendar-popup" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="مسئول المبيعات" name="salesRepId">
                <Select placeholder="اختر المسئول">
                  {/* Options would come from users/employees API */}
                </Select>
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
                  options={(((customers as SelectEntity[] | undefined) ?? []).map((c) => ({ label: c.name, value: c.id })))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<Space>شروط الدفع <QuestionCircleOutlined style={{ color: '#aaa', cursor: 'help' }}/></Space>} name="paymentTerms">
                <InputNumber style={{ width: '100%' }} min={0} addonBefore="أيام" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="حالة الدفع" name="paymentStatus" rules={[{ required: true, message: 'مطلوب' }]}>
                <Select placeholder="اختر حالة الدفع">
                  <Option value="unpaid">غير مدفوع</Option>
                  <Option value="partially_paid">مدفوع جزئياً</Option>
                  <Option value="paid">مدفوع</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </div>

        <div style={{ background: '#fff', padding: 24, borderRadius: 12, marginBottom: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
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

                  const allItems = form.getFieldValue('items') || [];
                  const selectedProductIds = allItems.map((item: InvoiceItemForm) => item.productId).filter(Boolean);
                  const currentProductId = form.getFieldValue(['items', name, 'productId']);
                  const isDuplicate = selectedProductIds.filter((id: string) => id === currentProductId).length > 1;

                  return (
                    <div key={key} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr 1fr 1fr auto', gap: 12, marginBottom: 16, alignItems: 'start' }}>
                      <Form.Item 
                        {...restField} 
                        name={[name, 'productId']} 
                        rules={[
                          { required: true, message: 'مطلوب' },
                          {
                            validator: async (_, value) => {
                              const items = form.getFieldValue('items') || [];
                              const count = items.filter((item: InvoiceItemForm, idx: number) => item.productId === value && idx !== name).length;
                              if (count > 0) {
                                return Promise.reject(new Error('هذا المنتج موجود بالفعل في الفاتورة'));
                              }
                              return Promise.resolve();
                            }
                          }
                        ]} 
                        style={{ margin: 0 }}
                      >
                        <Select
                          showSearch
                          placeholder="اختر العنصر"
                          filterOption={(input, option) => (option?.label as string)?.toLowerCase().includes(input.toLowerCase())}
                          options={(((products as ProductEntity[] | undefined) ?? []).map((p) => ({ label: p.name, value: p.id })))}
                          onChange={(val) => handleProductChange(val, name)}
                          status={isDuplicate ? 'error' : undefined}
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
                      <Button type="text" icon={<DeleteOutlined />} onClick={() => remove(name)} style={{ color: '#001529' }} />
                    </div>
                  );
                })}
                <Button onClick={() => add({})} icon={<PlusOutlined />} style={{ alignSelf: 'flex-start', marginTop: 8, color: '#001529', borderColor: '#001529' }}>
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
                  <Text style={{ color: '#001529' }}>إجمالي الخصم</Text>
                  <Text style={{ color: '#001529' }}>({discountAmount.toFixed(2)}) ج.م</Text>
                </div>
                <Divider style={{ margin: '8px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text strong style={{ fontSize: 18 }}>الإجمالي الكلي</Text>
                  <Text strong style={{ fontSize: 18, color: '#001529' }}>{totalAmount.toFixed(2)} ج.م</Text>
                </div>
              </div>
            </Col>
          </Row>
        </div>

        <div style={{ background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <Tabs defaultActiveKey="1" className="dark-blue-tabs">
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
          </Tabs>
        </div>
      </Form>
    </div>
  );
}
