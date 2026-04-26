import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Select, Switch, Button, ConfigProvider, Spin } from 'antd';
import { useWarehouse, useUpdateWarehouse } from '../../hooks/useWarehouses';

const { Option } = Select;
const { TextArea } = Input;

export default function EditWarehousePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('general');
  
  const { data: warehouse, isLoading } = useWarehouse(id as string);
  const updateMutation = useUpdateWarehouse();

  useEffect(() => {
    if (warehouse) {
      form.setFieldsValue(warehouse);
    }
  }, [warehouse, form]);

  // Watch the values to dynamically style the labels or switches if needed
  const isActive = Form.useWatch('isActive', form);
  const viewPerm = Form.useWatch(['permissions', 'view'], form);
  const createInvoicePerm = Form.useWatch(['permissions', 'createInvoice'], form);
  const updateStockPerm = Form.useWatch(['permissions', 'updateStock'], form);

  const onFinish = (values: any) => {
    // Filter out extra properties that might be injected by setFieldsValue
    const data = {
      name: values.name,
      address: values.address,
      isActive: values.isActive,
      isPrimary: values.isPrimary,
      permissions: values.permissions,
    };

    updateMutation.mutate(
      { id: id as string, data },
      {
        onSuccess: () => navigate(`/inventory/warehouses/${id}`),
      }
    );
  };

  const tabs = [
    { id: 'general', label: 'المعلومات العامة' },
    { id: 'permissions', label: 'صلاحيات الوصول' },
  ];

  if (isLoading) {
    return <div style={{ padding: 40, textAlign: 'center' }}><Spin size="large" /></div>;
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "'Cairo', 'Tajawal', sans-serif",
          colorPrimary: '#0f172a',
          colorBorder: '#e2e8f0',
          borderRadius: 8,
          controlHeight: 44,
          controlHeightLG: 44,
        },
        components: {
          Switch: {
            colorPrimary: '#3b82f6',
            colorPrimaryHover: '#2563eb',
          }
        }
      }}
    >
      <div dir="rtl" style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        padding: '32px',
        fontFamily: "'Cairo', 'Tajawal', sans-serif"
      }}>
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={onFinish}
        >
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#1e293b' }}>
              تعديل المستودع
            </h1>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button 
                onClick={() => navigate(`/inventory/warehouses/${id}`)}
                style={{ 
                  height: '44px', 
                  padding: '0 24px', 
                  borderRadius: '8px', 
                  fontWeight: 600,
                  borderColor: '#cbd5e1',
                  color: '#475569',
                  backgroundColor: '#ffffff'
                }}
              >
                إلغاء
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={updateMutation.isPending}
                style={{ 
                  height: '44px', 
                  padding: '0 24px', 
                  borderRadius: '8px', 
                  fontWeight: 600,
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  border: 'none'
                }}
              >
                حفظ التعديلات
              </Button>
            </div>
          </div>

          {/* Tabs System */}
          <div style={{ display: 'flex', gap: '32px', borderBottom: '1px solid #e2e8f0', marginBottom: '32px' }}>
            {tabs.map((tab) => (
              <div 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  paddingBottom: '12px',
                  cursor: 'pointer',
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  color: activeTab === tab.id ? '#0f172a' : '#64748b',
                  borderBottom: activeTab === tab.id ? '2px solid #0f172a' : '2px solid transparent',
                  transition: 'all 0.2s ease',
                  fontSize: '15px'
                }}
              >
                {tab.label}
              </div>
            ))}
          </div>

          {/* Form Card */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
            padding: '32px',
          }}>
            
            {activeTab === 'general' && (
              <>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', marginBottom: '24px' }}>
                  تفاصيل المستودع
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  
                  {/* Warehouse Name */}
                  <Form.Item 
                    name="name" 
                    label={<span style={{ color: '#64748b', fontWeight: 600, fontSize: '14px' }}>اسم المستودع</span>}
                    rules={[{ required: true, message: 'يرجى إدخال اسم المستودع' }]}
                    style={{ margin: 0 }}
                  >
                    <Input placeholder="أدخل اسم المستودع" style={{ backgroundColor: '#f8fafc' }} />
                  </Form.Item>

                  {/* Status Toggle */}
                  <Form.Item 
                    name="isActive" 
                    label={<span style={{ color: '#64748b', fontWeight: 600, fontSize: '14px' }}>حالة المستودع</span>}
                    valuePropName="checked"
                    style={{ margin: 0 }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', height: '44px' }}>
                      <Switch />
                      <span style={{ marginRight: '12px', fontWeight: 600, color: '#1e293b' }}>
                        {isActive !== false ? 'نشط' : 'غير نشط'}
                      </span>
                    </div>
                  </Form.Item>

                  {/* Address */}
                  <Form.Item 
                    name="address" 
                    label={<span style={{ color: '#64748b', fontWeight: 600, fontSize: '14px' }}>عنوان المستودع</span>}
                    style={{ margin: 0, gridColumn: '1 / -1' }}
                  >
                    <TextArea 
                      placeholder="أدخل عنوان المستودع بالتفصيل..." 
                      rows={4} 
                      style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '12px', resize: 'none' }} 
                    />
                  </Form.Item>

                  {/* Primary Warehouse */}
                  <Form.Item 
                    name="isPrimary" 
                    valuePropName="checked"
                    style={{ margin: 0, gridColumn: '1 / -1' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                      <Switch />
                      <span style={{ marginRight: '12px', fontWeight: 600, color: '#1e293b' }}>تعيين كمستودع رئيسي</span>
                    </div>
                  </Form.Item>
                </div>
              </>
            )}

            {activeTab === 'permissions' && (
              <>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', marginBottom: '24px' }}>
                  الصلاحيات
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* View Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <Form.Item 
                      name={['permissions', 'view']} 
                      label={<span style={{ color: '#64748b', fontWeight: 600, fontSize: '14px' }}>عرض</span>}
                      style={{ margin: 0 }}
                    >
                      <Select style={{ backgroundColor: '#f8fafc' }} popupMatchSelectWidth={false}>
                        <Option value="all">الكل</Option>
                        <Option value="specific_employee">موظف محدد</Option>
                        <Option value="specific_role">دور وظيفي محدد</Option>
                        <Option value="specific_branch">فرع محدد</Option>
                      </Select>
                    </Form.Item>
                    <div>
                      {viewPerm === 'specific_employee' && (
                        <Form.Item name={['permissions', 'view_employees']} label={<span style={{ color: '#64748b', fontWeight: 600, fontSize: '14px' }}>موظف</span>} style={{ margin: 0 }}>
                          <Select mode="multiple" placeholder="None selected" allowClear>
                            <Option value="lama">Lama (المالك)</Option>
                            <Option value="omar">Omar Mohamed #000001</Option>
                          </Select>
                        </Form.Item>
                      )}
                      {viewPerm === 'specific_role' && (
                        <Form.Item name={['permissions', 'view_roles']} label={<span style={{ color: '#64748b', fontWeight: 600, fontSize: '14px' }}>الدور الوظيفي</span>} style={{ margin: 0 }}>
                          <Select mode="multiple" placeholder="None selected" allowClear>
                            <Option value="manager">Manager</Option>
                            <Option value="staff">Staff</Option>
                          </Select>
                        </Form.Item>
                      )}
                      {viewPerm === 'specific_branch' && (
                        <Form.Item name={['permissions', 'view_branches']} label={<span style={{ color: '#64748b', fontWeight: 600, fontSize: '14px' }}>فرع</span>} style={{ margin: 0 }}>
                          <Select mode="multiple" placeholder="None selected" allowClear>
                            <Option value="main">الفرع الرئيسي</Option>
                          </Select>
                        </Form.Item>
                      )}
                    </div>
                  </div>

                  {/* Create Invoice Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <Form.Item 
                      name={['permissions', 'createInvoice']} 
                      label={<span style={{ color: '#64748b', fontWeight: 600, fontSize: '14px' }}>إنشاء فاتورة</span>}
                      style={{ margin: 0 }}
                    >
                      <Select style={{ backgroundColor: '#f8fafc' }} popupMatchSelectWidth={false}>
                        <Option value="all">الكل</Option>
                        <Option value="specific_employee">موظف محدد</Option>
                        <Option value="specific_role">دور وظيفي محدد</Option>
                        <Option value="specific_branch">فرع محدد</Option>
                      </Select>
                    </Form.Item>
                    <div>
                      {createInvoicePerm === 'specific_employee' && (
                        <Form.Item name={['permissions', 'createInvoice_employees']} label={<span style={{ color: '#64748b', fontWeight: 600, fontSize: '14px' }}>موظف</span>} style={{ margin: 0 }}>
                          <Select mode="multiple" placeholder="None selected" allowClear>
                            <Option value="lama">Lama (المالك)</Option>
                            <Option value="omar">Omar Mohamed #000001</Option>
                          </Select>
                        </Form.Item>
                      )}
                      {createInvoicePerm === 'specific_role' && (
                        <Form.Item name={['permissions', 'createInvoice_roles']} label={<span style={{ color: '#64748b', fontWeight: 600, fontSize: '14px' }}>الدور الوظيفي</span>} style={{ margin: 0 }}>
                          <Select mode="multiple" placeholder="None selected" allowClear>
                            <Option value="manager">Manager</Option>
                            <Option value="staff">Staff</Option>
                          </Select>
                        </Form.Item>
                      )}
                      {createInvoicePerm === 'specific_branch' && (
                        <Form.Item name={['permissions', 'createInvoice_branches']} label={<span style={{ color: '#64748b', fontWeight: 600, fontSize: '14px' }}>فرع</span>} style={{ margin: 0 }}>
                          <Select mode="multiple" placeholder="None selected" allowClear>
                            <Option value="main">الفرع الرئيسي</Option>
                          </Select>
                        </Form.Item>
                      )}
                    </div>
                  </div>

                  {/* Update Stock Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <Form.Item 
                      name={['permissions', 'updateStock']} 
                      label={<span style={{ color: '#64748b', fontWeight: 600, fontSize: '14px' }}>تعديل المخازن</span>}
                      style={{ margin: 0 }}
                    >
                      <Select style={{ backgroundColor: '#f8fafc' }} popupMatchSelectWidth={false}>
                        <Option value="all">الكل</Option>
                        <Option value="specific_employee">موظف محدد</Option>
                        <Option value="specific_role">دور وظيفي محدد</Option>
                        <Option value="specific_branch">فرع محدد</Option>
                      </Select>
                    </Form.Item>
                    <div>
                      {updateStockPerm === 'specific_employee' && (
                        <Form.Item name={['permissions', 'updateStock_employees']} label={<span style={{ color: '#64748b', fontWeight: 600, fontSize: '14px' }}>موظف</span>} style={{ margin: 0 }}>
                          <Select mode="multiple" placeholder="None selected" allowClear>
                            <Option value="lama">Lama (المالك)</Option>
                            <Option value="omar">Omar Mohamed #000001</Option>
                          </Select>
                        </Form.Item>
                      )}
                      {updateStockPerm === 'specific_role' && (
                        <Form.Item name={['permissions', 'updateStock_roles']} label={<span style={{ color: '#64748b', fontWeight: 600, fontSize: '14px' }}>الدور الوظيفي</span>} style={{ margin: 0 }}>
                          <Select mode="multiple" placeholder="None selected" allowClear>
                            <Option value="manager">Manager</Option>
                            <Option value="staff">Staff</Option>
                          </Select>
                        </Form.Item>
                      )}
                      {updateStockPerm === 'specific_branch' && (
                        <Form.Item name={['permissions', 'updateStock_branches']} label={<span style={{ color: '#64748b', fontWeight: 600, fontSize: '14px' }}>فرع</span>} style={{ margin: 0 }}>
                          <Select mode="multiple" placeholder="None selected" allowClear>
                            <Option value="main">الفرع الرئيسي</Option>
                          </Select>
                        </Form.Item>
                      )}
                    </div>
                  </div>

                </div>
              </>
            )}

          </div>
        </Form>
      </div>
    </ConfigProvider>
  );
}
