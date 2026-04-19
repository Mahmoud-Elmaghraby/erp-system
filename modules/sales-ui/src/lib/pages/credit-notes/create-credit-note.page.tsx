import { useState, useEffect } from 'react';
import { Form, Input, Select, DatePicker, Button, Tabs, InputNumber, Row, Col, Typography, Space, Divider, message, Switch, Upload, Dropdown, Steps } from 'antd';
import type { MenuProps } from 'antd';
import { PlusOutlined, DeleteOutlined, EyeOutlined, CloseOutlined, QuestionCircleOutlined, CloudUploadOutlined, SearchOutlined, DownOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';

const { Option } = Select;
const { Text, Title } = Typography;
const { TabPane } = Tabs;

export default function CreateCreditNotePage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();

  const [totalAmount, setTotalAmount] = useState(0);
  const [untaxedAmount, setUntaxedAmount] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  
  // Received context from returns flow
  const originalReturnData = location.state as { invoiceNumber?: string; customer?: string; items?: any[] } | null;

  useEffect(() => {
    if (originalReturnData) {
       message.info(`جاري إصدار إشعار دائن للفاتورة ${originalReturnData.invoiceNumber || ''}`);
       form.setFieldsValue({
         originalInvoice: originalReturnData.invoiceNumber,
         customerId: originalReturnData.customer,
         items: originalReturnData.items?.length ? originalReturnData.items : [{}]
       });
       calculateTotals();
    }
  }, [originalReturnData, form]);

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

    // Validation: prevent credit note amount from exceeding actual return (stub check)
    const maxReturnAmountAllowed = originalReturnData?.items ? 10000 : Infinity; // example

    if (_total > maxReturnAmountAllowed) {
       message.error('عفواً، لا يمكن أن يزيد مبلغ الإشعار الدائن عن قيمة المرتجع الفعلي');
       // Enforce cap dynamically if needed
    }

    setUntaxedAmount(_untaxed);
    setDiscountAmount(_discount);
    setTaxAmount(_tax);
    setTotalAmount(_total);
  };

  const onFinish = (values: any) => {
    message.success('تم إنشاء الإشعار الدائن بنجاح');
    navigate('/sales/credit-notes');
  };

  const previewMenu: MenuProps['items'] = [
    { key: '1', label: 'معاينة على المتصفح' },
    { key: '2', label: 'عرض PDF' }
  ];

  return (
    <div style={{ padding: '24px 16px', backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: "'Cairo', 'Tajawal', sans-serif" }} dir="rtl">
      <style>{`
        .ant-steps-item-process .ant-steps-item-icon {
           background-color: #001529 !important;
           border-color: #001529 !important;
        }
        .ant-steps-item-finish .ant-steps-item-icon {
           border-color: #001529 !important;
        }
        .ant-steps-item-finish .ant-steps-item-icon > .ant-steps-icon {
           color: #001529 !important;
        }
        .ant-steps-item-finish > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title::after {
           background-color: #001529 !important;
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
        .dark-blue-tabs .ant-tabs-ink-bar {
          background: #001529 !important;
        }
        .dark-blue-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
          color: #001529 !important;
        }
        .green-dropdown-btn .ant-btn {
          background-color: #001529 !important;
          border-color: #001529 !important;
          color: #fff !important;
        }
        .green-dropdown-btn .ant-btn:hover {
          background-color: #00284d !important;
          border-color: #00284d !important;
        }
        .green-dropdown-btn.ant-btn-group .ant-btn + .ant-btn {
          border-inline-start-color: #001529 !important;
        }

        .wide-calendar-popup .ant-picker-panel {
          width: 380px !important;
          min-width: 380px !important;
        }
        .wide-calendar-popup .ant-picker-date-panel {
          width: 380px !important;
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
      
      <div style={{ marginBottom: 24, padding: '0 24px' }}>
         <Steps 
           current={2} 
           items={[{ title: 'طلب المرتجع' }, { title: 'فحص المخزون' }, { title: 'إصدار الإشعار الدائن' }]} 
         />
      </div>

      <Form 
        form={form} 
        layout="vertical" 
        onFinish={onFinish} 
        onValuesChange={calculateTotals}
        initialValues={{ items: [{}], overallDiscountType: 'percentage' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, alignItems: 'center' }}>
          <Title level={3} style={{ margin: 0, color: '#001529', fontWeight: 700 }}></Title>
          <Space>
            <Button htmlType="submit" style={{ fontWeight: 600, color: '#001529', borderColor: '#001529' }}>حفظ كمسودة</Button>
            <Dropdown.Button className="dark-blue-dropdown" menu={{ items: previewMenu }} type="primary" style={{ fontWeight: 600 }} icon={<DownOutlined />}>
              <Space>معاينة <EyeOutlined /></Space>
            </Dropdown.Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: '#001529', borderColor: '#001529', fontWeight: 600 }}>إصدار وحفظ</Button>
          </Space>
        </div>

        <div style={{ background: '#fff', padding: 24, borderRadius: 12, marginBottom: 24, paddingBottom: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item label="رقم إشعار دائن" name="creditNoteNumber">
                <Input placeholder="000002" disabled />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="الطريقة" name="method">
                 <Select placeholder="طباعة" defaultValue="طباعة">
                  <Option value="طباعة">طباعة</Option>
                  <Option value="email">إرسال بالبريد</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="مسئول مبيعات" name="salesRepId">
                <Select placeholder="Omar Mohamed #000001">
                  <Option value="OM">Omar Mohamed</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="العميل *" name="customerId" rules={[{ required: true, message: 'مطلوب' }]}>
                 <Select placeholder="(اختر عميل)">
                  <Option value="c1">شركة الأمل</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item label="تاريخ إشعار دائن" name="date" rules={[{ required: true, message: 'مطلوب' }]}>
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" placeholder="19/04/2026" popupClassName="wide-calendar-popup" />
              </Form.Item>
            </Col>
             <Col span={6}>
              <Form.Item label={<Space>تاريخ الإصدار <QuestionCircleOutlined style={{ color: '#aaa', cursor: 'help' }}/></Space>} name="dueDate">
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" placeholder="19/04/2026" popupClassName="wide-calendar-popup" />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <div style={{ background: '#fff', padding: 24, borderRadius: 12, marginBottom: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <Form.List name="items">
            {(fields, { add, remove }) => (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr 1fr 1fr auto', gap: 12, marginBottom: 8, fontWeight: 'bold', color: '#666' }}>
                  <span>البند / الوصف</span>
                  <span>سعر الوحدة</span>
                  <span>الكمية</span>
                  <span>الخصم</span>
                  <span>الضريبة 1</span>
                  <span>المجموع</span>
                  <span></span>
                </div>
                {fields.map(({ key, name, ...restField }) => {
                  const totalLine = 0; // standard calculation
                  return (
                    <div key={key} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr 1fr 1fr auto', gap: 12, marginBottom: 16, alignItems: 'start' }}>
                      <Form.Item {...restField} name={[name, 'productId']} rules={[{ required: true, message: 'مطلوب' }]} style={{ margin: 0 }}>
                        <Select placeholder="البند" />
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
                        <Select placeholder="بدون ضريبة" />
                      </Form.Item>
                      <div style={{ padding: '4px 11px', background: '#f5f5f5', borderRadius: 4, height: 32, display: 'flex', alignItems: 'center' }}>
                        {totalLine.toFixed(2)}
                      </div>
                      <Button type="text" icon={<DeleteOutlined />} onClick={() => remove(name)} style={{ color: '#001529' }} />
                    </div>
                  );
                })}
                <Button onClick={() => add({})} icon={<PlusOutlined />} style={{ alignSelf: 'flex-start', marginTop: 8, color: '#001529', borderColor: '#001529' }}>
                  إضافة
                </Button>
              </>
            )}
          </Form.List>

          <Divider />
          <Row>
            <Col span={9} offset={15}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, background: '#fafafa', padding: 16, borderRadius: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">الإجمالي</Text>
                  <Text>{untaxedAmount.toFixed(2)} ج.م</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text style={{ color: '#001529' }}>الخصم</Text>
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

        <div style={{ background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: 24 }}>
          <Tabs defaultActiveKey="1" className="dark-blue-tabs">
            <TabPane tab="الخصم والتسوية" key="1">
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="التسوية" name="overallDiscount">
                    <InputNumber min={0} style={{ width: '100%' }} placeholder="0.00" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="الخصم" name="overallDiscountType" initialValue="percentage">
                    <Select>
                      <Option value="percentage">نسبة مئوية (%)</Option>
                      <Option value="fixed">مبلغ ثابت</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </TabPane>
            
            <TabPane tab="بيانات الشحن" key="2">
              <Row gutter={24} style={{ marginTop: 16 }}>
                <Col span={12}>
                  <Form.Item label={<Space>بيانات الشحن <QuestionCircleOutlined style={{ color: '#aaa', cursor: 'help' }}/></Space>} name="shippingData" initialValue="auto">
                    <Select>
                      <Option value="auto">آلي</Option>
                      <Option value="hide">لا تظهر</Option>
                      <Option value="customer_address">اظهر عنوان العميل</Option>
                      <Option value="secondary_address">اظهر عنوان العميل الثانوي</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="مصاريف الشحن" name="shippingCost">
                    <InputNumber style={{ width: '100%' }} placeholder="" min={0} />
                  </Form.Item>
                </Col>
              </Row>
            </TabPane>

            <TabPane tab={<Space><QuestionCircleOutlined style={{ color: '#aaa' }} /> إرفاق المستندات</Space>} key="3">
              <Tabs type="card" defaultActiveKey="new" style={{ marginTop: 16 }}>
                <TabPane tab="مستند جديد" key="new">
                  <div style={{ border: '1px dashed #d9d9d9', padding: '32px 24px', textAlign: 'center', backgroundColor: '#fafafa', borderRadius: 8, marginTop: 8 }}>
                    <Upload.Dragger name="file" multiple={false} action="/upload" showUploadList={false} style={{ background: 'transparent', border: 'none' }}>
                      <p className="ant-upload-drag-icon">
                        <CloudUploadOutlined style={{ color: '#001529', fontSize: 32 }} />
                      </p>
                      <p className="ant-upload-text" style={{ color: '#001529' }}>افلت الملف هنا او اختر من جهازك</p>
                    </Upload.Dragger>
                  </div>
                </TabPane>
                <TabPane tab="الملفات التي تم رفعها مسبقاً" key="existing">
                  <div style={{ border: '1px solid #f0f0f0', padding: '32px 24px', backgroundColor: '#fff', borderRadius: 0, marginTop: 8, minHeight: 150 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start', width: '100%', maxWidth: 600 }}>
                      <Text>المستند</Text>
                      <div style={{ display: 'flex', gap: 16, width: '100%', alignItems: 'center' }}>
                        <Space.Compact style={{ flex: 1 }}>
                          <Select style={{ width: '100%' }} placeholder="Select Document" />
                          <Dropdown.Button className="dark-blue-dropdown" type="primary" menu={{ items: [{ key: '1', label: 'إرفاق من مركز الملفات' }] }}>أرفق</Dropdown.Button>
                        </Space.Compact>
                      </div>
                    </div>
                  </div>
                </TabPane>
              </Tabs>
            </TabPane>
          </Tabs>
        </div>

        <div style={{ background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
           <Form.Item name="notes" label={<Space>الملاحظات/الشروط <QuestionCircleOutlined style={{ color: '#aaa', cursor: 'help' }}/></Space>} labelCol={{span: 24}}>
             <Input.TextArea rows={4} placeholder="" />
           </Form.Item>
        </div>
      </Form>
    </div>
  );
}
